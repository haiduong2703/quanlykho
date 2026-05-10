# Pha 2 — Mở rộng nghiệp vụ nhập/xuất/chuyển kho

Xây tiếp trên Pha 1. Thêm **phân loại phiếu**, **QC**, **FIFO/LIFO**, **Picking List**, **Chuyển kho nội bộ**, **Cảnh báo tồn/HSD**.

## 1. Chạy migration

```bash
mysql -u root -p warehouse_db < database/07_pha2_operations.sql
```

**Yêu cầu**: phải chạy `06_pha1_foundation.sql` trước (vì Pha 2 dùng các bảng `warehouses`, `batches`, `transfer_receipts`).

Migration idempotent — an toàn chạy lại. Backfill `receipt_type='PURCHASE'` cho mọi phiếu nhập cũ, `'SALE'` cho mọi phiếu xuất cũ, và gán `warehouse_id` = kho mặc định (WH01).

### Kiểm tra
```sql
SHOW COLUMNS FROM import_receipts LIKE 'receipt_type';  -- PURCHASE|CUSTOMER_RETURN|TRANSFER_IN
SHOW COLUMNS FROM import_receipts LIKE 'qc_status';     -- NOT_REQUIRED|PENDING|PASSED|REJECTED
SHOW COLUMNS FROM export_receipts LIKE 'pick_strategy'; -- FIFO|LIFO|MANUAL
SHOW COLUMNS FROM export_receipts LIKE 'picking_status';
SHOW COLUMNS FROM import_receipt_items LIKE 'batch_id';
SHOW TABLES LIKE 'export_receipt_picks';                 -- NEW
```

## 2. Luồng mới

### 2.1. Nhập kho có QC + tạo Lô hàng
```
POST /api/imports
Body: {
  receipt_type: 'PURCHASE',          // mặc định; có thể CUSTOMER_RETURN, TRANSFER_IN
  warehouse_id: 1,                   // tuỳ chọn; thiếu → dùng kho mặc định
  supplier_id: 5,
  qc_required: true,                 // buộc QC trước khi duyệt
  items: [
    {
      product_id: 10,
      quantity: 100,
      unit_price: 25000,
      batch_code: 'LOT2026-04',      // sẽ tạo Batch tự động khi duyệt
      manufacture_date: '2026-04-01',
      expiry_date: '2027-04-01',
      location_id: 3                 // tuỳ chọn
    }
  ]
}
```

Quy trình:
1. Tạo phiếu → trạng thái `PENDING`, `qc_status = PENDING` nếu `qc_required=true`.
2. Nhân viên QC gọi `PATCH /api/imports/:id/qc` với `{ qc_status: 'PASSED' | 'REJECTED', qc_note }`.
3. Chỉ khi `qc_status` ≠ `PENDING` và ≠ `REJECTED` thì `PATCH /api/imports/:id/approve` mới chạy được.
4. Khi duyệt:
   - Mỗi item có `batch_code`: tạo bản ghi `batches` mới (hoặc cộng vào batch cũ nếu `batch_code` trùng).
   - Cộng tồn vào `stock_by_location` (product × warehouse × location × batch).
   - Cộng tồn tổng vào `stocks`.
   - Ghi `stock_movements` với `type = IMPORT | RETURN_IN | TRANSFER_IN` (theo `receipt_type`) kèm `warehouse_id`, `batch_id`, `location_id`.

### 2.2. Xuất kho FIFO/LIFO + Picking List
```
POST /api/exports
Body: {
  receipt_type: 'SALE',              // hoặc DISPOSAL, TRANSFER_OUT
  warehouse_id: 1,
  pick_strategy: 'FIFO',             // hoặc 'LIFO', 'MANUAL'
  customer_id: 7,
  items: [ { product_id: 10, quantity: 40, unit_price: 30000 } ]
}
```

- `GET /api/exports/:id/picking-list` — preview batch nào sẽ được pick (không commit).
- `PATCH /api/exports/:id/approve` — khi duyệt sẽ **auto-pick theo FIFO/LIFO**: với mỗi item, quét `batches` còn hàng trong kho theo thứ tự `expiry_date` (FIFO) hoặc `created_at DESC` (LIFO), trừ `batches.remaining_quantity`, trừ `stock_by_location`, ghi từng lần pick vào `export_receipt_picks`.
- `PATCH /api/exports/:id/deliver` — chuyển `picking_status` sang `DELIVERED`.

Loại phiếu đặc biệt:
- **DISPOSAL (xuất hủy)**: `customer_id` có thể để trống, bắt buộc `disposal_reason`. Log movement type `DISPOSAL`.
- **TRANSFER_OUT**: sẽ dùng qua bảng `transfer_receipts` (xem bên dưới).

### 2.3. Chuyển kho nội bộ
2 bước — an toàn khi hàng đang vận chuyển:

```
POST /api/transfers
Body: {
  from_warehouse_id: 1,
  to_warehouse_id: 2,
  items: [ { product_id: 10, quantity: 20, batch_id: 15 } ]  // batch_id tuỳ chọn
}
```

