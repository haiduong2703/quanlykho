# 🚀 Hướng dẫn cập nhật QuanLyKho — Pha 1 → Pha 4

Tài liệu **một lần chạy** để đưa hệ thống từ trạng thái ban đầu lên đầy đủ tính năng của 4 pha. Bao gồm: backup → migration DB → cài deps frontend → restart → smoke test → rollback (nếu cần).

> **Thời gian dự kiến**: 10–15 phút, không kể lúc test.

---

## 📌 Tóm tắt nhanh các bước

```
1. Backup DB hiện tại               (~30s)
2. Chạy migration 06_pha1           (~10s)
3. Chạy migration 07_pha2           (~10s)
4. Verify schema                    (~30s)
5. Backend: restart                 (~10s)
6. Frontend: npm install + restart  (~3 phút lần đầu)
7. Smoke test trên trình duyệt      (~5 phút)
```

---

## ⚠️ Trước khi bắt đầu

- [ ] MySQL service đang chạy (XAMPP / WAMP / Docker / service Windows)
- [ ] Backend hiện tại đang chạy (port 5000) — bạn sẽ stop nó ở Bước 5
- [ ] Frontend đang chạy (port 5173) — bạn sẽ stop nó ở Bước 6
- [ ] Đã pull/save toàn bộ file mới tôi đã viết (8 SQL + nhiều file `.js`/`.jsx`). Kiểm tra:
  ```bash
  ls database/06_pha1_foundation.sql database/07_pha2_operations.sql
  ls backend/src/models/Warehouse.js backend/src/services/transferService.js
  ls frontend/src/pages/warehouses/WarehouseList.jsx
  ```
  Nếu thấy đủ 5 file trên → OK, tiếp tục.

---

## 🔒 Bước 1 — Backup database hiện tại

**Quan trọng**: làm trước khi chạy migration. Nếu lỗi, có cái để khôi phục.

### Cách 1 — mysqldump (khuyến nghị)
```bash
cd "c:/Users/Admin/Desktop/QuanLyKho/quanlykho"
mysqldump -u root -p warehouse_db > backup_before_pha1234_$(date +%Y%m%d_%H%M%S).sql
```
- [ ] File `backup_before_pha1234_YYYYMMDD_HHMMSS.sql` xuất hiện ở thư mục gốc, kích thước > 0

### Cách 2 — phpMyAdmin / Workbench
- Mở Workbench → chọn DB `warehouse_db` → **Server > Data Export** → chọn tất cả bảng → **Start Export**
- Hoặc phpMyAdmin: chọn DB → tab **Export** → format SQL → **Go**

### Cách 3 — copy thư mục data (chỉ khi tự host MySQL)
```
Stop MySQL service trước, copy thư mục data, start lại.
```

> ✅ **Nếu skip bước backup**, bạn vẫn có backup cũ `backup_dulieu_253.sql` ở root. Nhưng dữ liệu mới phát sinh sau ngày đó sẽ mất nếu rollback.

---

## 🗄️ Bước 2 — Migration Pha 1 (Foundation)

File: [database/06_pha1_foundation.sql](database/06_pha1_foundation.sql)

Tạo các bảng `warehouses`, `warehouse_locations`, `batches`, `product_units`, `product_attributes`, `stock_by_location`, `transfer_receipts`, `transfer_receipt_items`. Thêm cột `max_stock`, `barcode` vào `products`. Mở rộng enum `stock_movements.type`.

### Chạy
```bash
cd "c:/Users/Admin/Desktop/QuanLyKho/quanlykho"
mysql -u root -p warehouse_db < database/06_pha1_foundation.sql
```
Nhập mật khẩu khi prompt. Migration **idempotent** — chạy lại không gây lỗi.

### Verify ngay sau khi chạy
```bash
mysql -u root -p warehouse_db -e "
  SELECT 'warehouses' tbl, COUNT(*) cnt FROM warehouses
  UNION SELECT 'warehouse_locations', COUNT(*) FROM warehouse_locations
  UNION SELECT 'batches', COUNT(*) FROM batches
  UNION SELECT 'product_units', COUNT(*) FROM product_units
  UNION SELECT 'product_attributes', COUNT(*) FROM product_attributes
  UNION SELECT 'stock_by_location', COUNT(*) FROM stock_by_location
  UNION SELECT 'transfer_receipts', COUNT(*) FROM transfer_receipts;
"
```
**Kỳ vọng**:
- `warehouses` ≥ 1 (kho mặc định `WH01`)
- `product_units` = số dòng trong `products` (mỗi SP tự sinh 1 đơn vị cơ sở)
- `stock_by_location` ≈ số dòng trong `stocks` (backfill)
- Các bảng còn lại có thể = 0 — bình thường

