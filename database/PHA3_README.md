# Pha 3 — Frontend UI & Báo cáo + Barcode

Xây giao diện cho Pha 1/2 và 2 báo cáo nâng cao (Thẻ kho, Phân tích ABC). Thêm quét/in barcode+QR.

## 1. Cài thêm package frontend

```bash
cd frontend
npm install
```

`package.json` đã được thêm 3 dependency mới:
- **html5-qrcode** — quét barcode/QR qua camera (cả trên mobile)
- **jsbarcode** — render barcode (CODE128, EAN13…)
- **qrcode** — render mã QR

Nếu môi trường offline, có thể thay bằng CDN hoặc các lib tương đương.

## 2. Backend — 2 endpoint báo cáo mới

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/reports/stock-card/:productId` | Thẻ kho: lịch sử biến động 1 SKU (filter theo type/from_date/to_date, phân trang) |
| GET | `/api/reports/abc-analysis?metric=revenue\|quantity&from_date=&to_date=` | Phân tích ABC theo Pareto 70/20/10 trên doanh thu hoặc số lượng xuất |

Cả 2 đều dùng dữ liệu có sẵn từ `stock_movements` và `export_receipt_items` — không cần migration thêm.

## 3. Các trang frontend mới

| Đường dẫn | File | Mô tả |
|---|---|---|
| `/warehouses` | `pages/warehouses/WarehouseList.jsx` | CRUD kho, chọn kho mặc định |
| `/locations` | `pages/locations/LocationList.jsx` | CRUD vị trí (zone/aisle/rack/shelf/bin), lọc theo kho |
| `/batches` | `pages/batches/BatchList.jsx` | Danh sách lô + cảnh báo HSD (badge màu theo số ngày) |
| `/transfers` | `pages/transfers/TransferList.jsx` | Chuyển kho nội bộ: tạo phiếu → duyệt → nhận hàng |
| `/stock-card` | `pages/stock-card/StockCard.jsx` | Thẻ kho: search SKU → lịch sử biến động đầy đủ |
| `/abc-analysis` | `pages/abc-analysis/ABCAnalysis.jsx` | Phân tích ABC: summary A/B/C + table chi tiết |
| `/scanner` | `pages/scanner/Scanner.jsx` | Quét camera / nhập từ máy quét USB → tra cứu SKU + in tem |

Routes thêm trong [src/App.jsx](frontend/src/App.jsx), menu item thêm trong [src/components/layout/Layout.jsx](frontend/src/components/layout/Layout.jsx).

## 4. Component tái sử dụng mới

### `<BarcodeScanner>` — quét camera
Import: `import BarcodeScanner from '@/components/barcode/BarcodeScanner'`.
Props:
- `onDetected(code)` — callback khi quét thành công
- `onError(err)` — callback lỗi
- `autoStart` (default `true`), `fps` (default `10`), `qrbox` (default `250`)

Hỗ trợ tự phát hiện danh sách camera, ưu tiên camera sau trên mobile. Lib (`html5-qrcode`) tự nhận diện cả CODE128, EAN, QR, …

**Yêu cầu bảo mật**: camera chỉ hoạt động trên `https://` hoặc `http://localhost`. Khi deploy phải dùng HTTPS.

### `<BarcodePrint>` — in tem
```jsx
<BarcodePrint value="SP001" type="CODE128" label="SP001 — Nước ngọt Cola" />
<BarcodePrint value="SP001" type="QR" label="SP001" />
```
Type hỗ trợ: `CODE128`, `EAN13`, `QR` (qua JsBarcode + qrcode).
Có `<BarcodePrintSheet items={[{value,label},…]}>` kèm nút **In tất cả** mở cửa sổ in.

### `<AlertBanner>` — widget cảnh báo
Tự fetch `/api/alerts/summary` và hiện các card low/over/expiring/expired (chỉ hiện card có số > 0). Đã nhúng vào đầu [Dashboard.jsx](frontend/src/pages/dashboard/Dashboard.jsx).

## 5. Cách test từng tính năng

1. **Kho & Vị trí**: tạo kho `WH02`, thêm vài vị trí (A-01-01-01-01, A-01-01-01-02, …).
2. **Lô hàng & FIFO**:
   - Tạo 2 phiếu nhập (PURCHASE) cho cùng 1 SKU với `batch_code` khác nhau và `expiry_date` khác nhau, duyệt.
   - Vào `/batches` — hai lô hiện đầy đủ, badge HSD đúng.
   - Tạo phiếu xuất với `pick_strategy=FIFO` → `GET /api/exports/:id/picking-list` → batch sắp hết hạn trước được pick.
3. **Chuyển kho**: tạo phiếu chuyển WH01 → WH02 → **Duyệt** → **Xác nhận nhận hàng**. Check tồn 2 kho qua `/stock-by-location`.
4. **Thẻ kho**: search 1 SKU → hiển thị toàn bộ movements IMPORT/EXPORT/TRANSFER/… với badge màu.
5. **Phân tích ABC**: sau khi có vài phiếu xuất đã APPROVED → `/abc-analysis` phân loại A/B/C, click card A/B/C để lọc.
6. **Scanner**:
   - Mở `/scanner` trên laptop có webcam hoặc mobile (HTTPS).
   - Cho phép quyền camera → trỏ vào mã vạch bất kỳ → sản phẩm tương ứng (nếu barcode đã gán) hiện ngay.
   - Dùng máy quét USB: click ô input, quét (máy quét mô phỏng bàn phím Enter) → cũng tra cứu được.
   - Chuyển dropdown "Loại tem" sang QR → có thể in mã QR.

## 6. Hạn chế & pha kế tiếp (Pha 4)
- **Form nhập/xuất cũ chưa có UI chọn batch/location/QC/pick_strategy**: API đã sẵn sàng; Pha 4 sẽ refactor [ImportList.jsx](frontend/src/pages/imports/ImportList.jsx) & [ExportList.jsx](frontend/src/pages/exports/ExportList.jsx).
- **Quy đổi đơn vị trên form**: dùng `/api/product-units/convert`, chưa wire vào UI.
- **Thuộc tính biến thể (màu/size)**: UI quản lý thuộc tính SP chưa làm.
- **Kéo-thả gán SP vào vị trí** (thầy gợi ý): chưa làm — có thể thay bằng picker đơn giản.
- **Cảnh báo real-time**: hiện dùng polling mỗi lần mở Dashboard. Nếu cần WebSocket/SSE sẽ thêm sau.

## 7. Rollback / tắt tính năng

Tất cả trang mới chỉ **thêm** route và menu — không thay thế cái nào. Nếu muốn tạm ẩn, xóa block `menuItems` tương ứng trong [Layout.jsx](frontend/src/components/layout/Layout.jsx) và route trong [App.jsx](frontend/src/App.jsx).
