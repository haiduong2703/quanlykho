# 📋 Kịch bản Test — 4 Pha QuanLyKho

Tài liệu test toàn bộ tính năng đã làm trong 4 pha. Mỗi case có **mục đích**, **các bước**, **kết quả mong đợi** và checkbox để tick khi test xong.

---

## 0. Chuẩn bị môi trường

### 0.1. Setup
- [ ] **DB**: chạy lần lượt 7 file SQL theo thứ tự
  ```bash
  mysql -u root -p warehouse_db < database/01_schema.sql
  mysql -u root -p warehouse_db < database/02_seed.sql
  mysql -u root -p warehouse_db < database/03_inventory_check.sql
  mysql -u root -p warehouse_db < database/04_migrations.sql
  mysql -u root -p warehouse_db < database/05_svietdecor_seed.sql
  mysql -u root -p warehouse_db < database/06_pha1_foundation.sql
  mysql -u root -p warehouse_db < database/07_pha2_operations.sql
  ```
- [ ] **Backend**: `cd backend && npm install && npm run dev` → port 5000 chạy OK
- [ ] **Frontend**: `cd frontend && npm install && npm run dev` → port 5173 mở được
- [ ] **Login**: vào `http://localhost:5173/login` với `admin/admin123` (theo seed)

### 0.2. Verify migration thành công
Chạy trong MySQL:
```sql
USE warehouse_db;
SHOW TABLES LIKE 'warehouses';            -- phải có
SHOW TABLES LIKE 'warehouse_locations';   -- phải có
SHOW TABLES LIKE 'batches';               -- phải có
SHOW TABLES LIKE 'product_units';         -- phải có
SHOW TABLES LIKE 'product_attributes';    -- phải có
SHOW TABLES LIKE 'stock_by_location';     -- phải có
SHOW TABLES LIKE 'transfer_receipts';     -- phải có
SHOW TABLES LIKE 'export_receipt_picks';  -- phải có
SHOW COLUMNS FROM products LIKE 'max_stock'; -- phải có
SHOW COLUMNS FROM products LIKE 'barcode';   -- phải có
SELECT code, name, is_default FROM warehouses;  -- phải thấy WH01 mặc định
SELECT COUNT(*) FROM product_units;             -- phải bằng số products
```
- [ ] Tất cả query trên đều cho kết quả hợp lệ.

---

## PHA 1 — Schema nền tảng

### TC-1.1 — Tạo Kho mới
**Mục đích**: kiểm tra CRUD warehouse + ràng buộc kho mặc định duy nhất.

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/warehouses` | Thấy `WH01 — Kho chính (mặc định)` |
| 2. Bấm **+ Thêm kho**, nhập tên "Kho phụ", địa chỉ "456 Lê Lợi", **không** tích "kho mặc định" → Lưu | Mã tự sinh `WH02`, hiện trong list |
| 3. Sửa kho `WH02` → tích **đặt mặc định** → Lưu | `WH02` có icon ⭐, `WH01` không còn mặc định |
| 4. Bấm xoá `WH02` (đang là mặc định) | Toast lỗi "Không thể xoá kho mặc định" |
| 5. Đặt `WH01` lại mặc định, rồi xoá `WH02` | Xoá thành công |

- [ ] Pass

### TC-1.2 — Tạo vị trí kho (zone/aisle/rack/shelf/bin)
**Mục đích**: kiểm tra CRUD location + auto-generate code.

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/locations`, lọc theo kho `WH01` | List rỗng |
| 2. Bấm **+ Thêm vị trí**, kho `WH01`, zone `A`, aisle `01`, rack `01`, shelf `01`, bin `01`, không nhập code → Lưu | Mã tự sinh `A-01-01-01-01` |
| 3. Thêm thêm `A-01-01-01-02`, `A-01-01-02-01`, `B-01` (chỉ zone+aisle) | 4 vị trí trong list, sắp xếp theo zone/aisle |
| 4. Tạo trùng mã `A-01-01-01-01` cùng kho `WH01` | Toast "Mã vị trí đã tồn tại" |
| 5. Tạo `A-01-01-01-01` ở kho `WH02` (mới tạo lại WH02 nếu cần) | Cho phép — mã chỉ unique trong 1 kho |

- [ ] Pass

