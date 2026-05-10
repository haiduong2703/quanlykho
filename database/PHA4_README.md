# Pha 4 — Tinh chỉnh form Nhập / Xuất / Sản phẩm

Pha cuối: nâng cấp UI cho 3 trang nghiệp vụ chính để tận dụng tất cả API mới (warehouse/batch/QC/FIFO/picking/units/attributes).

> Pha 4 **không** thay đổi backend, không cần migration mới.

## 1. ImportList — phiếu nhập

File: [frontend/src/pages/imports/ImportList.jsx](frontend/src/pages/imports/ImportList.jsx)

### Thêm vào form tạo/sửa phiếu nhập
- **Loại phiếu**: dropdown `Mua hàng từ NCC | Khách trả hàng | Nhận chuyển kho`
- **Kho nhập**: dropdown lấy từ `/warehouses/active` — bắt buộc
- **QC checkbox**: tích "Yêu cầu QC trước khi duyệt" → backend set `qc_status = PENDING`
- **Mỗi item** có thêm 3 ô (hàng dưới):
  - Mã lô (`batch_code`) — để trống nếu không quản lý lô
  - Ngày sản xuất (`manufacture_date`)
  - Hạn sử dụng (`expiry_date`)
  - Khi duyệt phiếu, backend tự tạo bản ghi `batches` và liên kết.

### Thêm vào modal chi tiết
- Hiển thị **Loại phiếu** và badge **QC status** (Đạt / Loại / Chờ kiểm / Không yêu cầu)
- 2 nút **QC Đạt** / **QC Loại** chỉ hiện khi `qc_status === 'PENDING'`
- Nút **Duyệt** sẽ bị disable khi QC chưa pass hoặc đã bị reject (kèm tooltip)

## 2. ExportList — phiếu xuất

File: [frontend/src/pages/exports/ExportList.jsx](frontend/src/pages/exports/ExportList.jsx)

### Thêm vào form
- **Loại phiếu**: `Xuất bán | Xuất hủy | Xuất chuyển kho`
- **Kho xuất**: dropdown bắt buộc
- **Quy tắc lấy lô**: `FIFO | LIFO | MANUAL`
- **Lý do hủy** (chỉ hiện khi `receipt_type === 'DISPOSAL'`)

### Thêm modal Picking List preview
- Nút **Xem Picking List** (chỉ phiếu PENDING) → mở modal hiển thị các lô sẽ được pick theo FIFO/LIFO trước khi duyệt
- Mỗi item hiển thị danh sách `batch_code | HSD | SL pick` và cảnh báo nếu thiếu

### Trạng thái giao hàng
- Sau khi APPROVED, hiện nút **Đánh dấu đã giao** → `picking_status = DELIVERED`

## 3. ProductList — sản phẩm

File: [frontend/src/pages/products/ProductList.jsx](frontend/src/pages/products/ProductList.jsx)

### Form thêm/sửa
- 3 field mới trong cùng 1 row:
  - **Tồn tối thiểu** (đã có)
  - **Tồn tối đa** (`max_stock`) — cảnh báo khi tồn ≥ mức này (0 = không giới hạn)
  - **Barcode cấp SKU** — quét bằng camera/máy quét sẽ tra cứu theo mã này

### Section "Đơn vị quy đổi" (chỉ hiện khi đang sửa SP đã tồn tại)
- Bảng liệt kê: đơn vị, hệ số (so với base), cờ base, barcode riêng (nếu có)
- Form thêm: nhập `unit_name`, `conversion_rate`, `barcode` (tuỳ chọn), tích `is_base`
- Nút xoá từng đơn vị

### Section "Thuộc tính"
- Bảng liệt kê `attr_name`, `attr_value` (vd `color: Đỏ`, `size: XL`)
- Form thêm + nút xoá

> Lý do **chỉ cho thêm đơn vị/thuộc tính sau khi tạo SP**: cần `product_id`. Khi tạo mới: lưu SP trước → mở lại Edit để gán đơn vị/thuộc tính.

