# 👥 Phân quyền & Danh sách chức năng đầy đủ

Hệ thống hỗ trợ **2 vai trò** với các chức năng cụ thể như sau.

---

## 🛡 Quản trị viên (Admin)

> Quản lý toàn bộ hệ thống bao gồm người dùng, sản phẩm, danh mục, nhà cung cấp, khách hàng, và xem toàn bộ báo cáo, nhật ký hệ thống.

### 1. Quản lý người dùng & phân quyền
- ● Tạo / sửa / xoá tài khoản người dùng
- ● Phân quyền 2 cấp: **ADMIN** / **STAFF**
- ● Kích hoạt / vô hiệu hoá tài khoản
- ● Đặt lại mật khẩu cho nhân viên
- ● Theo dõi lịch sử đăng nhập

### 2. Quản lý danh mục dữ liệu
- ● Quản lý danh mục sản phẩm (categories)
- ● Quản lý sản phẩm (SKU, tên, giá, đơn vị, hình ảnh)
- ● Import sản phẩm hàng loạt từ file Excel
- ● Quản lý nhà cung cấp (NCC) — mã, tên, liên hệ, mã số thuế
- ● Quản lý khách hàng — mã, tên, liên hệ, mã số thuế

### 3. Quản lý hạ tầng kho (🆕)
- ● **Quản lý đa kho** — tạo/sửa/xoá nhiều kho vật lý
- ● Đánh dấu **kho mặc định** dùng cho toàn hệ thống
- ● Gán **người quản lý** cho từng kho
- ● **Quản lý sơ đồ vị trí 5 cấp**: Khu vực → Dãy → Kệ → Tầng → Ô
- ● Tự động sinh mã vị trí (vd: `A-01-03-02-05`)
- ● Cấu hình **sức chứa** từng vị trí
- ● Bật / tắt vị trí theo nhu cầu

### 4. Quản lý lô hàng & hạn sử dụng (🆕)
- ● Xem danh sách toàn bộ lô hàng trong hệ thống
- ● Lọc theo: kho, sản phẩm, trạng thái lô (ACTIVE/DEPLETED/EXPIRED), khoảng HSD
- ● Theo dõi: số lượng ban đầu, số lượng còn lại, NCC, kho chứa
- ● Cập nhật trạng thái lô thủ công (đánh dấu hư hỏng, hết hạn)

### 5. Cấu hình sản phẩm nâng cao (🆕)
- ● Thiết lập **tồn tối thiểu** và **tồn tối đa** cho từng SKU
- ● Gán **barcode** chuẩn cho sản phẩm (cấp SKU)
- ● Cấu hình **đơn vị quy đổi** (vd: 1 Thùng = 10 Lốc = 100 Chai)
- ● Gán **barcode riêng** cho từng đơn vị (Thùng/Lốc/Chai)
- ● Định nghĩa **thuộc tính biến thể** (màu sắc, kích cỡ, chất liệu...)

### 6. Duyệt phiếu nghiệp vụ
- ● Duyệt / từ chối phiếu nhập (đã có) — với lý do từ chối
- ● Duyệt / từ chối phiếu xuất (đã có) — kiểm tra tồn kho tự động
- ● 🆕 Duyệt phiếu nhập có **QC PASSED** (nếu phiếu yêu cầu kiểm chất lượng)
- ● 🆕 Duyệt phiếu **chuyển kho nội bộ** → chuyển trạng thái sang IN_TRANSIT
- ● 🆕 Từ chối / huỷ phiếu chuyển kho

### 7. Báo cáo & phân tích (🆕)
- ● Báo cáo tồn kho thời gian thực (đã có)
- ● Báo cáo nhập-xuất theo khoảng thời gian (đã có)
- ● Thống kê theo nhà cung cấp / khách hàng (đã có)
- ● 🆕 **Thẻ kho (Stock Card)** — truy vết toàn bộ biến động 1 SKU
- ● 🆕 **Phân tích ABC** theo nguyên tắc Pareto 70/20/10 (doanh thu / số lượng xuất)
- ● 🆕 **Báo cáo cảnh báo 4 cấp** (low/over/expiring/expired) trên Dashboard
- ● Xuất báo cáo CSV / Excel