### TC-1.3 — Quản lý Lô hàng (chỉ list, chưa tạo qua API trực tiếp)
**Mục đích**: kiểm tra page Batches load được; lô tạo qua phiếu nhập sẽ test ở Pha 2.

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/batches` | Trang load OK, có thể list rỗng nếu chưa nhập kho có batch |
| 2. Filter dropdown kho, status, "Chỉ còn hàng" hoạt động | Bộ lọc có phản hồi |

- [ ] Pass

### TC-1.4 — Endpoint Barcode lookup
**Mục đích**: API `/api/products/barcode/:code` trả đúng SP.

```bash
# Set barcode cho 1 SP qua DB:
mysql -u root -p warehouse_db -e "UPDATE products SET barcode='BC-TEST-001' WHERE id=1;"
```
| Bước | Kỳ vọng |
|---|---|
| 1. `curl http://localhost:5000/api/products/barcode/BC-TEST-001 -H "Authorization: Bearer <TOKEN>"` | Trả về JSON sản phẩm id=1 |
| 2. `curl ...barcode/KHONG-CO` | 404 "Không tìm thấy" |

- [ ] Pass

### TC-1.5 — Backfill stock_by_location
**Mục đích**: dữ liệu tồn cũ đã được chép vào `stock_by_location` ở kho mặc định.

```sql
SELECT
  (SELECT SUM(quantity) FROM stocks) AS total_stocks,
  (SELECT SUM(quantity) FROM stock_by_location) AS total_sbl;
```
- [ ] Hai số bằng nhau (hoặc rất gần — chấp nhận chênh do giao dịch mới)

---

## PHA 2 — Nghiệp vụ mở rộng

### TC-2.1 — Phiếu nhập có QC + tạo Lô hàng
**Mục đích**: workflow nhập với QC + auto-tạo batch.

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/imports`, bấm **+ Tạo phiếu nhập** | Modal mở với field Loại phiếu, Kho nhập, QC checkbox |
| 2. Chọn loại `Mua hàng từ NCC`, kho `WH01`, **tích QC**, NCC bất kỳ | OK |
| 3. Thêm 1 item: SKU bất kỳ, SL=100, đơn giá=20000, **batch_code=`LOT-2026-01`**, **expiry_date=`2027-12-31`** → Lưu | Phiếu tạo thành công, status `PENDING` |
| 4. Mở chi tiết phiếu | Badge "Loại phiếu: Mua từ NCC", "QC status: Chờ kiểm" (vàng) |
| 5. Bấm **Duyệt** ngay | Disabled (tooltip "Cần QC trước") hoặc lỗi |
| 6. Bấm **QC Đạt** | Toast "QC: PASSED", badge xanh |
| 7. Bấm **Duyệt** | Status → `APPROVED` |
| 8. Vào `/batches` | Lô `LOT-2026-01` xuất hiện, `remaining_quantity = 100`, HSD `31/12/2027` |

- [ ] Pass

### TC-2.2 — Phiếu nhập bị QC từ chối
| Bước | Kỳ vọng |
|---|---|
| 1. Tạo phiếu nhập tương tự TC-2.1 nhưng item khác → tích QC | Phiếu PENDING, QC PENDING |
| 2. Bấm **QC Loại** | QC status = `REJECTED` (đỏ) |
| 3. Bấm **Duyệt** | Disabled (không cho duyệt) |

- [ ] Pass

### TC-2.3 — Phiếu xuất FIFO + Picking List preview
**Mục đích**: auto-pick FIFO, ưu tiên lô có HSD gần hết trước.

**Tiền điều kiện**: 1 SKU có ≥ 2 lô đang ACTIVE với HSD khác nhau.
- Setup nhanh: làm TC-2.1 hai lần với SKU giống, batch_code khác (`LOT-A` HSD 2027-06, `LOT-B` HSD 2026-12), số lượng 50 mỗi lô.

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/exports` → **+ Tạo phiếu xuất** | Modal có field Kho/Loại/Pick strategy |
| 2. Chọn loại `SALE`, kho `WH01`, pick_strategy=`FIFO`, KH bất kỳ | OK |
| 3. Thêm item SKU đó, SL=70 → Lưu | Phiếu PENDING |
| 4. Mở chi tiết → bấm **Xem Picking List** | Modal preview hiện 2 dòng: `LOT-B` (HSD 2026-12) lấy 50, `LOT-A` lấy 20 |
| 5. Đóng preview, bấm **Duyệt** | APPROVED, picking_status = `PICKED` |
| 6. Vào `/batches` filter SKU đó | `LOT-B` còn 0 (status `DEPLETED`), `LOT-A` còn 30 |
| 7. Quay lại detail phiếu xuất → bấm **Đánh dấu đã giao** | picking_status = `DELIVERED` |

