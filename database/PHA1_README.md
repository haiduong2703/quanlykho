# Pha 1 — Nền tảng dữ liệu (Foundation)

Mục tiêu: bổ sung nền tảng dữ liệu cho các tính năng thầy yêu cầu (multi-warehouse, location, batch/expiry, đơn vị quy đổi, thuộc tính sản phẩm, barcode, max_stock). Các pha sau sẽ xây nghiệp vụ lên trên.

## 1. Cách chạy migration

File migration: `database/06_pha1_foundation.sql`. Migration idempotent — có thể chạy lại an toàn.

### Windows / MySQL CLI
```bash
mysql -u root -p warehouse_db < database/06_pha1_foundation.sql
```

### Hoặc trong MySQL Workbench
1. Mở file `database/06_pha1_foundation.sql`
2. Chọn database `warehouse_db`
3. Bấm Execute (Ctrl + Shift + Enter)

### Kiểm tra sau khi chạy
```sql
USE warehouse_db;
SHOW TABLES LIKE '%wareh%';          -- warehouses, warehouse_locations
SHOW TABLES LIKE 'batches';
SHOW TABLES LIKE 'product_%';         -- product_units, product_attributes
SHOW TABLES LIKE 'stock_by_location';
SHOW TABLES LIKE 'transfer_%';        -- transfer_receipts(_items) (cho Pha 2)
SHOW COLUMNS FROM products LIKE 'max_stock';
SHOW COLUMNS FROM products LIKE 'barcode';
SELECT code, name, is_default FROM warehouses;   -- phải có WH01
SELECT COUNT(*) FROM product_units;              -- = số products
```

## 2. Thay đổi schema

| Bảng / cột | Loại | Ghi chú |
|---|---|---|
| `warehouses` | NEW | Nhiều kho — có `is_default`, `manager_user_id` |
| `warehouse_locations` | NEW | Khu vực → Dãy → Kệ → Tầng → Ô (zone/aisle/rack/shelf/bin) |
| `batches` | NEW | Lô hàng + hạn sử dụng (`manufacture_date`, `expiry_date`, `remaining_quantity`, status ACTIVE/EXPIRED/DAMAGED/DEPLETED) — nền tảng cho FIFO/LIFO & xuất hủy |
| `product_units` | NEW | Quy đổi đơn vị (Thùng → Lốc → Chai). Có `barcode` riêng cho từng đơn vị |
| `product_attributes` | NEW | Biến thể: màu sắc, kích cỡ, … (key-value) |
| `stock_by_location` | NEW | Tồn chi tiết: product × warehouse × location × batch. Bảng `stocks` cũ giữ nguyên làm tồn tổng |
| `transfer_receipts(_items)` | NEW | Phiếu chuyển kho nội bộ (schema sẵn, dùng ở Pha 2) |
| `products.max_stock` | ADD | Cảnh báo vượt ngưỡng tối đa |
| `products.barcode` | ADD | Barcode cấp sản phẩm + `idx_barcode` |
| `stock_movements.type` | ALTER | Thêm TRANSFER_IN/OUT, RETURN_IN, DISPOSAL, QC_REJECT |
| `stock_movements.warehouse_id/batch_id/location_id` | ADD | Truy xuất chính xác nguồn biến động |

## 3. Backfill dữ liệu cũ
- Mỗi sản phẩm hiện có được tự động sinh 1 `product_units` cơ sở (`is_base = TRUE`, `conversion_rate = 1`) từ cột `products.unit`.
- Bảng `stocks` cũ được chép sang `stock_by_location` tại **kho mặc định WH01**, `location_id = NULL`, `batch_id = NULL` (tồn tổng chưa gắn vị trí/lô).
- `warehouses` được seed sẵn `WH01 — Kho chính`.

## 4. API mới

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/warehouses` | Danh sách kho (phân trang, lọc) |
| GET | `/api/warehouses/active` | Tất cả kho đang hoạt động (cho dropdown) |
| POST/PUT/DELETE/PATCH toggle-status | `/api/warehouses[/:id]` | CRUD kho |
| GET | `/api/locations?warehouse_id=1` | Liệt kê vị trí |
| GET | `/api/locations/warehouse/:warehouseId` | Vị trí trong 1 kho |
| POST/PUT/DELETE | `/api/locations[/:id]` | CRUD vị trí (code tự sinh từ zone-aisle-rack-shelf-bin nếu không truyền) |
| GET | `/api/batches?product_id=&only_available=true` | Lô hàng |
| GET | `/api/batches/available/:productId?mode=FIFO|LIFO` | Lô còn hàng theo FIFO/LIFO |
| GET | `/api/batches/expiring-soon?days=30` | Lô sắp hết hạn |
| POST/PUT/DELETE | `/api/batches[/:id]` | CRUD lô |
| GET | `/api/product-units/product/:productId` | Đơn vị của 1 sản phẩm |
| GET | `/api/product-units/by-barcode?barcode=...` | Phân giải barcode → đơn vị + sản phẩm |
| POST | `/api/product-units/convert` | Quy đổi: `{product_id, from_unit, to_unit, quantity}` |
| POST/PUT/DELETE | `/api/product-units[/:id]` | CRUD đơn vị |
| GET | `/api/product-attributes/product/:productId` | Thuộc tính của 1 sản phẩm |
| PUT | `/api/product-attributes/product/:productId/bulk` | Thay toàn bộ danh sách thuộc tính |
| POST/PUT/DELETE | `/api/product-attributes[/:id]` | CRUD thuộc tính |
| GET | `/api/stock-by-location` | Tồn chi tiết theo vị trí/lô |
| GET | `/api/stock-by-location/product/:productId/summary` | Tồn 1 SKU tổng + chia theo kho |
| GET | `/api/products/barcode/:code` | Quét barcode → sản phẩm (dùng cho camera/máy quét, Pha 3) |

## 5. Điểm lưu ý trước khi sang Pha 2
- Bảng `stocks` cũ chưa bị bỏ. Logic import/export/inventory-check **vẫn đang cập nhật `stocks`**, không cập nhật `stock_by_location`. Pha 2 sẽ chuyển logic sang cập nhật `stock_by_location` (có batch + warehouse) và sync ngược về `stocks` như cache.
- `transfer_receipts` đã có schema nhưng chưa có controller. Pha 2 sẽ làm phiếu chuyển kho, FIFO/LIFO picking, QC, RETURN, DISPOSAL.
- Frontend chưa có UI cho các entity mới — sẽ làm ở Pha 3.

## 6. Khôi phục (nếu cần)
Migration chỉ **thêm** bảng và cột, không xoá gì. Nếu cần rollback trong môi trường dev:
```sql
DROP TABLE IF EXISTS transfer_receipt_items;
DROP TABLE IF EXISTS transfer_receipts;
DROP TABLE IF EXISTS stock_by_location;
DROP TABLE IF EXISTS product_attributes;
DROP TABLE IF EXISTS product_units;
DROP TABLE IF EXISTS batches;
DROP TABLE IF EXISTS warehouse_locations;
DROP TABLE IF EXISTS warehouses;
ALTER TABLE products DROP COLUMN max_stock, DROP COLUMN barcode;
-- stock_movements.type vẫn giữ enum mở rộng, không ảnh hưởng logic cũ.
```