### 8. Cảnh báo & giám sát (🆕)
- ● Cảnh báo **dưới tồn tối thiểu** (low_stock)
- ● Cảnh báo **vượt tồn tối đa** (over_stock)
- ● Cảnh báo **lô sắp hết hạn** (trong 30 ngày)
- ● Cảnh báo **lô đã hết hạn**
- ● Tổng hợp số liệu cảnh báo trên Dashboard, click để xem chi tiết

### 9. Hệ thống & nhật ký
- ● Xem nhật ký hoạt động toàn hệ thống (audit logs)
- ● Lọc nhật ký theo người dùng, hành động, đối tượng
- ● Theo dõi IP, timestamp của mọi thao tác quan trọng
- ● 🆕 Log riêng cho QC, chuyển kho, picking

---

## 👷 Nhân viên kho (Staff)

> Thực hiện các nghiệp vụ nhập kho, xuất kho, kiểm kê và xem báo cáo trong phạm vi được phép.

### 1. Nghiệp vụ nhập kho
- ● Tạo phiếu nhập (đã có)
- ● Cập nhật / chỉnh sửa phiếu nhập khi còn PENDING
- ● 🆕 Phân loại **3 loại phiếu nhập**:
   - **PURCHASE** — Mua hàng từ nhà cung cấp
   - **CUSTOMER_RETURN** — Khách hàng trả hàng
   - **TRANSFER_IN** — Nhận hàng chuyển từ kho khác
- ● 🆕 **Chọn kho nhập** (mặc định = kho được gán)
- ● 🆕 **Khai báo lô hàng**: mã lô, ngày sản xuất (NSX), hạn sử dụng (HSD) cho từng item
- ● 🆕 Tự động sinh mã lô nếu không khai báo (`IMP20260424001-15`)
- ● 🆕 **Yêu cầu QC** trước khi duyệt — đánh dấu phiếu chờ kiểm tra
- ● 🆕 **Cập nhật QC**: bấm **QC Đạt** hoặc **QC Loại** + ghi chú
- ● 🆕 Phiếu **QC Loại** sẽ không thể duyệt — bảo vệ kho khỏi hàng kém
- ● In phiếu nhập (PDF)

### 2. Nghiệp vụ xuất kho
- ● Tạo phiếu xuất (đã có)
- ● Cập nhật / chỉnh sửa phiếu xuất khi còn PENDING
- ● 🆕 Phân loại **3 loại phiếu xuất**:
   - **SALE** — Xuất bán hàng
   - **DISPOSAL** — Xuất hủy (hàng hỏng/hết hạn) — bắt buộc nhập lý do
   - **TRANSFER_OUT** — Xuất chuyển kho (kết hợp với phiếu chuyển)
- ● 🆕 **Chọn kho xuất**
- ● 🆕 Chọn **quy tắc lấy lô**:
   - **FIFO** — Lô cũ / sắp hết hạn xuất trước
   - **LIFO** — Lô mới xuất trước
   - **MANUAL** — Tự chọn lô
- ● 🆕 **Xem Picking List** preview — hệ thống gợi ý lô nào sẽ được pick, số lượng từng lô
- ● 🆕 Cảnh báo nếu **thiếu hàng** ở kho xuất (chia rõ lô nào không đủ)
- ● 🆕 **Đánh dấu đã giao hàng** (picking_status = DELIVERED) sau khi vận chuyển
- ● In phiếu xuất (PDF)

### 3. Nghiệp vụ chuyển kho nội bộ (🆕)
- ● Tạo phiếu chuyển kho từ kho A → kho B
- ● Chọn sản phẩm + số lượng — hệ thống hiển thị **tồn kho ở kho nguồn** ngay
- ● Cảnh báo nếu số lượng chuyển vượt tồn kho nguồn
- ● 3 trạng thái phiếu:
   1. **PENDING** — chờ duyệt
   2. **IN_TRANSIT** — đã duyệt, hàng đang vận chuyển (đã trừ kho nguồn)
   3. **COMPLETED** — kho đích xác nhận đã nhận đủ hàng
- ● Xác nhận **đã nhận hàng** tại kho đích → cộng tồn kho đích
- ● Huỷ phiếu nếu chưa được duyệt