Trạng thái: `PENDING → IN_TRANSIT → COMPLETED` (hoặc `REJECTED`, `CANCELLED`).

- `PATCH /api/transfers/:id/approve` (ADMIN): trừ tồn kho nguồn → `IN_TRANSIT`. Nếu `batch_id` để trống, tự FIFO.
- `PATCH /api/transfers/:id/receive` (người ở kho đích): cộng tồn kho đích → `COMPLETED`.
- `PATCH /api/transfers/:id/reject` / `cancel`: huỷ phiếu khi chưa/đang chờ duyệt.

### 2.4. Cảnh báo tồn kho & hạn sử dụng
| Endpoint | Mô tả |
|---|---|
| `GET /api/alerts/summary` | Số lượng: low_stock, over_stock, expiring_soon_30d, expired |
| `GET /api/alerts/low-stock` | Sản phẩm `quantity <= min_stock` |
| `GET /api/alerts/over-stock` | Sản phẩm `quantity >= max_stock` |
| `GET /api/alerts/expiring-batches?days=30` | Lô sắp hết hạn trong N ngày |
| `GET /api/alerts/expired-batches` | Lô đã quá HSD mà còn tồn |

## 3. Bảng/Cột mới hoặc đổi

| Bảng / cột | Thay đổi |
|---|---|
| `import_receipts.receipt_type` | NEW enum `PURCHASE / CUSTOMER_RETURN / TRANSFER_IN` |
| `import_receipts.warehouse_id` | NEW FK → warehouses |
| `import_receipts.qc_status, qc_note, qc_by, qc_at` | NEW (workflow QC) |
| `import_receipts.source_export_receipt_id, source_transfer_receipt_id` | NEW tham chiếu nguồn (cho phiếu trả hàng / nhận chuyển) |
| `import_receipt_items.batch_id, location_id, batch_code, manufacture_date, expiry_date` | NEW (nhập kho theo lô) |
| `export_receipts.receipt_type, warehouse_id, disposal_reason, pick_strategy, picking_status` | NEW |
| `export_receipt_items.picked_quantity` | NEW |
| `export_receipt_picks` | NEW: mỗi request xuất có thể chia thành nhiều lần pick (1 item → N batch) |
| `inventory_checks.warehouse_id` | NEW (kiểm kê theo kho) |

## 4. Tương thích ngược

- Mọi phiếu nhập/xuất cũ được tự động set `receipt_type = PURCHASE/SALE` và `warehouse_id = WH01` trong bước backfill → logic cũ vẫn hoạt động bình thường.
- `stocks` (tồn tổng) vẫn được cập nhật song song với `stock_by_location` (tồn chi tiết). Các endpoint `/api/stocks/*` cũ không đổi.
- `stock_movements.type` mở rộng enum nhưng giữ các giá trị cũ (IMPORT/EXPORT/ADJUST/INVENTORY_CHECK).

## 5. Hạn chế còn lại (để Pha 3/4 xử lý)
- **Frontend chưa có UI** cho QC, Picking List, Transfer, cảnh báo.
- **In Barcode/QR** và **đọc bằng camera**: API `/api/products/barcode/:code` sẵn sàng từ Pha 1; UI & component scanner sẽ làm ở Pha 3.
- **Báo cáo ABC & Thẻ kho**: sẽ làm ở Pha 3 (stock_movements đã đủ dữ liệu).
- **Quy đổi đơn vị trên form nhập/xuất**: API có sẵn (`/api/product-units/convert`); tích hợp vào form ở Pha 4.

## 6. Rollback (dev)

Pha 2 chỉ ADD columns/tables — không xoá. Rollback:
```sql
DROP TABLE IF EXISTS export_receipt_picks;
ALTER TABLE export_receipt_items DROP COLUMN picked_quantity;
ALTER TABLE export_receipts
  DROP FOREIGN KEY fk_export_warehouse,
  DROP COLUMN receipt_type, DROP COLUMN warehouse_id, DROP COLUMN disposal_reason,
  DROP COLUMN pick_strategy, DROP COLUMN picking_status;
ALTER TABLE import_receipt_items
  DROP FOREIGN KEY fk_import_item_batch, DROP FOREIGN KEY fk_import_item_location,
  DROP COLUMN batch_id, DROP COLUMN location_id, DROP COLUMN batch_code,
  DROP COLUMN manufacture_date, DROP COLUMN expiry_date;
ALTER TABLE import_receipts
  DROP FOREIGN KEY fk_import_warehouse, DROP FOREIGN KEY fk_import_qc_by,
  DROP FOREIGN KEY fk_import_src_export, DROP FOREIGN KEY fk_import_src_transfer,
  DROP COLUMN receipt_type, DROP COLUMN warehouse_id,
  DROP COLUMN qc_status, DROP COLUMN qc_note, DROP COLUMN qc_by, DROP COLUMN qc_at,
  DROP COLUMN source_export_receipt_id, DROP COLUMN source_transfer_receipt_id;
ALTER TABLE inventory_checks DROP FOREIGN KEY fk_icheck_warehouse, DROP COLUMN warehouse_id;
```