## 4. Cách test

1. **Nhập kho theo lô + QC**:
   - Tạo phiếu nhập, tích QC, thêm 1 item kèm `batch_code = LOT-X`, `expiry_date = 2027-12-31` → Lưu
   - Mở chi tiết → bấm **QC Đạt** → bấm **Duyệt** → vào `/batches` thấy lô mới
2. **Xuất FIFO + Picking List**:
   - Có nhiều lô của 1 SKU với HSD khác nhau
   - Tạo phiếu xuất `pick_strategy=FIFO` → bấm **Xem Picking List** → thấy lô gần hết hạn nhất được chọn trước
   - Duyệt → mark Delivered
3. **Xuất hủy**:
   - Tạo phiếu xuất `receipt_type=DISPOSAL` → field "Lý do hủy" hiện ra → điền → duyệt
   - Vào `/stock-card` của SKU → có movement `DISPOSAL`
4. **SP có biến thể & barcode**:
   - Tạo SP → lưu → mở lại Edit
   - Thêm barcode `8930000000001`, `max_stock=200`
   - Section Đơn vị: thêm `Lốc, hệ số 6, base = false`, `Thùng, hệ số 24, base = false`, `Chai, hệ số 1, base = true`
   - Section Thuộc tính: `color: Đỏ`, `size: XL`
   - Vào `/scanner`, gõ tay barcode → thấy SP

## 5. Hạn chế còn lại

- **Edit SP cũ**: cột `barcode` của SP cũ trống cho đến khi sửa thủ công → có thể chạy SQL thủ công để gán hàng loạt:
  ```sql
  UPDATE products SET barcode = sku WHERE barcode IS NULL;
  ```
- **Quy đổi đơn vị trong form nhập/xuất**: hiện form vẫn nhập số lượng theo unit cơ sở. Để hỗ trợ nhập "5 Thùng" thay vì "120 Chai", cần thêm dropdown chọn đơn vị tại item — chưa làm để giữ form đơn giản. API `/product-units/convert` sẵn sàng khi muốn mở rộng.
- **Picking thủ công**: hiện auto-pick FIFO/LIFO khi duyệt. Nếu cần cho phép pick thủ công (chọn batch nào, vị trí nào), Modal Picking List có thể mở rộng thành **chọn lô + xác nhận** trước khi duyệt — cần thêm endpoint backend.

## 6. Tổng kết 4 pha

| Pha | Trọng tâm | File migration | Thay đổi chính |
|---|---|---|---|
| 1 | Schema nền tảng | `06_pha1_foundation.sql` | warehouses, locations, batches, product_units, product_attributes, stock_by_location, max_stock, barcode |
| 2 | Nghiệp vụ mở rộng | `07_pha2_operations.sql` | receipt_type, qc_status, pick_strategy, transfer workflow, alerts |
| 3 | Frontend & Báo cáo | (không) | 7 trang mới: Warehouses/Locations/Batches/Transfers/StockCard/ABC/Scanner + 3 component barcode + AlertBanner |
| 4 | Tinh chỉnh form | (không) | ImportList/ExportList/ProductList nâng cấp dùng API mới |

Đã đáp ứng đầy đủ các yêu cầu của thầy:
- ✅ Nhập kho: mua, trả, chuyển + QC + Barcode (in & quét)
- ✅ Xuất kho: bán, hủy, chuyển + FIFO/LIFO + Picking List
- ✅ Tồn kho: kiểm kê (sẵn có), điều chỉnh, cảnh báo min + max
- ✅ Báo cáo: tồn thời gian thực, hàng bán chạy/chậm (ABC), thẻ kho
- ✅ SKU: mã, tên, đơn vị + quy đổi, hình ảnh, thuộc tính (màu/size)
- ✅ Quản lý vị trí (zone/aisle/rack/shelf/bin)
- ✅ Vendor & Customer (sẵn có)
- ✅ Multi-warehouse + transfer