### 4. Kiểm kê & điều chỉnh
- ● Tạo phiếu kiểm kê (stocktake) — đã có
- ● Đối chiếu **số lượng thực tế** vs **số trên hệ thống**
- ● Tự động tính chênh lệch (positive/negative)
- ● 🆕 Kiểm kê theo **từng kho cụ thể**
- ● Hoàn tất / huỷ phiếu kiểm kê
- ● Khi hoàn tất → tự động sinh stock movement type `INVENTORY_CHECK`

### 5. Quét mã & in tem (🆕)
- ● **Quét barcode/QR bằng camera** laptop hoặc điện thoại
- ● **Quét bằng máy quét USB** — tự động nhập + tra cứu
- ● Tra cứu theo 3 cấp ưu tiên:
   - Barcode SKU (`products.barcode`)
   - Barcode đơn vị (`product_units.barcode`)
   - Mã SKU (`products.sku`) — fallback
- ● Hiển thị thông tin SP ngay (giá, đơn vị, đơn vị đã quét)
- ● **Tự tạo QR/Barcode test** ngay trong trang để demo
- ● **In tem** sản phẩm:
   - Chọn loại: CODE128 / EAN13 / QR
   - Chọn số bản (1-100 trên 1 trang)
   - **In** trực tiếp hoặc **Tải PDF** về máy

### 6. Tra cứu & báo cáo (🆕)
- ● Xem **Thẻ kho** chi tiết theo SKU:
   - Toàn bộ lịch sử nhập/xuất/chuyển/hủy/kiểm kê
   - Lọc theo loại biến động, khoảng thời gian
   - Phân trang
- ● Xem **Phân tích ABC**:
   - Phân loại sản phẩm thành nhóm A/B/C
   - Lọc theo: doanh thu hoặc số lượng xuất
   - Lọc theo khoảng thời gian
- ● Xem **Danh sách lô hàng** + cảnh báo HSD
- ● Xem **Tồn theo vị trí kho** (stock_by_location)
- ● Xem **Cảnh báo** trên Dashboard:
   - Sản phẩm dưới tồn tối thiểu
   - Sản phẩm vượt tồn tối đa
   - Lô sắp hết hạn (30 ngày)
   - Lô đã hết hạn

### 7. Tìm kiếm nhanh (đã có + mở rộng)
- ● Tìm kiếm sản phẩm theo SKU, tên, mô tả
- ● Tìm kiếm nhà cung cấp, khách hàng
- ● 🆕 Search bar trên toàn hệ thống tích hợp gợi ý

---

## 📊 Tóm tắt số lượng chức năng

| Vai trò | Trước nâng cấp | Sau nâng cấp | Tăng |
|---|---|---|---|
| **Admin** | ~20 chức năng | **45+ chức năng** | +125% |
| **Staff** | ~15 chức năng | **40+ chức năng** | +166% |
| **Tổng cộng** | ~35 | **85+** | +143% |

---

## 🔐 Ma trận phân quyền nhanh

| Chức năng | Admin | Staff |
|---|:---:|:---:|
| Quản lý người dùng | ✅ | ❌ |
| Quản lý kho / vị trí | ✅ | ❌ |
| Cấu hình SP, đơn vị, thuộc tính | ✅ | ❌ |
| Quản lý NCC, khách hàng | ✅ | 👁 (chỉ xem) |
| Tạo phiếu nhập / xuất / chuyển | ✅ | ✅ |
| Cập nhật QC | ✅ | ✅ |
| **Duyệt** phiếu nhập / xuất / chuyển | ✅ | ❌ |
| Xác nhận nhận hàng (chuyển kho) | ✅ | ✅ |
| Tạo / hoàn tất kiểm kê | ✅ | ✅ |
| Quét mã + in tem | ✅ | ✅ |
| Xem Thẻ kho, ABC, lô hàng | ✅ | ✅ |
| Xem cảnh báo Dashboard | ✅ | ✅ |
| Xem nhật ký hệ thống (Audit Logs) | ✅ | ❌ |
| Cấu hình kho mặc định | ✅ | ❌ |

> **Ghi chú**: 🆕 = tính năng mới thêm trong bản nâng cấp 2026; các dòng còn lại đã có từ trước.