```bash
mysql -u root -p warehouse_db -e "
  SHOW COLUMNS FROM products LIKE 'max_stock';
  SHOW COLUMNS FROM products LIKE 'barcode';
  SELECT code, name, is_default FROM warehouses;
"
```
- [ ] Cả 2 cột `max_stock`, `barcode` xuất hiện trên `products`
- [ ] Có dòng `WH01 | Kho chính | 1`

---

## 🗄️ Bước 3 — Migration Pha 2 (Operations)

File: [database/07_pha2_operations.sql](database/07_pha2_operations.sql)

Thêm `receipt_type`, `qc_status`, `pick_strategy`, `picking_status`, `warehouse_id`, batch fields vào phiếu nhập/xuất. Tạo bảng `export_receipt_picks`.

### Chạy
```bash
mysql -u root -p warehouse_db < database/07_pha2_operations.sql
```

### Verify
```bash
mysql -u root -p warehouse_db -e "
  SHOW COLUMNS FROM import_receipts LIKE 'receipt_type';
  SHOW COLUMNS FROM import_receipts LIKE 'qc_status';
  SHOW COLUMNS FROM import_receipt_items LIKE 'batch_id';
  SHOW COLUMNS FROM export_receipts LIKE 'pick_strategy';
  SHOW COLUMNS FROM export_receipts LIKE 'picking_status';
  SHOW TABLES LIKE 'export_receipt_picks';
"
```
- [ ] Tất cả 6 query đều trả về dòng (không rỗng)

```bash
mysql -u root -p warehouse_db -e "
  SELECT receipt_type, COUNT(*) FROM import_receipts GROUP BY receipt_type;
  SELECT receipt_type, COUNT(*) FROM export_receipts GROUP BY receipt_type;
"
```
- [ ] Phiếu cũ đã được backfill: `import_receipts` toàn `PURCHASE`, `export_receipts` toàn `SALE`

---

## ⚙️ Bước 4 — Backend

> **Không có dependency mới ở backend** → KHÔNG cần `npm install`. Chỉ restart để load file đã sửa.

### Stop backend cũ
- Nếu bạn đang chạy `npm run dev` ở terminal nào đó → Ctrl+C
- Nếu chạy bằng PM2 / nodemon background:
  ```bash
  # tìm process
  netstat -ano | findstr :5000
  # rồi tasklist | findstr <PID> để xem; kill nếu cần:
  taskkill /F /PID <PID>
  ```

### Start backend mới
```bash
cd "c:/Users/Admin/Desktop/QuanLyKho/quanlykho/backend"
npm run dev
```

### Verify đã load route mới
```bash
# Sau khi server start, test 1 endpoint mới (cần token — login trước)
curl http://localhost:5000/api/warehouses/active -H "Authorization: Bearer <YOUR_TOKEN>"
```
- [ ] Trả JSON `{ success: true, data: [...] }` chứa ít nhất 1 kho

> Nếu không có sẵn token, đăng nhập qua frontend trước (Bước 6) rồi quay lại curl sau.

---

## 🎨 Bước 5 — Frontend

### 5.1. Stop frontend cũ
- Ctrl+C ở terminal đang chạy `npm run dev`

### 5.2. Cài 3 thư viện mới
```bash
cd "c:/Users/Admin/Desktop/QuanLyKho/quanlykho/frontend"
npm install
```

`package.json` đã thêm sẵn `html5-qrcode`, `jsbarcode`, `qrcode` ở Pha 3 — `npm install` sẽ kéo về (~10MB, mất 1–3 phút lần đầu).

### 5.3. Verify install thành công
```bash
ls node_modules/html5-qrcode node_modules/jsbarcode node_modules/qrcode
```
- [ ] Cả 3 thư mục đều tồn tại

### 5.4. Start lại
```bash
npm run dev
```
- [ ] Vite log: `VITE ready in XXX ms — Local: http://localhost:5173/`
- [ ] Không có lỗi `Cannot find module` đỏ