- [ ] Pass

### TC-2.4 — Phiếu xuất LIFO
| Bước | Kỳ vọng |
|---|---|
| 1. Tạo phiếu xuất giống TC-2.3 nhưng `pick_strategy=LIFO` | OK |
| 2. Xem Picking List | Lô **mới nhập sau** được pick trước (theo `created_at DESC`) |

- [ ] Pass

### TC-2.5 — Phiếu xuất hủy (DISPOSAL)
| Bước | Kỳ vọng |
|---|---|
| 1. Tạo phiếu xuất, loại `DISPOSAL` | Field "Lý do hủy" hiện ra (bắt buộc) |
| 2. Nhập lý do "Hết hạn", item SL=10 → Lưu → Duyệt | OK, không cần khách hàng |
| 3. Vào `/stock-card` của SKU đó → tìm movement vừa tạo | Type = `DISPOSAL`, note = "Hết hạn" |

- [ ] Pass

### TC-2.6 — Tồn kho không đủ → block xuất
| Bước | Kỳ vọng |
|---|---|
| 1. Tạo phiếu xuất với SL > tồn hiện có (ví dụ 999999) | Toast lỗi "Tồn kho không đủ" ngay khi tạo |
| 2. Nếu lách qua được, lúc duyệt cũng phải bị chặn | Toast lỗi |

- [ ] Pass

### TC-2.7 — Chuyển kho nội bộ (Transfer)
**Tiền điều kiện**: có ≥ 2 kho (`WH01`, `WH02`), có tồn ở `WH01`.

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/transfers` → **+ Tạo phiếu chuyển** | Modal hiện 2 dropdown kho |
| 2. From `WH01`, To `WH02`, thêm item SKU + SL=20 → Lưu | Phiếu PENDING |
| 3. Bấm **Duyệt** (icon ✓ xanh) | Status → `IN_TRANSIT`, tồn `WH01` giảm 20 |
| 4. Vào `/stock-by-location?warehouse_id=2` (Postman) | SL của SKU ở `WH02` chưa thay đổi |
| 5. Quay lại `/transfers`, bấm icon Truck (Xác nhận nhận) | Status → `COMPLETED`, tồn `WH02` tăng 20 |

- [ ] Pass

### TC-2.8 — Cảnh báo tồn min/max + HSD
**Tiền điều kiện**: 
- Đặt 1 SP có `min_stock = 50` mà tồn hiện tại < 50
- Đặt 1 SP có `max_stock = 100` mà tồn ≥ 100
- Có ít nhất 1 batch với `expiry_date < CURDATE() + 30 day`

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/` (Dashboard) | AlertBanner trên cùng hiện 4 card (low/over/expiring/expired) tuỳ tình huống |
| 2. Click card "Dưới tồn tối thiểu" | Chuyển sang `/stocks?low_stock=true` |
| 3. Click card "Lô sắp hết hạn" | Chuyển sang `/batches` |
| 4. `curl /api/alerts/summary` | JSON đầy đủ 4 con số |

- [ ] Pass

---

## PHA 3 — Frontend & Báo cáo

### TC-3.1 — Trang Thẻ kho (Stock Card)
| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/stock-card`, gõ 2 ký tự SKU/tên SP | Autocomplete dropdown các SP khớp |
| 2. Click 1 SP | Hiện card SP + tồn hiện tại + bảng movements |
| 3. Lọc theo type `IMPORT` | Chỉ hiện movements nhập |
| 4. Lọc theo khoảng ngày | Bảng filter đúng |
| 5. Nhìn cột "SL" | Số dương màu xanh (+100), số âm màu đỏ (-20) |
| 6. Cột Loại có badge với icon (📥 Nhập, 📤 Xuất, ⚙️ Điều chỉnh, ↔️ Chuyển, 🗑️ Hủy) | OK |

- [ ] Pass

### TC-3.2 — Phân tích ABC
**Tiền điều kiện**: có ≥ 5 phiếu xuất APPROVED với nhiều SKU khác nhau.

| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/abc-analysis` | 4 card summary (A/B/C + tổng) + bảng items |
| 2. Đổi metric sang `Số lượng xuất` | Bảng resort theo total_quantity |
| 3. Click card **A** | Bảng filter chỉ còn nhóm A |
| 4. Click lại card A | Bỏ filter |
| 5. Đổi từ_date / to_date | Bảng cập nhật theo khoảng |
| 6. Cột "% luỹ kế" | Tăng dần đến 100%, nhóm A ≤ 70%, B ≤ 90%, C ≤ 100% |