---

## ✅ Bước 6 — Smoke test (5 phút)

Mở trình duyệt → `http://localhost:5173` → đăng nhập.

### 6.1. Sidebar có 7 mục mới
Kéo sidebar bên trái — phải thấy đủ:
- [ ] Kho
- [ ] Vị trí trong kho
- [ ] Lô hàng
- [ ] Chuyển kho
- [ ] Thẻ kho
- [ ] Phân tích ABC
- [ ] Quét / In mã

### 6.2. Dashboard
- [ ] Trang `/` load không lỗi
- [ ] Nếu có sản phẩm low_stock → AlertBanner trên cùng hiện card cảnh báo
- [ ] Các biểu đồ cũ vẫn hoạt động bình thường

### 6.3. Trang Kho
- [ ] `/warehouses` → list có ít nhất `WH01` ⭐
- [ ] Click ⭐ vào icon mặc định → đúng

### 6.4. Form Nhập kho mới
- [ ] `/imports` → bấm **+ Tạo phiếu nhập** → modal có:
  - Dropdown **Loại phiếu**
  - Dropdown **Kho nhập**
  - Checkbox **Yêu cầu QC**
  - Mỗi item có 3 ô **batch_code / NSX / HSD**

### 6.5. Form Xuất kho mới
- [ ] `/exports` → modal có **Loại phiếu / Kho / Pick strategy**
- [ ] Đổi loại sang **DISPOSAL** → field "Lý do hủy" hiện ra

### 6.6. Form Sản phẩm mới
- [ ] `/products` → Thêm SP → form có **Tồn tối đa**, **Barcode**
- [ ] Sau khi tạo, mở Edit → có 2 section **Đơn vị quy đổi** + **Thuộc tính**

### 6.7. Scanner
- [ ] `/scanner` → có khu vực Camera (xin quyền truy cập)
- [ ] Ô "Nhập tay" hoạt động → gõ 1 chuỗi bất kỳ + Enter

> Nếu camera không khởi động được → đã chạy đúng `localhost` chưa? Camera **chỉ chạy trên localhost hoặc HTTPS**.

---

## 🐛 Troubleshooting

### Lỗi 1: `ERROR 1062 (23000): Duplicate entry`
**Nguyên nhân**: chạy migration nhiều lần và 1 phần đã apply.
**Fix**: Migration có procedure idempotent, lỗi này không nên xảy ra. Nếu vẫn gặp:
```sql
-- Xem cột đã tồn tại chưa
SHOW COLUMNS FROM products LIKE 'max_stock';
-- Nếu có rồi, skip migration đó
```

### Lỗi 2: `ERROR 1452: Cannot add or update a child row: a foreign key constraint fails`
**Nguyên nhân**: dữ liệu cũ có `user_id` không tồn tại (do FK mới của `qc_by`, `manager_user_id` …).
**Fix**:
```sql
-- Tìm phiếu mồ côi
SELECT id, user_id FROM import_receipts WHERE user_id NOT IN (SELECT id FROM users);
-- Sửa user_id thành 1 user hợp lệ hoặc xoá phiếu đó
```

### Lỗi 3: Frontend trắng trang sau khi update
**Nguyên nhân**: thiếu deps hoặc cache cũ.
**Fix**:
```bash
cd frontend
rm -rf node_modules dist .vite
npm install
npm run dev
```
Mở DevTools (F12) → Console — xem lỗi đỏ cụ thể.

### Lỗi 4: `Cannot find module 'html5-qrcode'`
**Nguyên nhân**: chưa `npm install`.
**Fix**: Bước 5.2.

### Lỗi 5: Backend báo `Unknown column 'receipt_type' in 'field list'`
**Nguyên nhân**: Pha 2 migration chưa chạy hoặc chạy fail.
**Fix**: Chạy lại Bước 3 và verify lại.

### Lỗi 6: Phiếu nhập cũ không hiển thị `Loại phiếu`
**Nguyên nhân**: cột `receipt_type` đã có nhưng giá trị NULL.
**Fix**:
```sql
UPDATE import_receipts SET receipt_type = 'PURCHASE' WHERE receipt_type IS NULL;
UPDATE export_receipts SET receipt_type = 'SALE' WHERE receipt_type IS NULL;
UPDATE import_receipts SET warehouse_id = (SELECT id FROM warehouses WHERE is_default = TRUE LIMIT 1) WHERE warehouse_id IS NULL;
UPDATE export_receipts SET warehouse_id = (SELECT id FROM warehouses WHERE is_default = TRUE LIMIT 1) WHERE warehouse_id IS NULL;
```