- [ ] Pass

### TC-3.3 — Camera Scanner (cần laptop có webcam HOẶC mobile + HTTPS)
| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/scanner` (qua `localhost`) | Trang load, có ô Camera bên trái |
| 2. Trình duyệt xin quyền camera → Cho phép | Hiện video stream + nút "Bắt đầu quét" / "Dừng quét" |
| 3. Nếu có nhiều camera, dropdown chọn camera xuất hiện | OK |
| 4. Trỏ camera vào barcode bất kỳ (in từ Google "barcode CODE128 sample") | Toast hiện code, panel kết quả hiện thông tin SP (nếu barcode đã gán) |
| 5. **Test máy quét USB**: focus vào ô input "Nhập tay", quét barcode bằng USB scanner | Code tự nhập + Enter → tra cứu |

- [ ] Pass (nếu không có camera, ghi chú "Không test được")

### TC-3.4 — In tem Barcode/QR
| Bước | Kỳ vọng |
|---|---|
| 1. Trong `/scanner`, sau khi tra cứu thành công 1 SP | Section "In tem cho sản phẩm" xuất hiện |
| 2. Đổi loại tem `Barcode CODE128` | Hiển thị barcode dạng vạch |
| 3. Đổi sang `QR` | Hiển thị mã QR |
| 4. Click **In tất cả** (nếu dùng `BarcodePrintSheet`) | Mở cửa sổ in mới |

- [ ] Pass

### TC-3.5 — Routes & Menu
- [ ] Sidebar có đủ 7 mục mới: Kho, Vị trí trong kho, Lô hàng, Chuyển kho, Thẻ kho, Phân tích ABC, Quét/In mã
- [ ] Click từng mục, route mở đúng trang, không trắng trang

---

## PHA 4 — Tinh chỉnh form

### TC-4.1 — Form Nhập kho mới (UI)
| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/imports` → **+ Tạo phiếu nhập** | Modal có form-row 3 cột: Loại phiếu, Kho nhập, QC checkbox |
| 2. Đổi loại sang `CUSTOMER_RETURN` | Vẫn submit được, payload `receipt_type='CUSTOMER_RETURN'` |
| 3. Thêm 1 item — kiểm tra ô `batch_code`, `manufacture_date`, `expiry_date` | Hiện 3 ô riêng dưới dòng SKU/SL/giá |
| 4. Để trống batch_code → vẫn lưu được | OK (lô không bắt buộc) |

- [ ] Pass