### Lỗi 7: Camera không bật được
- Đảm bảo URL là `http://localhost:5173` (không phải `http://192.168.x.x`)
- Cấp quyền camera trong cài đặt browser
- Trên iOS Safari: chỉ chạy được nếu site có HTTPS

### Lỗi 8: Migration báo `Procedure 'xxx' already exists`
**Fix**: hiếm gặp, nhưng có thể chạy:
```sql
DROP PROCEDURE IF EXISTS __pha1_alter_products;
DROP PROCEDURE IF EXISTS __pha1_alter_stock_movements;
DROP PROCEDURE IF EXISTS __pha2_alter_import_receipts;
DROP PROCEDURE IF EXISTS __pha2_alter_import_items;
DROP PROCEDURE IF EXISTS __pha2_alter_export_receipts;
DROP PROCEDURE IF EXISTS __pha2_alter_export_items;
DROP PROCEDURE IF EXISTS __pha2_alter_inventory_checks;
```
Rồi chạy lại migration.

---

## ↩️ Rollback (nếu cần huỷ cập nhật)

### Cách 1 — phục hồi từ backup (an toàn nhất)
```bash
mysql -u root -p warehouse_db < backup_before_pha1234_YYYYMMDD_HHMMSS.sql
```
- [ ] Verify: `SHOW TABLES LIKE 'warehouses';` phải **rỗng**

### Cách 2 — DROP các bảng/cột mới (giữ dữ liệu cũ)
Trong [PHA1_README.md](database/PHA1_README.md) và [PHA2_README.md](database/PHA2_README.md) có sẵn block SQL rollback. Tóm tắt:
```sql
-- Pha 2 trước (FK thuộc về sau, drop trước)
DROP TABLE IF EXISTS export_receipt_picks;
ALTER TABLE export_receipts DROP COLUMN receipt_type, DROP COLUMN warehouse_id, ...;
ALTER TABLE import_receipts DROP COLUMN receipt_type, ...;

-- Pha 1
DROP TABLE IF EXISTS transfer_receipt_items, transfer_receipts, stock_by_location,
                    product_attributes, product_units, batches,
                    warehouse_locations, warehouses;
ALTER TABLE products DROP COLUMN max_stock, DROP COLUMN barcode;
```

### Code rollback
```bash
git status               # xem thay đổi
git stash                # giữ tạm
# hoặc:
git checkout -- backend frontend database
```

---

## 📊 Checklist hoàn tất

Sau khi xong toàn bộ, đánh dấu hết:

- [ ] Có file backup `backup_before_pha1234_*.sql`
- [ ] `06_pha1_foundation.sql` chạy không lỗi
- [ ] `07_pha2_operations.sql` chạy không lỗi
- [ ] Bảng `warehouses` có ít nhất `WH01`
- [ ] Cột `products.max_stock` & `products.barcode` tồn tại
- [ ] Backend restart, không lỗi log
- [ ] Frontend `npm install` thành công, có 3 thư viện mới
- [ ] Frontend chạy, sidebar có 7 mục mới
- [ ] Form Nhập/Xuất/Sản phẩm có field mới
- [ ] Đăng nhập + dashboard load được

✅ Khi 100% checklist xong → mở [database/TEST_SCENARIOS.md](database/TEST_SCENARIOS.md) để test chi tiết 27 case.

---

## 📞 Khi gặp sự cố

Khi lỗi không nằm trong mục Troubleshooting:
1. **Capture log đầy đủ**:
   - Backend: copy từ terminal đang chạy `npm run dev`
   - Frontend: F12 → Console → tab Network (xem request lỗi)
   - DB: `mysql -u root -p` → chạy lại lệnh báo lỗi
2. **Ghi rõ**: bước nào đang làm, lệnh đã chạy, kỳ vọng vs thực tế
3. Gửi cho tôi để fix nhanh

---

> **Tip**: lần sau khi cập nhật code mới, chỉ cần chạy lại các migration mới (file SQL với số thứ tự cao hơn). Migration đã viết theo pattern idempotent nên an toàn.