### TC-4.2 — Form Xuất kho mới (UI)
| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/exports` → **+ Tạo phiếu xuất** | Modal có Loại/Kho/Pick strategy |
| 2. Chọn loại `DISPOSAL` | Field "Lý do hủy" xuất hiện ngay phía dưới |
| 3. Đổi lại `SALE` | Field "Lý do hủy" ẩn đi |
| 4. Submit không chọn kho | Lỗi (kho bắt buộc) |

- [ ] Pass

### TC-4.3 — Form Sản phẩm mới (UI)
| Bước | Kỳ vọng |
|---|---|
| 1. Vào `/products` → **+ Thêm sản phẩm** | Form có 3 ô mới: Tồn tối thiểu, Tồn tối đa, Barcode |
| 2. Tạo SP mới với barcode `BC-TEST-NEW` → Lưu | OK |
| 3. Mở **Edit** SP vừa tạo | Hiển thị section "Đơn vị quy đổi" và "Thuộc tính" (chỉ hiện khi edit) |
| 4. Thêm đơn vị: name=`Lốc`, hệ số `6`, không tích base | Bảng đơn vị có 2 dòng (`Cái` base + `Lốc`) |
| 5. Thêm thuộc tính: `color: Đỏ`, `size: XL` | Bảng có 2 thuộc tính |
| 6. Bấm xoá 1 đơn vị/thuộc tính | Mất khỏi bảng |
| 7. Vào `/scanner`, gõ tay barcode `BC-TEST-NEW` | Trả đúng SP |

- [ ] Pass

### TC-4.4 — Quy đổi đơn vị (API)
```bash
# Giả sử SP id=1 có units: Chai (base, rate=1), Lốc (rate=6), Thùng (rate=24)
curl -X POST http://localhost:5000/api/product-units/convert \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"from_unit":"Thùng","to_unit":"Chai","quantity":2}'
```
- [ ] Trả về `{ converted_quantity: 48 }` (2 thùng × 24 chai)

---

## 🔄 End-to-End — Luồng hoàn chỉnh

### TC-E2E-1 — Vòng đời 1 SKU
**Mục đích**: simulate 1 ngày làm việc thực tế.

| Bước | Hành động | Verify |
|---|---|---|
| 1 | Tạo SP `Coca 330ml`, SKU=`COCA330`, barcode `8930000001`, min=50, max=500, base unit `Chai` | OK |
| 2 | Sửa SP, thêm đơn vị `Lốc` (rate 6), `Thùng` (rate 24) | 3 đơn vị |
| 3 | Tạo phiếu nhập có QC, kho `WH01`, item `COCA330`, SL=240, đơn giá 8000, batch=`LOT-Q1`, HSD=2026-12-31 | PENDING + QC PENDING |
| 4 | QC Đạt → Duyệt | APPROVED, batch tạo |
| 5 | Tạo phiếu nhập 2: `LOT-Q2`, HSD=2026-09-30, SL=120 (không QC) | APPROVED ngay |
| 6 | `/batches` filter `COCA330` | 2 lô |
| 7 | Vào `/scanner` → quét/nhập `8930000001` | Hiện SP + giá |
| 8 | Tạo phiếu xuất SALE, FIFO, SL=100 → xem Picking List | `LOT-Q2` (HSD gần hơn) lấy 100 |
| 9 | Duyệt → Mark Delivered | OK; `LOT-Q2` còn 20 |
| 10 | Tạo phiếu chuyển 50 từ WH01 → WH02, duyệt + nhận | tồn WH01 -50, WH02 +50 |
| 11 | Vào `/stock-card` SKU `COCA330` | 5 movements: 2 IMPORT, 1 EXPORT, 1 TRANSFER_OUT, 1 TRANSFER_IN |
| 12 | Vào `/abc-analysis` | `COCA330` xuất hiện trong nhóm tương ứng |
| 13 | Vào `/` (Dashboard) | AlertBanner update đúng |

- [ ] Pass toàn bộ

### TC-E2E-2 — Tính nhất quán dữ liệu sau nhiều giao dịch
Sau khi làm TC-E2E-1, chạy SQL:
```sql
-- Tổng tồn của COCA330 phải khớp giữa stocks và stock_by_location
SELECT
  (SELECT quantity FROM stocks WHERE product_id = (SELECT id FROM products WHERE sku='COCA330')) AS total_stocks,
  (SELECT SUM(quantity) FROM stock_by_location WHERE product_id = (SELECT id FROM products WHERE sku='COCA330')) AS total_sbl,
  (SELECT SUM(remaining_quantity) FROM batches WHERE product_id = (SELECT id FROM products WHERE sku='COCA330') AND status='ACTIVE') AS total_batches;
```
- [ ] `total_stocks == total_sbl` (chính xác)
- [ ] `total_batches == total_stocks` (nếu mọi item đều có batch — cho phép chênh nếu có dòng `batch_id NULL` từ backfill cũ)

---

## ❌ Test các edge case (negative)

### TC-NEG-1 — Bảo mật
- [ ] Logout, gõ trực tiếp `/warehouses` → redirect về `/login`
- [ ] Login bằng STAFF, thử `PATCH /api/imports/:id/approve` → 403 (chỉ ADMIN)
- [ ] Login STAFF, vào `/users` URL trực tiếp → redirect

### TC-NEG-2 — Validation
- [ ] Tạo phiếu nhập không có item nào → toast lỗi
- [ ] Tạo phiếu xuất với SL=0 → lỗi
- [ ] Chuyển kho với from = to → lỗi "Kho nguồn và đích phải khác nhau"
- [ ] Tạo location không chọn warehouse → lỗi
- [ ] Xoá kho có tồn → lỗi "kho còn tồn kho"

### TC-NEG-3 — Concurrency (optional)
- [ ] 2 phiếu xuất cùng PENDING tổng SL > tồn hiện có → phiếu duyệt sau bị reject

---

## 📊 Tổng kết test

| Pha | Tổng case | Pass | Fail | Notes |
|---|---|---|---|---|
| Pha 1 | 5 | __ | __ | |
| Pha 2 | 8 | __ | __ | |
| Pha 3 | 5 | __ | __ | |
| Pha 4 | 4 | __ | __ | |
| E2E | 2 | __ | __ | |
| Negative | 3 | __ | __ | |
| **Tổng** | **27** | __ | __ | |

### Chữ ký
- Người test: ____________________
- Ngày test: ____________________
- Kết luận: ☐ Pass toàn bộ ☐ Pass có điều kiện ☐ Cần fix
