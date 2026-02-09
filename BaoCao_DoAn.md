# BÁO CÁO ĐỒ ÁN

# HỆ THỐNG QUẢN LÝ KHO HÀNG

---

## MỤC LỤC

- [MỞ ĐẦU](#mở-đầu)
- [CHƯƠNG 1: MÔ TẢ BÀI TOÁN](#chương-1-mô-tả-bài-toán)
- [CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CƠ SỞ THỰC NGHIỆM](#chương-2-cơ-sở-lý-thuyết-và-cơ-sở-thực-nghiệm)
- [CHƯƠNG 3: PHƯƠNG PHÁP, QUY TRÌNH THỰC HIỆN](#chương-3-phương-pháp-quy-trình-thực-hiện)
- [CHƯƠNG 4: KẾT QUẢ THỰC NGHIỆM](#chương-4-kết-quả-thực-nghiệm)
- [KẾT LUẬN](#kết-luận)
- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)
- [PHỤ LỤC](#phụ-lục)

---

## MỞ ĐẦU

### 1. Lý do chọn đề tài

Trong bối cảnh nền kinh tế số hóa ngày càng phát triển, việc quản lý kho hàng đóng vai trò then chốt trong hoạt động kinh doanh của các doanh nghiệp. Quản lý kho hiệu quả giúp doanh nghiệp:

- **Tối ưu hóa chi phí**: Giảm thiểu tình trạng tồn kho dư thừa hoặc thiếu hụt hàng hóa
- **Nâng cao hiệu suất làm việc**: Tự động hóa các quy trình nhập xuất, kiểm kê
- **Đảm bảo tính chính xác**: Theo dõi số lượng hàng hóa theo thời gian thực
- **Hỗ trợ ra quyết định**: Cung cấp báo cáo, thống kê chi tiết

Hiện nay, nhiều doanh nghiệp vừa và nhỏ tại Việt Nam vẫn còn sử dụng phương pháp quản lý kho thủ công bằng sổ sách hoặc Excel. Điều này dẫn đến nhiều hạn chế như:

- Dễ xảy ra sai sót trong quá trình nhập liệu
- Khó khăn trong việc tra cứu, tìm kiếm thông tin
- Không thể theo dõi lịch sử giao dịch một cách chi tiết
- Thiếu khả năng cảnh báo khi hàng hóa sắp hết
- Khó khăn trong việc tổng hợp báo cáo

Xuất phát từ thực tế trên, đề tài **"Xây dựng Hệ thống Quản lý Kho Hàng"** được lựa chọn nhằm giải quyết các vấn đề còn tồn tại và đáp ứng nhu cầu tin học hóa công tác quản lý kho của các doanh nghiệp.

### 2. Mục tiêu của đề tài

**Mục tiêu tổng quát:**
Xây dựng một hệ thống quản lý kho hàng hoàn chỉnh, có khả năng quản lý toàn bộ quy trình nhập - xuất - tồn kho, hỗ trợ doanh nghiệp vừa và nhỏ trong việc số hóa hoạt động quản lý kho.

**Mục tiêu cụ thể:**

1. Xây dựng hệ thống phân quyền người dùng với các vai trò ADMIN và STAFF
2. Phát triển module quản lý danh mục sản phẩm, nhà cung cấp, khách hàng
3. Xây dựng chức năng quản lý sản phẩm với mã SKU duy nhất
4. Phát triển module nhập kho với khả năng tự động cập nhật tồn kho
5. Phát triển module xuất kho với kiểm tra tồn kho trước khi xuất
6. Xây dựng chức năng kiểm kê kho để đối chiếu số liệu thực tế và hệ thống
7. Phát triển Dashboard thống kê với biểu đồ trực quan
8. Xây dựng hệ thống cảnh báo hàng sắp hết tồn kho
9. Phát triển module báo cáo và xuất dữ liệu CSV
10. Ghi nhận nhật ký hoạt động (Audit Log) cho mọi thao tác

### 3. Đối tượng và phạm vi của đề tài

**Đối tượng nghiên cứu:**

- Quy trình quản lý kho hàng trong doanh nghiệp vừa và nhỏ
- Các nghiệp vụ nhập kho, xuất kho, kiểm kê kho
- Công nghệ phát triển ứng dụng web hiện đại (Node.js, React)

**Phạm vi nghiên cứu:**

- **Về chức năng**: Tập trung vào các chức năng cốt lõi của quản lý kho bao gồm: quản lý sản phẩm, nhập kho, xuất kho, kiểm kê, báo cáo thống kê
- **Về công nghệ**: Sử dụng kiến trúc Full-stack với Node.js (Backend) và React (Frontend)
- **Về quy mô**: Phù hợp với doanh nghiệp vừa và nhỏ với số lượng sản phẩm dưới 10,000 SKU
- **Về người dùng**: Hệ thống hỗ trợ đa người dùng với phân quyền ADMIN và STAFF

---

## CHƯƠNG 1: MÔ TẢ BÀI TOÁN

### 1.1. Mục tiêu của bài toán

#### 1.1.1. Bài toán cần giải quyết

Xây dựng một hệ thống phần mềm quản lý kho hàng dựa trên nền tảng web, cho phép:

- **Quản trị viên (Admin)**: Quản lý toàn bộ hệ thống bao gồm người dùng, sản phẩm, danh mục, nhà cung cấp, khách hàng, và xem toàn bộ báo cáo, nhật ký hệ thống
- **Nhân viên kho (Staff)**: Thực hiện các nghiệp vụ nhập kho, xuất kho, kiểm kê và xem báo cáo trong phạm vi được phép

#### 1.1.2. Đối tượng sử dụng

| Đối tượng             | Vai trò | Mô tả                                                          |
| --------------------- | ------- | -------------------------------------------------------------- |
| Quản trị viên (Admin) | ADMIN   | Quản lý toàn bộ hệ thống, phân quyền người dùng, xem audit log |
| Nhân viên kho (Staff) | STAFF   | Thực hiện nghiệp vụ nhập/xuất kho, kiểm kê, xem báo cáo cơ bản |

### 1.2. Mô tả các yêu cầu của bài toán

#### 1.2.1. Yêu cầu về dữ liệu

**A. Dữ liệu người dùng (Users)**

| Trường     | Kiểu dữ liệu | Mô tả             | Ràng buộc           |
| ---------- | ------------ | ----------------- | ------------------- |
| id         | INT          | Mã người dùng     | Khóa chính, tự tăng |
| username   | VARCHAR(50)  | Tên đăng nhập     | Duy nhất, bắt buộc  |
| email      | VARCHAR(100) | Email             | Duy nhất, bắt buộc  |
| password   | VARCHAR(255) | Mật khẩu (mã hóa) | Bắt buộc            |
| full_name  | VARCHAR(100) | Họ tên            | Bắt buộc            |
| role       | ENUM         | Vai trò           | ADMIN hoặc STAFF    |
| is_active  | BOOLEAN      | Trạng thái        | Mặc định: true      |
| created_at | DATETIME     | Ngày tạo          | Tự động             |
| updated_at | DATETIME     | Ngày cập nhật     | Tự động             |

**B. Dữ liệu danh mục (Categories)**

| Trường      | Kiểu dữ liệu | Mô tả         | Ràng buộc           |
| ----------- | ------------ | ------------- | ------------------- |
| id          | INT          | Mã danh mục   | Khóa chính, tự tăng |
| name        | VARCHAR(100) | Tên danh mục  | Bắt buộc            |
| description | TEXT         | Mô tả         | Tùy chọn            |
| created_at  | DATETIME     | Ngày tạo      | Tự động             |
| updated_at  | DATETIME     | Ngày cập nhật | Tự động             |

**C. Dữ liệu sản phẩm (Products)**

| Trường      | Kiểu dữ liệu  | Mô tả              | Ràng buộc           |
| ----------- | ------------- | ------------------ | ------------------- |
| id          | INT           | Mã sản phẩm        | Khóa chính, tự tăng |
| category_id | INT           | Mã danh mục        | Khóa ngoại          |
| sku         | VARCHAR(50)   | Mã SKU             | Duy nhất, bắt buộc  |
| name        | VARCHAR(200)  | Tên sản phẩm       | Bắt buộc            |
| description | TEXT          | Mô tả              | Tùy chọn            |
| image       | VARCHAR(255)  | Đường dẫn hình ảnh | Tùy chọn            |
| unit        | VARCHAR(20)   | Đơn vị tính        | Bắt buộc            |
| price       | DECIMAL(15,2) | Giá                | Bắt buộc, >= 0      |
| min_stock   | INT           | Tồn kho tối thiểu  | Mặc định: 0         |
| is_active   | BOOLEAN       | Trạng thái         | Mặc định: true      |

**D. Dữ liệu tồn kho (Stocks)**

| Trường           | Kiểu dữ liệu | Mô tả          | Ràng buộc            |
| ---------------- | ------------ | -------------- | -------------------- |
| id               | INT          | Mã tồn kho     | Khóa chính, tự tăng  |
| product_id       | INT          | Mã sản phẩm    | Khóa ngoại, duy nhất |
| quantity         | INT          | Số lượng tồn   | Mặc định: 0          |
| last_import_date | DATETIME     | Ngày nhập cuối | Tùy chọn             |
| last_export_date | DATETIME     | Ngày xuất cuối | Tùy chọn             |

**E. Dữ liệu nhà cung cấp (Suppliers)**

| Trường         | Kiểu dữ liệu | Mô tả           | Ràng buộc           |
| -------------- | ------------ | --------------- | ------------------- |
| id             | INT          | Mã NCC          | Khóa chính, tự tăng |
| code           | VARCHAR(20)  | Mã NCC (NCC001) | Duy nhất, bắt buộc  |
| name           | VARCHAR(200) | Tên NCC         | Bắt buộc            |
| contact_person | VARCHAR(100) | Người liên hệ   | Tùy chọn            |
| phone          | VARCHAR(20)  | Số điện thoại   | Tùy chọn            |
| email          | VARCHAR(100) | Email           | Tùy chọn            |
| address        | TEXT         | Địa chỉ         | Tùy chọn            |
| tax_code       | VARCHAR(20)  | Mã số thuế      | Tùy chọn            |
| is_active      | BOOLEAN      | Trạng thái      | Mặc định: true      |

**F. Dữ liệu khách hàng (Customers)**

| Trường         | Kiểu dữ liệu | Mô tả         | Ràng buộc           |
| -------------- | ------------ | ------------- | ------------------- |
| id             | INT          | Mã KH         | Khóa chính, tự tăng |
| code           | VARCHAR(20)  | Mã KH (KH001) | Duy nhất, bắt buộc  |
| name           | VARCHAR(200) | Tên KH        | Bắt buộc            |
| contact_person | VARCHAR(100) | Người liên hệ | Tùy chọn            |
| phone          | VARCHAR(20)  | Số điện thoại | Tùy chọn            |
| email          | VARCHAR(100) | Email         | Tùy chọn            |
| address        | TEXT         | Địa chỉ       | Tùy chọn            |
| tax_code       | VARCHAR(20)  | Mã số thuế    | Tùy chọn            |
| is_active      | BOOLEAN      | Trạng thái    | Mặc định: true      |

**G. Dữ liệu phiếu nhập kho (Import Receipts)**

| Trường         | Kiểu dữ liệu  | Mô tả                     | Ràng buộc            |
| -------------- | ------------- | ------------------------- | -------------------- |
| id             | INT           | Mã phiếu nhập             | Khóa chính, tự tăng  |
| receipt_code   | VARCHAR(20)   | Mã phiếu (IMP20260114001) | Duy nhất             |
| user_id        | INT           | Người tạo                 | Khóa ngoại           |
| supplier_id    | INT           | Nhà cung cấp              | Khóa ngoại, tùy chọn |
| supplier_name  | VARCHAR(200)  | Tên NCC                   | Bắt buộc             |
| supplier_phone | VARCHAR(20)   | SĐT NCC                   | Tùy chọn             |
| total_amount   | DECIMAL(15,2) | Tổng tiền                 | Tự động tính         |
| note           | TEXT          | Ghi chú                   | Tùy chọn             |
| import_date    | DATETIME      | Ngày nhập                 | Bắt buộc             |

**H. Dữ liệu chi tiết phiếu nhập (Import Receipt Items)**

| Trường            | Kiểu dữ liệu  | Mô tả         | Ràng buộc           |
| ----------------- | ------------- | ------------- | ------------------- |
| id                | INT           | Mã chi tiết   | Khóa chính, tự tăng |
| import_receipt_id | INT           | Mã phiếu nhập | Khóa ngoại          |
| product_id        | INT           | Mã sản phẩm   | Khóa ngoại          |
| quantity          | INT           | Số lượng      | Bắt buộc, > 0       |
| unit_price        | DECIMAL(15,2) | Đơn giá       | Bắt buộc, >= 0      |
| subtotal          | DECIMAL(15,2) | Thành tiền    | Tự động tính        |
| note              | TEXT          | Ghi chú       | Tùy chọn            |

**I. Dữ liệu phiếu xuất kho (Export Receipts)**

| Trường         | Kiểu dữ liệu  | Mô tả                     | Ràng buộc            |
| -------------- | ------------- | ------------------------- | -------------------- |
| id             | INT           | Mã phiếu xuất             | Khóa chính, tự tăng  |
| receipt_code   | VARCHAR(20)   | Mã phiếu (EXP20260114001) | Duy nhất             |
| user_id        | INT           | Người tạo                 | Khóa ngoại           |
| customer_id    | INT           | Khách hàng                | Khóa ngoại, tùy chọn |
| customer_name  | VARCHAR(200)  | Tên KH                    | Bắt buộc             |
| customer_phone | VARCHAR(20)   | SĐT KH                    | Tùy chọn             |
| total_amount   | DECIMAL(15,2) | Tổng tiền                 | Tự động tính         |
| note           | TEXT          | Ghi chú                   | Tùy chọn             |
| export_date    | DATETIME      | Ngày xuất                 | Bắt buộc             |

**J. Dữ liệu chi tiết phiếu xuất (Export Receipt Items)**

| Trường            | Kiểu dữ liệu  | Mô tả         | Ràng buộc           |
| ----------------- | ------------- | ------------- | ------------------- |
| id                | INT           | Mã chi tiết   | Khóa chính, tự tăng |
| export_receipt_id | INT           | Mã phiếu xuất | Khóa ngoại          |
| product_id        | INT           | Mã sản phẩm   | Khóa ngoại          |
| quantity          | INT           | Số lượng      | Bắt buộc, > 0       |
| unit_price        | DECIMAL(15,2) | Đơn giá       | Bắt buộc, >= 0      |
| subtotal          | DECIMAL(15,2) | Thành tiền    | Tự động tính        |
| note              | TEXT          | Ghi chú       | Tùy chọn            |

**K. Dữ liệu kiểm kê kho (Inventory Checks)**

| Trường         | Kiểu dữ liệu  | Mô tả            | Ràng buộc                   |
| -------------- | ------------- | ---------------- | --------------------------- |
| id             | INT           | Mã kiểm kê       | Khóa chính, tự tăng         |
| check_code     | VARCHAR(20)   | Mã phiếu kiểm kê | Duy nhất                    |
| user_id        | INT           | Người kiểm kê    | Khóa ngoại                  |
| status         | ENUM          | Trạng thái       | DRAFT, COMPLETED, CANCELLED |
| total_variance | DECIMAL(15,2) | Tổng chênh lệch  | Tự động tính                |
| note           | TEXT          | Ghi chú          | Tùy chọn                    |
| check_date     | DATETIME      | Ngày kiểm kê     | Bắt buộc                    |

**L. Dữ liệu chi tiết kiểm kê (Inventory Check Details)**

| Trường             | Kiểu dữ liệu  | Mô tả              | Ràng buộc           |
| ------------------ | ------------- | ------------------ | ------------------- |
| id                 | INT           | Mã chi tiết        | Khóa chính, tự tăng |
| inventory_check_id | INT           | Mã phiếu kiểm kê   | Khóa ngoại          |
| product_id         | INT           | Mã sản phẩm        | Khóa ngoại          |
| system_quantity    | INT           | SL trên hệ thống   | Bắt buộc            |
| physical_quantity  | INT           | SL thực tế         | Bắt buộc            |
| variance           | INT           | Chênh lệch SL      | Tự động tính        |
| variance_value     | DECIMAL(15,2) | Chênh lệch giá trị | Tự động tính        |
| note               | TEXT          | Ghi chú            | Tùy chọn            |

**M. Dữ liệu nhật ký hệ thống (Audit Logs)**

| Trường      | Kiểu dữ liệu | Mô tả           | Ràng buộc                     |
| ----------- | ------------ | --------------- | ----------------------------- |
| id          | INT          | Mã log          | Khóa chính, tự tăng           |
| user_id     | INT          | Người thực hiện | Khóa ngoại, tùy chọn          |
| user_name   | VARCHAR(100) | Tên người dùng  | Bắt buộc                      |
| action      | VARCHAR(50)  | Hành động       | CREATE, UPDATE, DELETE, LOGIN |
| entity_type | VARCHAR(50)  | Loại đối tượng  | USER, PRODUCT, IMPORT, EXPORT |
| entity_id   | INT          | Mã đối tượng    | Tùy chọn                      |
| entity_name | VARCHAR(200) | Tên đối tượng   | Tùy chọn                      |
| details     | JSON         | Chi tiết        | Tùy chọn                      |
| ip_address  | VARCHAR(45)  | Địa chỉ IP      | Tùy chọn                      |
| created_at  | DATETIME     | Thời gian       | Tự động                       |

#### 1.2.2. Yêu cầu về chức năng

**A. Nhóm chức năng xác thực và phân quyền**

| STT | Chức năng                  | Mô tả                                      | Phân quyền |
| --- | -------------------------- | ------------------------------------------ | ---------- |
| 1   | Đăng nhập                  | Xác thực người dùng bằng username/password | Tất cả     |
| 2   | Đăng xuất                  | Kết thúc phiên làm việc                    | Tất cả     |
| 3   | Xem thông tin cá nhân      | Xem profile của người dùng hiện tại        | Tất cả     |
| 4   | Cập nhật thông tin cá nhân | Chỉnh sửa họ tên, email                    | Tất cả     |
| 5   | Đổi mật khẩu               | Thay đổi mật khẩu đăng nhập                | Tất cả     |

**B. Nhóm chức năng quản lý người dùng**

| STT | Chức năng                | Mô tả                                      | Phân quyền |
| --- | ------------------------ | ------------------------------------------ | ---------- |
| 1   | Xem danh sách người dùng | Hiển thị danh sách có phân trang, tìm kiếm | ADMIN      |
| 2   | Thêm người dùng          | Tạo tài khoản mới với role ADMIN/STAFF     | ADMIN      |
| 3   | Sửa người dùng           | Cập nhật thông tin người dùng              | ADMIN      |
| 4   | Xóa người dùng           | Xóa tài khoản (không xóa chính mình)       | ADMIN      |
| 5   | Kích hoạt/Vô hiệu hóa    | Bật/tắt trạng thái hoạt động               | ADMIN      |

**C. Nhóm chức năng quản lý danh mục**

| STT | Chức năng              | Mô tả                            | Phân quyền   |
| --- | ---------------------- | -------------------------------- | ------------ |
| 1   | Xem danh sách danh mục | Hiển thị danh sách có phân trang | ADMIN, STAFF |
| 2   | Thêm danh mục          | Tạo danh mục mới                 | ADMIN, STAFF |
| 3   | Sửa danh mục           | Cập nhật thông tin danh mục      | ADMIN, STAFF |
| 4   | Xóa danh mục           | Xóa danh mục (không có sản phẩm) | ADMIN, STAFF |

**D. Nhóm chức năng quản lý sản phẩm**

| STT | Chức năng              | Mô tả                                      | Phân quyền   |
| --- | ---------------------- | ------------------------------------------ | ------------ |
| 1   | Xem danh sách sản phẩm | Hiển thị với phân trang, lọc theo danh mục | ADMIN, STAFF |
| 2   | Tìm kiếm sản phẩm      | Tìm theo tên, SKU                          | ADMIN, STAFF |
| 3   | Thêm sản phẩm          | Tạo sản phẩm mới với SKU duy nhất          | ADMIN, STAFF |
| 4   | Sửa sản phẩm           | Cập nhật thông tin sản phẩm                | ADMIN, STAFF |
| 5   | Xóa sản phẩm           | Xóa sản phẩm (không có giao dịch)          | ADMIN, STAFF |
| 6   | Kích hoạt/Vô hiệu hóa  | Bật/tắt trạng thái sản phẩm                | ADMIN, STAFF |

**E. Nhóm chức năng quản lý nhà cung cấp**

| STT | Chức năng             | Mô tả                      | Phân quyền   |
| --- | --------------------- | -------------------------- | ------------ |
| 1   | Xem danh sách NCC     | Hiển thị với phân trang    | ADMIN, STAFF |
| 2   | Thêm NCC              | Tạo NCC mới với mã tự động | ADMIN, STAFF |
| 3   | Sửa NCC               | Cập nhật thông tin NCC     | ADMIN, STAFF |
| 4   | Xóa NCC               | Xóa NCC                    | ADMIN, STAFF |
| 5   | Kích hoạt/Vô hiệu hóa | Bật/tắt trạng thái NCC     | ADMIN, STAFF |

**F. Nhóm chức năng quản lý khách hàng**

| STT | Chức năng             | Mô tả                     | Phân quyền   |
| --- | --------------------- | ------------------------- | ------------ |
| 1   | Xem danh sách KH      | Hiển thị với phân trang   | ADMIN, STAFF |
| 2   | Thêm KH               | Tạo KH mới với mã tự động | ADMIN, STAFF |
| 3   | Sửa KH                | Cập nhật thông tin KH     | ADMIN, STAFF |
| 4   | Xóa KH                | Xóa KH                    | ADMIN, STAFF |
| 5   | Kích hoạt/Vô hiệu hóa | Bật/tắt trạng thái KH     | ADMIN, STAFF |

**G. Nhóm chức năng quản lý tồn kho**

| STT | Chức năng             | Mô tả                              | Phân quyền   |
| --- | --------------------- | ---------------------------------- | ------------ |
| 1   | Xem danh sách tồn kho | Hiển thị tồn kho với phân trang    | ADMIN, STAFF |
| 2   | Lọc theo danh mục     | Lọc tồn kho theo danh mục sản phẩm | ADMIN, STAFF |
| 3   | Xem cảnh báo hết hàng | Hiển thị SP có SL <= min_stock     | ADMIN, STAFF |
| 4   | Tìm kiếm              | Tìm theo tên SP, SKU               | ADMIN, STAFF |

**H. Nhóm chức năng nhập kho**

| STT | Chức năng                | Mô tả                                  | Phân quyền   |
| --- | ------------------------ | -------------------------------------- | ------------ |
| 1   | Xem danh sách phiếu nhập | Hiển thị với phân trang, lọc theo ngày | ADMIN, STAFF |
| 2   | Xem chi tiết phiếu nhập  | Hiển thị thông tin và danh sách SP     | ADMIN, STAFF |
| 3   | Tạo phiếu nhập           | Tạo phiếu nhập với nhiều SP            | ADMIN, STAFF |
| 4   | Xóa phiếu nhập           | Xóa và hoàn tác tồn kho                | ADMIN        |

**I. Nhóm chức năng xuất kho**

| STT | Chức năng                | Mô tả                                  | Phân quyền   |
| --- | ------------------------ | -------------------------------------- | ------------ |
| 1   | Xem danh sách phiếu xuất | Hiển thị với phân trang, lọc theo ngày | ADMIN, STAFF |
| 2   | Xem chi tiết phiếu xuất  | Hiển thị thông tin và danh sách SP     | ADMIN, STAFF |
| 3   | Tạo phiếu xuất           | Tạo phiếu xuất với kiểm tra tồn kho    | ADMIN, STAFF |
| 4   | Xóa phiếu xuất           | Xóa và hoàn tác tồn kho                | ADMIN        |

**J. Nhóm chức năng kiểm kê kho**

| STT | Chức năng                   | Mô tả                            | Phân quyền   |
| --- | --------------------------- | -------------------------------- | ------------ |
| 1   | Xem danh sách phiếu kiểm kê | Hiển thị với phân trang          | ADMIN, STAFF |
| 2   | Xem chi tiết kiểm kê        | Hiển thị chênh lệch từng SP      | ADMIN, STAFF |
| 3   | Tạo phiếu kiểm kê           | Tạo phiếu kiểm kê mới            | ADMIN, STAFF |
| 4   | Cập nhật phiếu kiểm kê      | Chỉnh sửa số lượng thực tế       | ADMIN, STAFF |
| 5   | Hoàn thành kiểm kê          | Đánh dấu hoàn thành              | ADMIN, STAFF |
| 6   | Xóa phiếu kiểm kê           | Xóa phiếu (chỉ trạng thái DRAFT) | ADMIN        |

**K. Nhóm chức năng Dashboard và thống kê**

| STT | Chức năng                  | Mô tả                           | Phân quyền   |
| --- | -------------------------- | ------------------------------- | ------------ |
| 1   | Xem tổng quan              | Tổng SP, phiếu nhập, phiếu xuất | ADMIN, STAFF |
| 2   | Xem cảnh báo hàng sắp hết  | Danh sách SP có SL <= min_stock | ADMIN, STAFF |
| 3   | Xem giá trị tồn kho        | Tổng giá trị hàng tồn           | ADMIN, STAFF |
| 4   | Xem hoạt động gần đây      | 10 giao dịch gần nhất           | ADMIN, STAFF |
| 5   | Xem thống kê theo tháng    | Biểu đồ nhập/xuất 6 tháng       | ADMIN, STAFF |
| 6   | Xem thống kê theo danh mục | Biểu đồ SP theo danh mục        | ADMIN, STAFF |
| 7   | Xem SP xuất nhiều nhất     | Top SP có SL xuất cao nhất      | ADMIN, STAFF |

**L. Nhóm chức năng báo cáo**

| STT | Chức năng         | Mô tả                                    | Phân quyền   |
| --- | ----------------- | ---------------------------------------- | ------------ |
| 1   | Báo cáo tồn kho   | Danh sách tồn kho hiện tại               | ADMIN, STAFF |
| 2   | Báo cáo nhập xuất | Thống kê nhập/xuất theo khoảng thời gian | ADMIN, STAFF |
| 3   | Xuất CSV          | Export dữ liệu ra file CSV               | ADMIN, STAFF |

**M. Nhóm chức năng nhật ký hệ thống**

| STT | Chức năng             | Mô tả                                     | Phân quyền |
| --- | --------------------- | ----------------------------------------- | ---------- |
| 1   | Xem danh sách nhật ký | Hiển thị với phân trang                   | ADMIN      |
| 2   | Lọc nhật ký           | Lọc theo hành động, đối tượng, người dùng | ADMIN      |
| 3   | Tìm kiếm              | Tìm theo nội dung                         | ADMIN      |

#### 1.2.3. Quy trình xử lý nghiệp vụ

**A. Quy trình nhập kho**

```
Bắt đầu
    │
    ▼
┌─────────────────────────────────────┐
│  1. Chọn nhà cung cấp (tùy chọn)    │
│  2. Nhập thông tin NCC              │
│  3. Chọn ngày nhập                  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  4. Thêm sản phẩm vào phiếu nhập    │
│     - Chọn sản phẩm                 │
│     - Nhập số lượng                 │
│     - Nhập đơn giá                  │
│     - Tự động tính thành tiền       │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  5. Xác nhận tạo phiếu nhập         │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  [TRANSACTION]                      │
│  6. Tạo phiếu nhập                  │
│  7. Tạo chi tiết phiếu nhập         │
│  8. Cập nhật tồn kho (+SL)          │
│  9. Ghi nhật ký hệ thống            │
│  [COMMIT/ROLLBACK]                  │
└─────────────────────────────────────┘
    │
    ▼
Kết thúc
```

**B. Quy trình xuất kho**

```
Bắt đầu
    │
    ▼
┌─────────────────────────────────────┐
│  1. Chọn khách hàng (tùy chọn)      │
│  2. Nhập thông tin KH               │
│  3. Chọn ngày xuất                  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  4. Thêm sản phẩm vào phiếu xuất    │
│     - Chọn sản phẩm                 │
│     - Nhập số lượng                 │
│     - Kiểm tra tồn kho              │
│     - Nhập đơn giá                  │
│     - Tự động tính thành tiền       │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  5. Kiểm tra tồn kho tất cả SP      │
│     - Nếu SL xuất > SL tồn: Báo lỗi │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  [TRANSACTION]                      │
│  6. Tạo phiếu xuất                  │
│  7. Tạo chi tiết phiếu xuất         │
│  8. Cập nhật tồn kho (-SL)          │
│  9. Ghi nhật ký hệ thống            │
│  [COMMIT/ROLLBACK]                  │
└─────────────────────────────────────┘
    │
    ▼
Kết thúc
```

**C. Quy trình kiểm kê kho**

```
Bắt đầu
    │
    ▼
┌─────────────────────────────────────┐
│  1. Tạo phiếu kiểm kê (DRAFT)       │
│     - Chọn ngày kiểm kê             │
│     - Nhập ghi chú                  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  2. Thêm sản phẩm kiểm kê           │
│     - Chọn sản phẩm                 │
│     - Lấy SL hệ thống tự động       │
│     - Nhập SL thực tế               │
│     - Tự động tính chênh lệch       │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  3. Xem xét chênh lệch              │
│     - Dương: Thừa hàng              │
│     - Âm: Thiếu hàng                │
│     - Zero: Khớp                    │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  4. Hoàn thành kiểm kê (COMPLETED)  │
│     - Ghi nhận kết quả              │
│     - Ghi nhật ký hệ thống          │
└─────────────────────────────────────┘
    │
    ▼
Kết thúc
```

### 1.3. Mô tả các nguồn tài liệu và mẫu biểu

#### 1.3.1. Mẫu phiếu nhập kho

```
┌──────────────────────────────────────────────────────────────┐
│                      PHIẾU NHẬP KHO                          │
│                                                              │
│  Mã phiếu: IMP20260114001            Ngày nhập: 14/01/2026   │
│  Nhà cung cấp: Công ty ABC           SĐT: 0901234567         │
│  Người lập phiếu: Nguyễn Văn A                               │
├──────────────────────────────────────────────────────────────┤
│  STT │ Mã SP   │ Tên sản phẩm    │ ĐVT │ SL │ Đơn giá │ TT   │
├──────────────────────────────────────────────────────────────┤
│  1   │ SP001   │ Laptop Dell     │ Cái │ 10 │ 15,000  │150,000│
│  2   │ SP002   │ Chuột Logitech  │ Cái │ 50 │  500    │ 25,000│
│  3   │ SP003   │ Bàn phím        │ Cái │ 30 │  800    │ 24,000│
├──────────────────────────────────────────────────────────────┤
│                              TỔNG CỘNG:          199,000,000 │
├──────────────────────────────────────────────────────────────┤
│  Ghi chú: Hàng nhập đợt 1 tháng 01/2026                      │
└──────────────────────────────────────────────────────────────┘
```

#### 1.3.2. Mẫu phiếu xuất kho

```
┌──────────────────────────────────────────────────────────────┐
│                      PHIẾU XUẤT KHO                          │
│                                                              │
│  Mã phiếu: EXP20260114001            Ngày xuất: 14/01/2026   │
│  Khách hàng: Công ty XYZ             SĐT: 0987654321         │
│  Người lập phiếu: Trần Văn B                                 │
├──────────────────────────────────────────────────────────────┤
│  STT │ Mã SP   │ Tên sản phẩm    │ ĐVT │ SL │ Đơn giá │ TT   │
├──────────────────────────────────────────────────────────────┤
│  1   │ SP001   │ Laptop Dell     │ Cái │  5 │ 18,000  │ 90,000│
│  2   │ SP002   │ Chuột Logitech  │ Cái │ 20 │  650    │ 13,000│
├──────────────────────────────────────────────────────────────┤
│                              TỔNG CỘNG:          103,000,000 │
├──────────────────────────────────────────────────────────────┤
│  Ghi chú: Đơn hàng tháng 01/2026                             │
└──────────────────────────────────────────────────────────────┘
```

#### 1.3.3. Mẫu phiếu kiểm kê

```
┌──────────────────────────────────────────────────────────────┐
│                      PHIẾU KIỂM KÊ KHO                       │
│                                                              │
│  Mã phiếu: CHK20260114001           Ngày kiểm: 14/01/2026    │
│  Trạng thái: COMPLETED              Người kiểm: Nguyễn Văn A │
├──────────────────────────────────────────────────────────────┤
│  STT │ Mã SP   │ Tên SP      │ SL HT │ SL TT │ Chênh lệch    │
├──────────────────────────────────────────────────────────────┤
│  1   │ SP001   │ Laptop Dell │   5   │   5   │      0        │
│  2   │ SP002   │ Chuột       │  30   │  28   │     -2        │
│  3   │ SP003   │ Bàn phím    │  30   │  31   │     +1        │
├──────────────────────────────────────────────────────────────┤
│                        TỔNG CHÊNH LỆCH GIÁ TRỊ:  -1,500,000  │
├──────────────────────────────────────────────────────────────┤
│  Ghi chú: Kiểm kê định kỳ tháng 01/2026                      │
└──────────────────────────────────────────────────────────────┘

* SL HT: Số lượng hệ thống
* SL TT: Số lượng thực tế
```

### 1.4. Phân tích hiện trạng và vấn đề tồn tại

#### 1.4.1. Hiện trạng quản lý kho tại các doanh nghiệp vừa và nhỏ

**Phương pháp quản lý hiện tại:**

| Phương pháp          | Tỷ lệ sử dụng | Ưu điểm                | Nhược điểm                   |
| -------------------- | ------------- | ---------------------- | ---------------------------- |
| Sổ sách thủ công     | 30%           | Chi phí thấp, đơn giản | Dễ sai sót, khó tra cứu      |
| Excel/Spreadsheet    | 45%           | Linh hoạt, quen thuộc  | Không real-time, dễ conflict |
| Phần mềm chuyên dụng | 15%           | Chuyên nghiệp          | Chi phí cao, phức tạp        |
| Kết hợp nhiều PP     | 10%           | Bổ sung lẫn nhau       | Dữ liệu phân tán             |

**Các vấn đề thường gặp:**

1. **Sai lệch số liệu tồn kho**: Do nhập liệu thủ công, không cập nhật kịp thời
2. **Không có cảnh báo hết hàng**: Không biết khi nào cần đặt hàng bổ sung
3. **Khó khăn tra cứu lịch sử**: Không theo dõi được ai nhập/xuất, khi nào
4. **Thiếu báo cáo thống kê**: Không có cái nhìn tổng quan về hoạt động kho
5. **Không phân quyền truy cập**: Mọi người đều có thể chỉnh sửa dữ liệu
6. **Dữ liệu không đồng bộ**: Khi có nhiều người cùng làm việc

#### 1.4.2. Những vấn đề đề tài cần giải quyết

| STT | Vấn đề                  | Giải pháp đề xuất                        |
| --- | ----------------------- | ---------------------------------------- |
| 1   | Sai lệch số liệu        | Tự động cập nhật tồn kho qua transaction |
| 2   | Không cảnh báo hết hàng | Module cảnh báo khi SL <= min_stock      |
| 3   | Khó tra cứu lịch sử     | Audit Log ghi nhận mọi thao tác          |
| 4   | Thiếu báo cáo           | Dashboard + module báo cáo đa dạng       |
| 5   | Không phân quyền        | Hệ thống RBAC với ADMIN/STAFF            |
| 6   | Dữ liệu không đồng bộ   | Database tập trung + API real-time       |
| 7   | Xuất quá tồn kho        | Validation kiểm tra trước khi xuất       |
| 8   | Mất dữ liệu             | Transaction đảm bảo toàn vẹn dữ liệu     |

---

## CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CƠ SỞ THỰC NGHIỆM

### 2.1. Cơ sở lý thuyết

#### 2.1.1. Kiến trúc ứng dụng Web

**A. Kiến trúc Client-Server**

Kiến trúc Client-Server là mô hình phân tán trong đó:

- **Client (Máy khách)**: Gửi yêu cầu đến server và hiển thị kết quả cho người dùng
- **Server (Máy chủ)**: Xử lý yêu cầu từ client và trả về kết quả

```
┌─────────────┐         HTTP Request          ┌─────────────┐
│             │ ──────────────────────────▶   │             │
│   Client    │                               │   Server    │
│  (Browser)  │   ◀──────────────────────────  │   (API)     │
│             │         HTTP Response         │             │
└─────────────┘                               └─────────────┘
```

**B. Kiến trúc 3-Tier (3 tầng)**

Hệ thống được thiết kế theo kiến trúc 3 tầng:

| Tầng | Tên gọi              | Chức năng            | Công nghệ         |
| ---- | -------------------- | -------------------- | ----------------- |
| 1    | Presentation Layer   | Giao diện người dùng | React.js          |
| 2    | Business Logic Layer | Xử lý nghiệp vụ      | Node.js + Express |
| 3    | Data Access Layer    | Truy xuất dữ liệu    | MySQL             |

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│                      (React.js)                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Dashboard│  │Products │  │ Imports │  │ Exports │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                       │
│                   (Node.js + Express)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Controllers│  │ Services │  │Middleware│  │Validators│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                         │
│                       (MySQL)                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Users  │  │Products │  │ Stocks  │  │ Receipts│        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
└─────────────────────────────────────────────────────────────┘
```

#### 2.1.2. RESTful API

**A. Khái niệm**

REST (Representational State Transfer) là kiến trúc phần mềm cho các hệ thống phân tán, đặc biệt là web services. RESTful API là API tuân theo các nguyên tắc REST.

**B. Nguyên tắc thiết kế REST**

| Nguyên tắc        | Mô tả                              | Ví dụ trong hệ thống              |
| ----------------- | ---------------------------------- | --------------------------------- |
| Stateless         | Server không lưu trạng thái client | Mỗi request kèm JWT token         |
| Client-Server     | Tách biệt client và server         | React (client) - Express (server) |
| Uniform Interface | Giao diện thống nhất               | /api/products, /api/imports       |
| Layered System    | Hệ thống phân tầng                 | Controllers → Services → Models   |
| Cacheable         | Có thể cache                       | Cache response với ETag           |

**C. HTTP Methods trong REST**

| Method | Chức năng         | Ví dụ                               |
| ------ | ----------------- | ----------------------------------- |
| GET    | Lấy dữ liệu       | GET /api/products                   |
| POST   | Tạo mới           | POST /api/products                  |
| PUT    | Cập nhật toàn bộ  | PUT /api/products/1                 |
| PATCH  | Cập nhật một phần | PATCH /api/products/1/toggle-status |
| DELETE | Xóa               | DELETE /api/products/1              |

**D. HTTP Status Codes**

| Mã  | Ý nghĩa               | Sử dụng                   |
| --- | --------------------- | ------------------------- |
| 200 | OK                    | Yêu cầu thành công        |
| 201 | Created               | Tạo mới thành công        |
| 400 | Bad Request           | Dữ liệu không hợp lệ      |
| 401 | Unauthorized          | Chưa xác thực             |
| 403 | Forbidden             | Không có quyền truy cập   |
| 404 | Not Found             | Không tìm thấy tài nguyên |
| 500 | Internal Server Error | Lỗi server                |

#### 2.1.3. Mô hình MVC (Model-View-Controller)

**A. Khái niệm**

MVC là mẫu kiến trúc phần mềm chia ứng dụng thành 3 thành phần:

| Thành phần | Chức năng                        | Trong hệ thống    |
| ---------- | -------------------------------- | ----------------- |
| Model      | Quản lý dữ liệu, logic nghiệp vụ | /models/*.js      |
| View       | Hiển thị giao diện               | React components  |
| Controller | Điều khiển luồng xử lý           | /controllers/*.js |

**B. Luồng xử lý MVC**

```
┌─────────┐     Request      ┌────────────┐     Query      ┌───────┐
│  User   │ ──────────────▶  │ Controller │ ─────────────▶ │ Model │
│ (View)  │                  │            │                │       │
│         │  ◀──────────────  │            │  ◀─────────────│       │
└─────────┘     Response     └────────────┘     Data       └───────┘
```

#### 2.1.4. JSON Web Token (JWT)

**A. Khái niệm**

JWT là chuẩn mở (RFC 7519) để truyền thông tin an toàn giữa các bên dưới dạng JSON object. JWT được sử dụng cho xác thực và trao đổi thông tin.

**B. Cấu trúc JWT**

JWT gồm 3 phần, ngăn cách bởi dấu chấm (.):

```
xxxxx.yyyyy.zzzzz
  │      │      │
  │      │      └── Signature (Chữ ký)
  │      └── Payload (Dữ liệu)
  └── Header (Tiêu đề)
```

**Ví dụ JWT Payload trong hệ thống:**

```json
{
  "id": 1,
  "username": "admin",
  "role": "ADMIN",
  "iat": 1704153600,
  "exp": 1704758400
}
```

**C. Quy trình xác thực JWT**

```
┌─────────┐                                           ┌─────────┐
│  Client │                                           │  Server │
└────┬────┘                                           └────┬────┘
     │                                                     │
     │  1. POST /api/auth/login {username, password}       │
     │ ───────────────────────────────────────────────────▶│
     │                                                     │
     │                  2. Verify credentials              │
     │                  3. Generate JWT                    │
     │                                                     │
     │  4. Response: {token: "eyJhbGc..."}                 │
     │ ◀───────────────────────────────────────────────────│
     │                                                     │
     │  5. GET /api/products                               │
     │     Header: Authorization: Bearer eyJhbGc...        │
     │ ───────────────────────────────────────────────────▶│
     │                                                     │
     │                  6. Verify JWT                      │
     │                  7. Process request                 │
     │                                                     │
     │  8. Response: {products: [...]}                     │
     │ ◀───────────────────────────────────────────────────│
```

#### 2.1.5. Database Transaction

**A. Khái niệm**

Transaction là một đơn vị công việc logic bao gồm nhiều thao tác database. Transaction đảm bảo tính toàn vẹn dữ liệu theo nguyên tắc ACID:

| Thuộc tính  | Ý nghĩa                    | Ví dụ trong hệ thống                   |
| ----------- | -------------------------- | -------------------------------------- |
| Atomicity   | Tất cả hoặc không gì cả    | Nhập kho: tạo phiếu + cập nhật tồn kho |
| Consistency | Dữ liệu nhất quán          | Tồn kho luôn >= 0                      |
| Isolation   | Các transaction độc lập    | Nhiều người nhập kho cùng lúc          |
| Durability  | Dữ liệu được lưu vĩnh viễn | Sau COMMIT, dữ liệu không mất          |

**B. Ví dụ Transaction nhập kho**

```javascript
BEGIN TRANSACTION;

-- 1. Tạo phiếu nhập
INSERT INTO import_receipts (receipt_code, user_id, ...)
VALUES ('IMP20260114001', 1, ...);

-- 2. Tạo chi tiết phiếu nhập
INSERT INTO import_receipt_items (import_receipt_id, product_id, quantity, ...)
VALUES (1, 101, 10, ...);

-- 3. Cập nhật tồn kho
UPDATE stocks SET quantity = quantity + 10
WHERE product_id = 101;

-- Nếu tất cả thành công
COMMIT;

-- Nếu có lỗi
ROLLBACK;
```

#### 2.1.6. Role-Based Access Control (RBAC)

**A. Khái niệm**

RBAC là phương pháp kiểm soát quyền truy cập dựa trên vai trò của người dùng trong tổ chức.

**B. Ma trận phân quyền trong hệ thống**

| Chức năng           | ADMIN | STAFF |
| ------------------- |:-----:|:-----:|
| Quản lý người dùng  | ✓     | ✗     |
| Xem audit log       | ✓     | ✗     |
| Xóa phiếu nhập/xuất | ✓     | ✗     |
| Quản lý sản phẩm    | ✓     | ✓     |
| Nhập kho            | ✓     | ✓     |
| Xuất kho            | ✓     | ✓     |
| Xem báo cáo         | ✓     | ✓     |
| Kiểm kê kho         | ✓     | ✓     |

### 2.2. Cơ sở thực nghiệm - Công nghệ sử dụng

#### 2.2.1. Lựa chọn công nghệ Backend

**A. So sánh các framework Backend phổ biến**

| Tiêu chí         | Node.js/Express | Python/Django | Java/Spring | PHP/Laravel |
| ---------------- |:---------------:|:-------------:|:-----------:|:-----------:|
| Hiệu năng        | ★★★★★           | ★★★☆☆         | ★★★★☆       | ★★★☆☆       |
| Dễ học           | ★★★★★           | ★★★★☆         | ★★☆☆☆       | ★★★★☆       |
| Ecosystem        | ★★★★★           | ★★★★☆         | ★★★★☆       | ★★★☆☆       |
| Real-time        | ★★★★★           | ★★☆☆☆         | ★★★☆☆       | ★★☆☆☆       |
| Khả năng mở rộng | ★★★★★           | ★★★☆☆         | ★★★★★       | ★★★☆☆       |
| Cộng đồng        | ★★★★★           | ★★★★☆         | ★★★★☆       | ★★★★☆       |

**B. Lý do chọn Node.js + Express**

1. **JavaScript toàn stack**: Sử dụng cùng ngôn ngữ cho cả frontend và backend, giảm chi phí học tập
2. **Non-blocking I/O**: Xử lý nhiều request đồng thời hiệu quả
3. **NPM ecosystem**: Hơn 2 triệu packages, dễ dàng tích hợp các thư viện
4. **Express.js minimal**: Framework nhẹ, linh hoạt, không ràng buộc cấu trúc
5. **JSON native**: Làm việc với JSON tự nhiên, phù hợp với REST API
6. **Cộng đồng lớn**: Nhiều tài liệu, tutorials, hỗ trợ

**C. Chi tiết các thư viện Backend**

| Thư viện           | Phiên bản | Chức năng                     |
| ------------------ | --------- | ----------------------------- |
| express            | 4.18.2    | Web framework                 |
| mysql2             | 3.6.5     | MySQL driver với Promise      |
| jsonwebtoken       | 9.0.2     | Tạo và verify JWT             |
| bcryptjs           | 2.4.3     | Mã hóa password               |
| express-validator  | 7.0.1     | Validate request data         |
| helmet             | 7.1.0     | Security headers              |
| cors               | 2.8.5     | Cross-Origin Resource Sharing |
| express-rate-limit | 7.1.5     | Rate limiting                 |
| morgan             | 1.10.0    | HTTP request logger           |
| multer             | 1.4.5     | File upload                   |
| csv-writer         | 1.6.0     | Export CSV                    |
| moment             | 2.29.4    | Date/time formatting          |
| dotenv             | 16.3.1    | Environment variables         |

#### 2.2.2. Lựa chọn công nghệ Frontend

**A. So sánh các framework Frontend phổ biến**

| Tiêu chí  | React | Vue.js | Angular | Svelte |
| --------- |:-----:|:------:|:-------:|:------:|
| Hiệu năng | ★★★★☆ | ★★★★☆  | ★★★☆☆   | ★★★★★  |
| Dễ học    | ★★★★☆ | ★★★★★  | ★★☆☆☆   | ★★★★☆  |
| Ecosystem | ★★★★★ | ★★★★☆  | ★★★★☆   | ★★★☆☆  |
| Việc làm  | ★★★★★ | ★★★★☆  | ★★★★☆   | ★★☆☆☆  |
| Linh hoạt | ★★★★★ | ★★★★☆  | ★★★☆☆   | ★★★★☆  |
| Cộng đồng | ★★★★★ | ★★★★☆  | ★★★★☆   | ★★★☆☆  |

**B. Lý do chọn React**

1. **Component-based**: Xây dựng UI từ các component tái sử dụng
2. **Virtual DOM**: Cập nhật UI hiệu quả, hiệu năng cao
3. **JSX**: Viết HTML trong JavaScript trực quan
4. **Hooks**: Quản lý state và lifecycle đơn giản
5. **Ecosystem phong phú**: Nhiều thư viện hỗ trợ (Router, Form, Charts)
6. **React DevTools**: Debug dễ dàng
7. **Phổ biến nhất**: Nhiều tài liệu, cơ hội việc làm

**C. Chi tiết các thư viện Frontend**

| Thư viện         | Phiên bản | Chức năng                  |
| ---------------- | --------- | -------------------------- |
| react            | 18.2.0    | UI library                 |
| react-dom        | 18.2.0    | React rendering            |
| react-router-dom | 6.20.1    | Client-side routing        |
| axios            | 1.6.2     | HTTP client                |
| react-hook-form  | 7.49.2    | Form management            |
| react-toastify   | 9.1.3     | Toast notifications        |
| chart.js         | 4.5.1     | Charts library             |
| react-chartjs-2  | 5.2.0     | React wrapper for Chart.js |
| date-fns         | 3.0.6     | Date utilities             |
| lucide-react     | 0.298.0   | Icon library               |
| xlsx             | 0.18.5    | Excel export               |

**D. Vite - Build Tool**

Chọn **Vite** thay vì Create React App vì:

| Tiêu chí               | Vite     | Create React App |
| ---------------------- | -------- | ---------------- |
| Dev server startup     | < 1 giây | 30-60 giây       |
| Hot Module Replacement | Instant  | 3-5 giây         |
| Build time             | Nhanh    | Chậm             |
| Bundle size            | Tối ưu   | Lớn hơn          |
| Configuration          | Đơn giản | Phức tạp (eject) |

#### 2.2.3. Lựa chọn Database

**A. So sánh các hệ quản trị cơ sở dữ liệu**

| Tiêu chí            | MySQL | PostgreSQL | MongoDB | SQLite |
| ------------------- |:-----:|:----------:|:-------:|:------:|
| ACID Compliance     | ★★★★★ | ★★★★★      | ★★★☆☆   | ★★★★☆  |
| Hiệu năng           | ★★★★☆ | ★★★★☆      | ★★★★★   | ★★★☆☆  |
| Dễ sử dụng          | ★★★★★ | ★★★★☆      | ★★★★☆   | ★★★★★  |
| Hosting options     | ★★★★★ | ★★★★☆      | ★★★★☆   | ★★☆☆☆  |
| Transaction support | ★★★★★ | ★★★★★      | ★★★☆☆   | ★★★★☆  |
| Cộng đồng           | ★★★★★ | ★★★★☆      | ★★★★☆   | ★★★☆☆  |

**B. Lý do chọn MySQL**

1. **Quan hệ (Relational)**: Phù hợp với dữ liệu có cấu trúc rõ ràng như kho hàng
2. **ACID Compliance**: Đảm bảo tính toàn vẹn dữ liệu cho transaction nhập/xuất kho
3. **Foreign Key**: Ràng buộc quan hệ giữa các bảng
4. **Transaction support**: Hỗ trợ BEGIN, COMMIT, ROLLBACK
5. **Phổ biến**: Nhiều hosting support, tài liệu phong phú
6. **Performance**: Hiệu năng tốt với dữ liệu vừa và nhỏ
7. **Free & Open Source**: Không tốn chi phí license

**C. Thiết kế quan hệ phù hợp với nghiệp vụ kho**

```
┌─────────────────┐       ┌─────────────────┐
│    categories   │       │    suppliers    │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │ 1:N                     │ 1:N
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│    products     │◀──────│ import_receipts │
└────────┬────────┘   N:M └────────┬────────┘
         │                         │
         │ 1:1                     │ 1:N
         ▼                         ▼
┌─────────────────┐       ┌─────────────────────┐
│     stocks      │       │ import_receipt_items│
└─────────────────┘       └─────────────────────┘
```

### 2.3. Kết luận chọn công nghệ

**Stack công nghệ được chọn:**

| Tầng           | Công nghệ         | Lý do                                         |
| -------------- | ----------------- | --------------------------------------------- |
| Frontend       | React 18 + Vite   | Component-based, hiệu năng cao, ecosystem lớn |
| Backend        | Node.js + Express | Non-blocking I/O, JavaScript fullstack, NPM   |
| Database       | MySQL             | ACID, transaction support, quan hệ rõ ràng    |
| Authentication | JWT               | Stateless, scalable, secure                   |
| API Style      | RESTful           | Chuẩn hóa, dễ hiểu, dễ test                   |

**Kiến trúc tổng thể:**

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    React 18 + Vite                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │  Pages   │ │Components│ │ Contexts │ │  Hooks   │      │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS (REST API + JWT)
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                        SERVER TIER                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                 Node.js + Express.js                       │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │  Routes  │ │Controllers│ │ Services │ │  Models  │      │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │  │
│  │  │Middleware│ │Validators│ │  Utils   │                   │  │
│  │  └──────────┘ └──────────┘ └──────────┘                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ MySQL Protocol (TCP/IP)
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                         DATA TIER                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      MySQL 5.7+                            │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │  │
│  │  │ users  │ │products│ │ stocks │ │imports │ │exports │   │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## CHƯƠNG 3: PHƯƠNG PHÁP, QUY TRÌNH THỰC HIỆN

### 3.1. Phân tích yêu cầu

#### 3.1.1. Phân tích Use Case

**A. Biểu đồ Use Case tổng quan**

```
                           ┌─────────────────────────────────────────────┐
                           │        HỆ THỐNG QUẢN LÝ KHO HÀNG           │
                           │                                             │
    ┌─────────┐            │  ┌─────────────┐     ┌─────────────┐       │
    │         │            │  │ Đăng nhập   │     │ Đăng xuất   │       │
    │  ADMIN  │────────────┼──│             │     │             │       │
    │         │            │  └─────────────┘     └─────────────┘       │
    └────┬────┘            │                                             │
         │                 │  ┌─────────────┐     ┌─────────────┐       │
         │                 │  │ Quản lý     │     │ Quản lý     │       │
         ├─────────────────┼──│ người dùng  │     │ sản phẩm    │───────┼───┐
         │                 │  └─────────────┘     └─────────────┘       │   │
         │                 │                                             │   │
         │                 │  ┌─────────────┐     ┌─────────────┐       │   │
         │                 │  │ Xem Audit   │     │ Quản lý     │       │   │
         ├─────────────────┼──│ Log         │     │ danh mục    │───────┼───┤
         │                 │  └─────────────┘     └─────────────┘       │   │
         │                 │                                             │   │
         │                 │  ┌─────────────┐     ┌─────────────┐       │   │
         │                 │  │ Nhập kho    │     │ Xuất kho    │       │   │
         ├─────────────────┼──│             │     │             │───────┼───┤
         │                 │  └─────────────┘     └─────────────┘       │   │
         │                 │                                             │   │
         │                 │  ┌─────────────┐     ┌─────────────┐       │   │
         │                 │  │ Kiểm kê     │     │ Xem báo cáo │       │   │
         ├─────────────────┼──│ kho         │     │ thống kê    │───────┼───┤
         │                 │  └─────────────┘     └─────────────┘       │   │
         │                 │                                             │   │
         │                 │  ┌─────────────┐     ┌─────────────┐       │   │
         │                 │  │ Quản lý NCC │     │ Quản lý KH  │       │   │
         └─────────────────┼──│             │     │             │───────┼───┘
                           │  └─────────────┘     └─────────────┘       │
                           │                                             │
                           └─────────────────────────────────────────────┘
                                                                     │
                                                               ┌─────┴─────┐
                                                               │   STAFF   │
                                                               └───────────┘
```

**B. Đặc tả Use Case chính**

**UC01: Đăng nhập hệ thống**

| Thành phần           | Mô tả                                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Tên Use Case         | Đăng nhập hệ thống                                                                                                                |
| Tác nhân             | ADMIN, STAFF                                                                                                                      |
| Mô tả                | Người dùng xác thực để truy cập hệ thống                                                                                          |
| Điều kiện tiên quyết | Có tài khoản trong hệ thống                                                                                                       |
| Luồng chính          | 1. Người dùng nhập username và password<br>2. Hệ thống xác thực thông tin<br>3. Hệ thống tạo JWT token<br>4. Chuyển đến Dashboard |
| Luồng ngoại lệ       | 3a. Sai username/password: Hiển thị lỗi<br>3b. Tài khoản bị khóa: Hiển thị thông báo                                              |
| Điều kiện sau        | Người dùng được đăng nhập, có JWT token                                                                                           |

**UC02: Tạo phiếu nhập kho**

| Thành phần           | Mô tả                                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tên Use Case         | Tạo phiếu nhập kho                                                                                                                                                             |
| Tác nhân             | ADMIN, STAFF                                                                                                                                                                   |
| Mô tả                | Tạo phiếu nhập hàng từ nhà cung cấp                                                                                                                                            |
| Điều kiện tiên quyết | Đã đăng nhập, có sản phẩm trong hệ thống                                                                                                                                       |
| Luồng chính          | 1. Chọn/nhập thông tin nhà cung cấp<br>2. Chọn ngày nhập<br>3. Thêm sản phẩm (chọn SP, nhập SL, đơn giá)<br>4. Xác nhận tạo phiếu<br>5. Hệ thống tạo phiếu và cập nhật tồn kho |
| Luồng ngoại lệ       | 4a. Không có sản phẩm: Hiển thị lỗi<br>4b. Số lượng <= 0: Hiển thị lỗi                                                                                                         |
| Điều kiện sau        | Phiếu nhập được tạo, tồn kho được cập nhật                                                                                                                                     |

**UC03: Tạo phiếu xuất kho**

| Thành phần           | Mô tả                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên Use Case         | Tạo phiếu xuất kho                                                                                                                                                                                       |
| Tác nhân             | ADMIN, STAFF                                                                                                                                                                                             |
| Mô tả                | Tạo phiếu xuất hàng cho khách hàng                                                                                                                                                                       |
| Điều kiện tiên quyết | Đã đăng nhập, có sản phẩm tồn kho                                                                                                                                                                        |
| Luồng chính          | 1. Chọn/nhập thông tin khách hàng<br>2. Chọn ngày xuất<br>3. Thêm sản phẩm (chọn SP, nhập SL, đơn giá)<br>4. Hệ thống kiểm tra tồn kho<br>5. Xác nhận tạo phiếu<br>6. Hệ thống tạo phiếu và giảm tồn kho |
| Luồng ngoại lệ       | 4a. SL xuất > SL tồn: Hiển thị lỗi, không cho xuất                                                                                                                                                       |
| Điều kiện sau        | Phiếu xuất được tạo, tồn kho được giảm                                                                                                                                                                   |

#### 3.1.2. Phân tích lớp (Class Diagram)

**A. Diagram các Entity chính**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLASS DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│    User       │         │   Category    │         │   Supplier    │
├───────────────┤         ├───────────────┤         ├───────────────┤
│ -id: int      │         │ -id: int      │         │ -id: int      │
│ -username     │         │ -name         │         │ -code         │
│ -email        │         │ -description  │         │ -name         │
│ -password     │         │ -created_at   │         │ -phone        │
│ -full_name    │         │ -updated_at   │         │ -email        │
│ -role         │         └───────┬───────┘         │ -address      │
│ -is_active    │                 │                 │ -is_active    │
└───────────────┘                 │ 1               └───────┬───────┘
                                  │                         │
                                  │ *                       │ 1
                          ┌───────┴───────┐                 │
                          │   Product     │                 │
                          ├───────────────┤                 │ *
                          │ -id: int      │         ┌───────┴───────┐
                          │ -category_id  │         │ImportReceipt  │
                          │ -sku          │         ├───────────────┤
                          │ -name         │◀────────│ -id: int      │
                          │ -price        │    *    │ -receipt_code │
                          │ -unit         │         │ -user_id      │
                          │ -min_stock    │         │ -supplier_id  │
                          │ -is_active    │         │ -total_amount │
                          └───────┬───────┘         │ -import_date  │
                                  │                 └───────┬───────┘
                                  │ 1                       │
                                  │                         │ 1
                          ┌───────┴───────┐                 │
                          │    Stock      │                 │ *
                          ├───────────────┤         ┌───────┴───────────┐
                          │ -id: int      │         │ImportReceiptItem  │
                          │ -product_id   │         ├───────────────────┤
                          │ -quantity     │         │ -id: int          │
                          │ -last_import  │         │ -receipt_id       │
                          │ -last_export  │         │ -product_id       │
                          └───────────────┘         │ -quantity         │
                                                    │ -unit_price       │
                                                    │ -subtotal         │
                                                    └───────────────────┘
```

#### 3.1.3. Phân tích tuần tự (Sequence Diagram)

**A. Sequence Diagram - Đăng nhập**

```
┌──────┐          ┌──────────┐          ┌────────────┐          ┌───────┐
│Client│          │AuthRouter│          │AuthControll│          │UserMod│
└──┬───┘          └────┬─────┘          └─────┬──────┘          └───┬───┘
   │                   │                      │                     │
   │ POST /login       │                      │                     │
   │ {username, pass}  │                      │                     │
   │──────────────────▶│                      │                     │
   │                   │                      │                     │
   │                   │ login(req, res)      │                     │
   │                   │─────────────────────▶│                     │
   │                   │                      │                     │
   │                   │                      │ findByUsername()    │
   │                   │                      │────────────────────▶│
   │                   │                      │                     │
   │                   │                      │     user data       │
   │                   │                      │◀────────────────────│
   │                   │                      │                     │
   │                   │                      │ bcrypt.compare()    │
   │                   │                      │─────────┐           │
   │                   │                      │         │           │
   │                   │                      │◀────────┘           │
   │                   │                      │                     │
   │                   │                      │ jwt.sign()          │
   │                   │                      │─────────┐           │
   │                   │                      │         │           │
   │                   │                      │◀────────┘           │
   │                   │                      │                     │
   │                   │    {token, user}     │                     │
   │                   │◀─────────────────────│                     │
   │                   │                      │                     │
   │ {token, user}     │                      │                     │
   │◀──────────────────│                      │                     │
```

**B. Sequence Diagram - Tạo phiếu nhập kho**

```
┌──────┐     ┌────────┐     ┌──────────┐     ┌──────────┐     ┌───────┐     ┌───────┐
│Client│     │ImRouter│     │ImControll│     │ImService │     │Receipt│     │ Stock │
└──┬───┘     └───┬────┘     └────┬─────┘     └────┬─────┘     └───┬───┘     └───┬───┘
   │             │               │                │               │             │
   │ POST /imports               │                │               │             │
   │ {supplier, items}           │                │               │             │
   │────────────▶│               │                │               │             │
   │             │               │                │               │             │
   │             │ create()      │                │               │             │
   │             │──────────────▶│                │               │             │
   │             │               │                │               │             │
   │             │               │ createReceipt()│               │             │
   │             │               │───────────────▶│               │             │
   │             │               │                │               │             │
   │             │               │                │ BEGIN TRANS   │             │
   │             │               │                │───────────────┼─────────────│
   │             │               │                │               │             │
   │             │               │                │ INSERT receipt│             │
   │             │               │                │──────────────▶│             │
   │             │               │                │               │             │
   │             │               │                │  receipt_id   │             │
   │             │               │                │◀──────────────│             │
   │             │               │                │               │             │
   │             │               │                │ LOOP: items   │             │
   │             │               │                │──────────────▶│             │
   │             │               │                │ INSERT item   │             │
   │             │               │                │               │             │
   │             │               │                │ UPDATE stock  │             │
   │             │               │                │───────────────┼────────────▶│
   │             │               │                │               │             │
   │             │               │                │ COMMIT        │             │
   │             │               │                │───────────────┼─────────────│
   │             │               │                │               │             │
   │             │               │    receipt     │               │             │
   │             │               │◀───────────────│               │             │
   │             │               │                │               │             │
   │             │  {receipt}    │                │               │             │
   │             │◀──────────────│                │               │             │
   │             │               │                │               │             │
   │ {receipt}   │               │                │               │             │
   │◀────────────│               │                │               │             │
```

### 3.2. Thiết kế hệ thống

#### 3.2.1. Thiết kế cơ sở dữ liệu

**A. Lược đồ quan hệ (ERD)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENTITY RELATIONSHIP DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │    users    │
                                    ├─────────────┤
                                    │ PK id       │
                                    │    username │
                                    │    email    │
                                    │    password │
                                    │    role     │
                                    └──────┬──────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
              ▼                            ▼                            ▼
    ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
    │ import_receipts │          │ export_receipts │          │inventory_checks │
    ├─────────────────┤          ├─────────────────┤          ├─────────────────┤
    │ PK id           │          │ PK id           │          │ PK id           │
    │ FK user_id      │          │ FK user_id      │          │ FK user_id      │
    │ FK supplier_id  │          │ FK customer_id  │          │    check_code   │
    │    receipt_code │          │    receipt_code │          │    status       │
    │    total_amount │          │    total_amount │          │    check_date   │
    └────────┬────────┘          └────────┬────────┘          └────────┬────────┘
             │                            │                            │
             │ 1:N                        │ 1:N                        │ 1:N
             ▼                            ▼                            ▼
    ┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
    │import_receipt_item│        │export_receipt_item│        │inventory_check_det│
    ├───────────────────┤        ├───────────────────┤        ├───────────────────┤
    │ PK id             │        │ PK id             │        │ PK id             │
    │ FK receipt_id     │        │ FK receipt_id     │        │ FK check_id       │
    │ FK product_id     │        │ FK product_id     │        │ FK product_id     │
    │    quantity       │        │    quantity       │        │    system_qty     │
    │    unit_price     │        │    unit_price     │        │    physical_qty   │
    │    subtotal       │        │    subtotal       │        │    variance       │
    └─────────┬─────────┘        └─────────┬─────────┘        └───────────────────┘
              │                            │
              │ N:1                        │ N:1
              ▼                            ▼
    ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
    │    products     │◀─────────│     stocks      │          │   categories    │
    ├─────────────────┤   1:1    ├─────────────────┤          ├─────────────────┤
    │ PK id           │          │ PK id           │          │ PK id           │
    │ FK category_id  │◀─────────│ FK product_id   │          │    name         │
    │    sku          │   N:1    │    quantity     │          │    description  │
    │    name         │          │    last_import  │          └─────────────────┘
    │    price        │          │    last_export  │
    │    unit         │          └─────────────────┘
    └─────────────────┘

    ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
    │   suppliers     │          │   customers     │          │   audit_logs    │
    ├─────────────────┤          ├─────────────────┤          ├─────────────────┤
    │ PK id           │          │ PK id           │          │ PK id           │
    │    code         │          │    code         │          │ FK user_id      │
    │    name         │          │    name         │          │    action       │
    │    phone        │          │    phone        │          │    entity_type  │
    │    email        │          │    email        │          │    entity_id    │
    │    address      │          │    address      │          │    details      │
    └─────────────────┘          └─────────────────┘          └─────────────────┘
```

**B. Chi tiết các bảng dữ liệu**

```sql
-- Bảng users: Lưu thông tin người dùng
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- Bảng categories: Danh mục sản phẩm
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Bảng products: Sản phẩm
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    unit VARCHAR(20) NOT NULL,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    min_stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_sku (sku),
    INDEX idx_name (name),
    INDEX idx_category (category_id)
);

-- Bảng stocks: Tồn kho
CREATE TABLE stocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNIQUE NOT NULL,
    quantity INT DEFAULT 0,
    last_import_date DATETIME,
    last_export_date DATETIME,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_quantity (quantity)
);

-- Bảng suppliers: Nhà cung cấp
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    tax_code VARCHAR(20),
    note TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_name (name)
);

-- Bảng customers: Khách hàng
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    tax_code VARCHAR(20),
    note TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_name (name)
);

-- Bảng import_receipts: Phiếu nhập kho
CREATE TABLE import_receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    supplier_id INT,
    supplier_name VARCHAR(200) NOT NULL,
    supplier_phone VARCHAR(20),
    total_amount DECIMAL(15,2) DEFAULT 0,
    note TEXT,
    import_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    INDEX idx_receipt_code (receipt_code),
    INDEX idx_import_date (import_date)
);

-- Bảng import_receipt_items: Chi tiết phiếu nhập
CREATE TABLE import_receipt_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    import_receipt_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (import_receipt_id) REFERENCES import_receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_receipt (import_receipt_id)
);

-- Bảng export_receipts: Phiếu xuất kho
CREATE TABLE export_receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    customer_id INT,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20),
    total_amount DECIMAL(15,2) DEFAULT 0,
    note TEXT,
    export_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_receipt_code (receipt_code),
    INDEX idx_export_date (export_date)
);

-- Bảng export_receipt_items: Chi tiết phiếu xuất
CREATE TABLE export_receipt_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    export_receipt_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (export_receipt_id) REFERENCES export_receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_receipt (export_receipt_id)
);

-- Bảng audit_logs: Nhật ký hệ thống
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    entity_name VARCHAR(200),
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type),
    INDEX idx_created (created_at)
);
```

#### 3.2.2. Thiết kế API

**A. Cấu trúc API Endpoints**

| Nhóm             | Prefix                | Mô tả                |
| ---------------- | --------------------- | -------------------- |
| Authentication   | /api/auth             | Đăng nhập, profile   |
| Users            | /api/users            | Quản lý người dùng   |
| Categories       | /api/categories       | Quản lý danh mục     |
| Products         | /api/products         | Quản lý sản phẩm     |
| Stocks           | /api/stocks           | Quản lý tồn kho      |
| Suppliers        | /api/suppliers        | Quản lý nhà cung cấp |
| Customers        | /api/customers        | Quản lý khách hàng   |
| Imports          | /api/imports          | Quản lý phiếu nhập   |
| Exports          | /api/exports          | Quản lý phiếu xuất   |
| Inventory Checks | /api/inventory-checks | Quản lý kiểm kê      |
| Dashboard        | /api/dashboard        | Thống kê             |
| Reports          | /api/reports          | Báo cáo              |
| Audit Logs       | /api/audit-logs       | Nhật ký              |

**B. Chi tiết API Endpoints**

```
# Authentication
POST   /api/auth/login              # Đăng nhập
GET    /api/auth/profile            # Lấy thông tin profile
PUT    /api/auth/profile            # Cập nhật profile
PUT    /api/auth/change-password    # Đổi mật khẩu

# Users (ADMIN only)
GET    /api/users                   # Danh sách người dùng
GET    /api/users/:id               # Chi tiết người dùng
POST   /api/users                   # Tạo người dùng
PUT    /api/users/:id               # Cập nhật người dùng
DELETE /api/users/:id               # Xóa người dùng
PATCH  /api/users/:id/toggle-status # Bật/tắt trạng thái

# Categories
GET    /api/categories              # Danh sách danh mục (phân trang)
GET    /api/categories/all          # Tất cả danh mục (không phân trang)
GET    /api/categories/:id          # Chi tiết danh mục
POST   /api/categories              # Tạo danh mục
PUT    /api/categories/:id          # Cập nhật danh mục
DELETE /api/categories/:id          # Xóa danh mục

# Products
GET    /api/products                # Danh sách sản phẩm
GET    /api/products/search         # Tìm kiếm sản phẩm
GET    /api/products/:id            # Chi tiết sản phẩm
POST   /api/products                # Tạo sản phẩm
PUT    /api/products/:id            # Cập nhật sản phẩm
DELETE /api/products/:id            # Xóa sản phẩm
PATCH  /api/products/:id/toggle     # Bật/tắt trạng thái

# Stocks
GET    /api/stocks                  # Danh sách tồn kho
GET    /api/stocks/alerts           # Cảnh báo hàng sắp hết
GET    /api/stocks/product/:id      # Tồn kho theo sản phẩm

# Imports
GET    /api/imports                 # Danh sách phiếu nhập
GET    /api/imports/:id             # Chi tiết phiếu nhập
POST   /api/imports                 # Tạo phiếu nhập
DELETE /api/imports/:id             # Xóa phiếu nhập (ADMIN)

# Exports
GET    /api/exports                 # Danh sách phiếu xuất
GET    /api/exports/:id             # Chi tiết phiếu xuất
POST   /api/exports                 # Tạo phiếu xuất
DELETE /api/exports/:id             # Xóa phiếu xuất (ADMIN)

# Dashboard
GET    /api/dashboard/stats         # Thống kê tổng quan
GET    /api/dashboard/low-stock     # Hàng sắp hết
GET    /api/dashboard/recent        # Hoạt động gần đây
GET    /api/dashboard/monthly       # Thống kê theo tháng
GET    /api/dashboard/category      # Thống kê theo danh mục
GET    /api/dashboard/top-exports   # SP xuất nhiều nhất

# Reports
GET    /api/reports/inventory       # Báo cáo tồn kho
GET    /api/reports/import-export   # Báo cáo nhập xuất
GET    /api/reports/export-csv      # Xuất CSV

# Audit Logs (ADMIN)
GET    /api/audit-logs              # Danh sách nhật ký
```

**C. Cấu trúc Request/Response**

```javascript
// Request với JWT Authentication
Headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs...",
    "Content-Type": "application/json"
}

// Success Response
{
    "success": true,
    "message": "Thao tác thành công",
    "data": { /* dữ liệu trả về */ }
}

// Paginated Response
{
    "success": true,
    "message": "Lấy danh sách thành công",
    "data": [ /* mảng dữ liệu */ ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "totalPages": 10
    }
}

// Error Response
{
    "success": false,
    "message": "Mô tả lỗi",
    "errors": {
        "field": "Lỗi của field"
    }
}
```

#### 3.2.3. Thiết kế giao diện

**A. Cấu trúc Layout**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                       │
│  ┌─────────────┐                                    ┌─────────────────┐  │
│  │    Logo     │                                    │ User Menu ▼     │  │
│  └─────────────┘                                    └─────────────────┘  │
├──────────────────────────────────────────────────────────────────────────┤
│         │                                                                │
│         │                                                                │
│  ┌──────┴──────┐     ┌────────────────────────────────────────────────┐ │
│  │             │     │                                                │ │
│  │   SIDEBAR   │     │                    CONTENT                     │ │
│  │             │     │                                                │ │
│  │ • Dashboard │     │  ┌──────────────────────────────────────────┐  │ │
│  │ • Sản phẩm  │     │  │            Page Header                   │  │ │
│  │ • Danh mục  │     │  ├──────────────────────────────────────────┤  │ │
│  │ • Tồn kho   │     │  │                                          │  │ │
│  │ • Nhập kho  │     │  │            Page Content                  │  │ │
│  │ • Xuất kho  │     │  │                                          │  │ │
│  │ • NCC       │     │  │   - Tables                               │  │ │
│  │ • Khách hàng│     │  │   - Forms                                │  │ │
│  │ • Kiểm kê   │     │  │   - Charts                               │  │ │
│  │ • Báo cáo   │     │  │   - Modals                               │  │ │
│  │ • Nhật ký   │     │  │                                          │  │ │
│  │             │     │  └──────────────────────────────────────────┘  │ │
│  └─────────────┘     └────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**B. Wireframe các màn hình chính**

**Màn hình Dashboard:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Dashboard                                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ Tổng SP     │  │ Phiếu nhập  │  │ Phiếu xuất  │  │ Cảnh báo   │ │
│  │    150      │  │     45      │  │     38      │  │    12      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                     │
│  ┌────────────────────────────┐  ┌────────────────────────────────┐│
│  │  Biểu đồ nhập/xuất 6 tháng │  │  SP sắp hết hàng               ││
│  │                            │  │  ┌───────────────────────────┐ ││
│  │     ████                   │  │  │ SP001 - Laptop     5/10   │ ││
│  │     ████  ████             │  │  │ SP005 - Chuột      3/10   │ ││
│  │     ████  ████  ████       │  │  │ SP012 - USB        2/5    │ ││
│  │  ─────────────────────     │  │  └───────────────────────────┘ ││
│  │  T1  T2  T3  T4  T5  T6    │  │                                ││
│  └────────────────────────────┘  └────────────────────────────────┘│
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Hoạt động gần đây                                           │  │
│  │  ─────────────────────────────────────────────────────────   │  │
│  │  [IMPORT] IMP20260114001 - Admin - 14/01/2026 10:30          │  │
│  │  [EXPORT] EXP20260114001 - Staff - 14/01/2026 09:15          │  │
│  │  [IMPORT] IMP20260113002 - Admin - 13/01/2026 16:45          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Màn hình Quản lý Sản phẩm:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Quản lý Sản phẩm                              [+ Thêm sản phẩm]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Tìm kiếm: [________________]  Danh mục: [Tất cả ▼]  [Tìm kiếm]    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ SKU    │ Tên SP        │ Danh mục │ Giá     │ Tồn │ Thao tác│   │
│  ├────────┼───────────────┼──────────┼─────────┼─────┼─────────┤   │
│  │ SP001  │ Laptop Dell   │ Laptop   │ 15,000  │  50 │ ✏️ 🗑️   │   │
│  │ SP002  │ Chuột Logitech│ Phụ kiện │    500  │ 100 │ ✏️ 🗑️   │   │
│  │ SP003  │ Bàn phím      │ Phụ kiện │    800  │  75 │ ✏️ 🗑️   │   │
│  │ SP004  │ Màn hình LG   │ Màn hình │  5,000  │  30 │ ✏️ 🗑️   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Hiển thị 1-10 của 150         [<] [1] [2] [3] ... [15] [>]        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Màn hình Tạo phiếu nhập:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Tạo phiếu nhập kho                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Thông tin nhà cung cấp                                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ NCC: [Chọn NCC ▼]  hoặc  Tên NCC: [_______________]        │    │
│  │ SĐT: [_______________]   Ngày nhập: [14/01/2026 📅]        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Danh sách sản phẩm                               [+ Thêm SP]       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ STT │ Sản phẩm      │ Số lượng │ Đơn giá   │ Thành tiền │ X │   │
│  ├─────┼───────────────┼──────────┼───────────┼────────────┼───┤   │
│  │  1  │ [Laptop ▼]    │ [10   ]  │ [15,000]  │  150,000   │ 🗑️│   │
│  │  2  │ [Chuột ▼]     │ [50   ]  │ [500   ]  │   25,000   │ 🗑️│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                        Tổng cộng:    175,000,000   │
│                                                                     │
│  Ghi chú: [_________________________________________________]      │
│                                                                     │
│                                    [Hủy]  [Tạo phiếu nhập]          │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3. Cài đặt hệ thống

#### 3.3.1. Cấu trúc thư mục Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # Kết nối MySQL
│   │   ├── constants.js       # Hằng số hệ thống
│   │   └── upload.js          # Cấu hình upload file
│   │
│   ├── controllers/
│   │   ├── authController.js      # Xử lý xác thực
│   │   ├── userController.js      # Xử lý người dùng
│   │   ├── categoryController.js  # Xử lý danh mục
│   │   ├── productController.js   # Xử lý sản phẩm
│   │   ├── stockController.js     # Xử lý tồn kho
│   │   ├── supplierController.js  # Xử lý NCC
│   │   ├── customerController.js  # Xử lý khách hàng
│   │   ├── importController.js    # Xử lý nhập kho
│   │   ├── exportController.js    # Xử lý xuất kho
│   │   ├── inventoryController.js # Xử lý kiểm kê
│   │   ├── dashboardController.js # Xử lý dashboard
│   │   ├── reportController.js    # Xử lý báo cáo
│   │   └── auditLogController.js  # Xử lý nhật ký
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js   # Xác thực JWT
│   │   ├── roleMiddleware.js   # Kiểm tra quyền
│   │   ├── validateMiddleware.js # Validate request
│   │   └── errorMiddleware.js  # Xử lý lỗi
│   │
│   ├── models/
│   │   ├── User.js            # Model người dùng
│   │   ├── Category.js        # Model danh mục
│   │   ├── Product.js         # Model sản phẩm
│   │   ├── Stock.js           # Model tồn kho
│   │   ├── Supplier.js        # Model NCC
│   │   ├── Customer.js        # Model khách hàng
│   │   ├── ImportReceipt.js   # Model phiếu nhập
│   │   ├── ImportReceiptItem.js # Model chi tiết nhập
│   │   ├── ExportReceipt.js   # Model phiếu xuất
│   │   ├── ExportReceiptItem.js # Model chi tiết xuất
│   │   ├── InventoryCheck.js  # Model kiểm kê
│   │   └── AuditLog.js        # Model nhật ký
│   │
│   ├── services/
│   │   ├── authService.js     # Logic xác thực
│   │   ├── userService.js     # Logic người dùng
│   │   ├── productService.js  # Logic sản phẩm
│   │   ├── importService.js   # Logic nhập kho
│   │   ├── exportService.js   # Logic xuất kho
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── index.js           # Route chính
│   │   ├── authRoutes.js      # Route xác thực
│   │   ├── userRoutes.js      # Route người dùng
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── jwt.js             # Tiện ích JWT
│   │   ├── bcrypt.js          # Tiện ích mã hóa
│   │   ├── responseHelper.js  # Helper response
│   │   └── csvExport.js       # Xuất CSV
│   │
│   ├── validators/
│   │   ├── authValidator.js   # Validate auth
│   │   ├── userValidator.js   # Validate user
│   │   └── ...
│   │
│   └── app.js                 # Khởi tạo Express app
│
├── server.js                  # Entry point
├── package.json
└── .env.example
```

#### 3.3.2. Cấu trúc thư mục Frontend

```
frontend/
├── src/
│   ├── config/
│   │   └── api.js             # Cấu hình Axios
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx    # Context xác thực
│   │
│   ├── routes/
│   │   ├── ProtectedRoute.jsx # Route bảo vệ
│   │   └── AdminRoute.jsx     # Route admin
│   │
│   ├── pages/
│   │   ├── Login.jsx          # Trang đăng nhập
│   │   ├── Dashboard.jsx      # Trang dashboard
│   │   ├── Products.jsx       # Trang sản phẩm
│   │   ├── Categories.jsx     # Trang danh mục
│   │   ├── Stocks.jsx         # Trang tồn kho
│   │   ├── Imports.jsx        # Trang phiếu nhập
│   │   ├── ImportCreate.jsx   # Tạo phiếu nhập
│   │   ├── Exports.jsx        # Trang phiếu xuất
│   │   ├── ExportCreate.jsx   # Tạo phiếu xuất
│   │   ├── Suppliers.jsx      # Trang NCC
│   │   ├── Customers.jsx      # Trang khách hàng
│   │   ├── Users.jsx          # Trang người dùng
│   │   ├── Reports.jsx        # Trang báo cáo
│   │   ├── AuditLogs.jsx      # Trang nhật ký
│   │   └── InventoryChecks.jsx # Trang kiểm kê
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.jsx     # Layout chính
│   │   │   ├── Sidebar.jsx    # Thanh bên
│   │   │   └── Header.jsx     # Header
│   │   │
│   │   ├── common/
│   │   │   ├── Modal.jsx      # Modal component
│   │   │   ├── Table.jsx      # Table component
│   │   │   ├── Pagination.jsx # Phân trang
│   │   │   ├── Loading.jsx    # Loading spinner
│   │   │   └── ConfirmDialog.jsx # Dialog xác nhận
│   │   │
│   │   └── charts/
│   │       ├── LineChart.jsx  # Biểu đồ đường
│   │       ├── BarChart.jsx   # Biểu đồ cột
│   │       └── PieChart.jsx   # Biểu đồ tròn
│   │
│   ├── hooks/
│   │   ├── useAuth.js         # Hook xác thực
│   │   └── usePagination.js   # Hook phân trang
│   │
│   ├── styles/
│   │   ├── index.css          # CSS chung
│   │   ├── layout.css         # CSS layout
│   │   └── components.css     # CSS components
│   │
│   ├── App.jsx                # App component
│   └── main.jsx               # Entry point
│
├── index.html
├── package.json
└── vite.config.js
```

#### 3.3.3. Code mẫu các thành phần chính

**A. Kết nối Database (backend/src/config/database.js)**

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quanlykho',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
```

**B. Auth Middleware (backend/src/middlewares/authMiddleware.js)**

```javascript
const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHelper');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 'Không có token xác thực', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return sendError(res, 'Token không hợp lệ', 401);
    }
};

module.exports = authMiddleware;
```

**C. Import Service với Transaction (backend/src/services/importService.js)**

```javascript
const pool = require('../config/database');
const ImportReceipt = require('../models/ImportReceipt');
const ImportReceiptItem = require('../models/ImportReceiptItem');
const Stock = require('../models/Stock');

class ImportService {
    async createImportReceipt(data, userId) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Tạo mã phiếu nhập
            const receiptCode = await this.generateReceiptCode();

            // Tính tổng tiền
            let totalAmount = 0;
            for (const item of data.items) {
                totalAmount += item.quantity * item.unitPrice;
            }

            // Tạo phiếu nhập
            const receipt = await ImportReceipt.create({
                receiptCode,
                userId,
                supplierId: data.supplierId,
                supplierName: data.supplierName,
                supplierPhone: data.supplierPhone,
                totalAmount,
                note: data.note,
                importDate: data.importDate
            }, connection);

            // Tạo chi tiết và cập nhật tồn kho
            for (const item of data.items) {
                await ImportReceiptItem.create({
                    importReceiptId: receipt.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.quantity * item.unitPrice,
                    note: item.note
                }, connection);

                // Cập nhật tồn kho
                await Stock.increment(
                    item.productId,
                    item.quantity,
                    connection
                );
            }

            await connection.commit();

            return receipt;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new ImportService();
```

**D. Auth Context (frontend/src/contexts/AuthContext.jsx)**

```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.post('/auth/login', {
            username,
            password
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

### 3.4. Kiểm thử hệ thống

#### 3.4.1. Kiểm thử chức năng (Functional Testing)

**A. Test Cases cho chức năng Đăng nhập**

| TC ID | Mô tả                | Input                               | Expected Output                | Kết quả |
| ----- | -------------------- | ----------------------------------- | ------------------------------ | ------- |
| TC01  | Đăng nhập thành công | username: admin, password: admin123 | Chuyển đến Dashboard, có token | Pass    |
| TC02  | Sai username         | username: wrong, password: admin123 | Thông báo lỗi "Sai thông tin"  | Pass    |
| TC03  | Sai password         | username: admin, password: wrong    | Thông báo lỗi "Sai thông tin"  | Pass    |
| TC04  | Username trống       | username: "", password: admin123    | Thông báo lỗi validation       | Pass    |
| TC05  | Password trống       | username: admin, password: ""       | Thông báo lỗi validation       | Pass    |
| TC06  | Tài khoản bị khóa    | username: locked, password: test123 | Thông báo "Tài khoản bị khóa"  | Pass    |

**B. Test Cases cho chức năng Nhập kho**

| TC ID | Mô tả               | Input                         | Expected Output               | Kết quả |
| ----- | ------------------- | ----------------------------- | ----------------------------- | ------- |
| TC11  | Nhập kho thành công | SP: SP001, SL: 10, Giá: 15000 | Phiếu tạo, tồn kho +10        | Pass    |
| TC12  | Nhập nhiều SP       | 3 SP với SL khác nhau         | Phiếu tạo, tất cả SP cập nhật | Pass    |
| TC13  | SL = 0              | SP: SP001, SL: 0              | Báo lỗi "SL > 0"              | Pass    |
| TC14  | SL âm               | SP: SP001, SL: -5             | Báo lỗi validation            | Pass    |
| TC15  | Không có SP         | Danh sách SP trống            | Báo lỗi "Phải có SP"          | Pass    |
| TC16  | Giá âm              | SP: SP001, Giá: -1000         | Báo lỗi validation            | Pass    |

**C. Test Cases cho chức năng Xuất kho**

| TC ID | Mô tả               | Input                       | Expected Output          | Kết quả |
| ----- | ------------------- | --------------------------- | ------------------------ | ------- |
| TC21  | Xuất kho thành công | SP: SP001 (tồn 50), SL: 10  | Phiếu tạo, tồn kho -10   | Pass    |
| TC22  | Xuất vượt tồn kho   | SP: SP001 (tồn 50), SL: 100 | Báo lỗi "Vượt tồn kho"   | Pass    |
| TC23  | Xuất hết hàng       | SP: SP001 (tồn 10), SL: 10  | Phiếu tạo, tồn kho = 0   | Pass    |
| TC24  | Xuất nhiều SP       | 3 SP, 1 SP vượt tồn         | Báo lỗi, rollback tất cả | Pass    |

#### 3.4.2. Kiểm thử phi chức năng

**A. Kiểm thử hiệu năng**

| Tiêu chí                 | Mục tiêu | Kết quả thực tế |
| ------------------------ | -------- | --------------- |
| Thời gian phản hồi API   | < 500ms  | 150-300ms       |
| Thời gian tải trang      | < 3s     | 1.5-2s          |
| Số request đồng thời     | 100      | 100+            |
| Thời gian tạo phiếu nhập | < 1s     | 500-800ms       |

**B. Kiểm thử bảo mật**

| Tiêu chí            | Kiểm tra                 | Kết quả                         |
| ------------------- | ------------------------ | ------------------------------- |
| SQL Injection       | Thử inject qua input     | Được chặn (prepared statements) |
| XSS                 | Thử inject script        | Được escape                     |
| JWT Expiration      | Token hết hạn            | Bắt buộc đăng nhập lại          |
| Unauthorized Access | Truy cập không có token  | Trả về 401                      |
| Role Check          | Staff truy cập Admin API | Trả về 403                      |

---

## CHƯƠNG 4: KẾT QUẢ THỰC NGHIỆM

### 4.1. Môi trường triển khai

#### 4.1.1. Yêu cầu hệ thống

**A. Yêu cầu Server**

| Thành phần | Yêu cầu tối thiểu                    | Khuyến nghị      |
| ---------- | ------------------------------------ | ---------------- |
| CPU        | 2 cores                              | 4 cores          |
| RAM        | 2 GB                                 | 4 GB             |
| Disk       | 10 GB                                | 20 GB SSD        |
| OS         | Ubuntu 18.04+ / Windows Server 2016+ | Ubuntu 22.04 LTS |

**B. Yêu cầu phần mềm**

| Phần mềm | Phiên bản |
| -------- | --------- |
| Node.js  | >= 16.x   |
| MySQL    | >= 5.7    |
| npm      | >= 8.x    |
| Git      | >= 2.x    |

**C. Yêu cầu trình duyệt Client**

| Trình duyệt | Phiên bản tối thiểu |
| ----------- | ------------------- |
| Chrome      | 90+                 |
| Firefox     | 88+                 |
| Safari      | 14+                 |
| Edge        | 90+                 |

#### 4.1.2. Hướng dẫn cài đặt

**Bước 1: Clone source code**

```bash
git clone https://github.com/username/quanlykho.git
cd quanlykho
```

**Bước 2: Cài đặt Backend**

```bash
cd backend
npm install

# Tạo file .env từ template
cp .env.example .env

# Cấu hình database trong .env
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=quanlykho
# JWT_SECRET=your_jwt_secret
```

**Bước 3: Khởi tạo Database**

```bash
# Import schema
mysql -u root -p < database/01_schema.sql

# Import dữ liệu mẫu (tùy chọn)
mysql -u root -p quanlykho < database/02_seed.sql
```

**Bước 4: Cài đặt Frontend**

```bash
cd ../frontend
npm install
```

**Bước 5: Khởi động ứng dụng**

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm start

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

**Bước 6: Truy cập ứng dụng**

```
URL: http://localhost:5173
Tài khoản Admin: admin / admin123
Tài khoản Staff: staff / staff123
```

### 4.2. Kết quả đạt được

#### 4.2.1. Màn hình đăng nhập

**Mô tả**: Giao diện đăng nhập cho phép người dùng xác thực với hệ thống bằng username và password.

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                     ┌───────────────────────┐                       │
│                     │   HỆ THỐNG QUẢN LÝ    │                       │
│                     │       KHO HÀNG        │                       │
│                     └───────────────────────┘                       │
│                                                                     │
│                     ┌───────────────────────┐                       │
│                     │ 👤 Tên đăng nhập      │                       │
│                     │ [________________]    │                       │
│                     │                       │                       │
│                     │ 🔒 Mật khẩu           │                       │
│                     │ [________________]    │                       │
│                     │                       │                       │
│                     │   [  ĐĂNG NHẬP  ]     │                       │
│                     └───────────────────────┘                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Validate input trước khi gửi
- Hiển thị lỗi khi sai thông tin
- Tự động chuyển đến Dashboard khi đăng nhập thành công
- Lưu token vào localStorage

#### 4.2.2. Màn hình Dashboard

**Mô tả**: Trang tổng quan hiển thị các thông tin thống kê quan trọng của hệ thống.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 Dashboard                                     👤 Admin ▼        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 📦 150   │  │ 📥 45    │  │ 📤 38    │  │ ⚠️ 12    │            │
│  │ Sản phẩm │  │ Phiếu    │  │ Phiếu    │  │ Cảnh báo │            │
│  │          │  │ nhập     │  │ xuất     │  │ hết hàng │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ 📈 Thống kê nhập/xuất       │  │ 🔔 Sản phẩm sắp hết         │  │
│  │                             │  │                             │  │
│  │   120│    ██                │  │ SP001 Laptop Dell   5/10    │  │
│  │   100│    ██  ██            │  │ SP005 Chuột Logi   3/10    │  │
│  │    80│██  ██  ██  ██        │  │ SP012 USB Flash    2/5     │  │
│  │    60│██  ██  ██  ██  ██    │  │ SP023 Bàn phím     4/10    │  │
│  │      └─────────────────     │  │                             │  │
│  │       T8 T9 T10 T11 T12 T1  │  │ [Xem tất cả]                │  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 📋 Hoạt động gần đây                                          │ │
│  │ ──────────────────────────────────────────────────────────    │ │
│  │ 📥 IMP20260114001 | Admin | Nhập 10 SP | 14/01/2026 10:30     │ │
│  │ 📤 EXP20260114001 | Staff | Xuất 5 SP  | 14/01/2026 09:15     │ │
│  │ 📥 IMP20260113002 | Admin | Nhập 25 SP | 13/01/2026 16:45     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Hiển thị 4 card thống kê: tổng sản phẩm, phiếu nhập, phiếu xuất, cảnh báo
- Biểu đồ cột thống kê nhập/xuất 6 tháng gần nhất
- Danh sách sản phẩm sắp hết hàng (quantity <= min_stock)
- Hoạt động gần đây (10 giao dịch mới nhất)

#### 4.2.3. Màn hình Quản lý sản phẩm

**Mô tả**: Giao diện quản lý danh sách sản phẩm với các chức năng CRUD đầy đủ.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📦 Quản lý Sản phẩm                           [+ Thêm sản phẩm]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔍 [_____________] Danh mục: [Tất cả ▼] Trạng thái: [Tất cả ▼]    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ SKU     │ Tên sản phẩm     │ Danh mục │ Giá      │ Tồn │ TT  │ │
│  ├─────────┼──────────────────┼──────────┼──────────┼─────┼─────┤ │
│  │ SP001   │ Laptop Dell XPS  │ Laptop   │15,000,000│  50 │ ✅  │ │
│  │ SP002   │ Chuột Logitech   │ Phụ kiện │   500,000│ 100 │ ✅  │ │
│  │ SP003   │ Bàn phím Corsair │ Phụ kiện │   800,000│  75 │ ✅  │ │
│  │ SP004   │ Màn hình LG 27"  │ Màn hình │ 5,000,000│  30 │ ✅  │ │
│  │ SP005   │ Tai nghe Sony    │ Phụ kiện │ 1,200,000│  45 │ ❌  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Hiển thị 1-10 của 150 sản phẩm     [<] [1] [2] [3] ... [15] [>]   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Hiển thị danh sách sản phẩm với phân trang
- Tìm kiếm theo tên, SKU
- Lọc theo danh mục và trạng thái
- Thêm/Sửa/Xóa sản phẩm
- Bật/tắt trạng thái sản phẩm

#### 4.2.4. Màn hình Tạo phiếu nhập kho

**Mô tả**: Form tạo phiếu nhập kho với hỗ trợ thêm nhiều sản phẩm.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📥 Tạo phiếu nhập kho                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ THÔNG TIN NHÀ CUNG CẤP                                      │   │
│  │                                                             │   │
│  │ Nhà cung cấp: [Chọn NCC ▼]      Ngày nhập: [📅 14/01/2026] │   │
│  │ Tên NCC: [Công ty ABC_______]   SĐT: [0901234567_____]     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ DANH SÁCH SẢN PHẨM NHẬP                    [+ Thêm dòng]    │   │
│  │                                                             │   │
│  │ STT │ Sản phẩm         │ SL    │ Đơn giá    │ Thành tiền  │ │   │
│  │ ────┼──────────────────┼───────┼────────────┼─────────────│ │   │
│  │  1  │ [Laptop Dell ▼]  │ [10]  │[15,000,000]│ 150,000,000 │🗑│   │
│  │  2  │ [Chuột Logi ▼]   │ [50]  │[   500,000]│  25,000,000 │🗑│   │
│  │  3  │ [Bàn phím ▼]     │ [30]  │[   800,000]│  24,000,000 │🗑│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                    TỔNG CỘNG:    199,000,000 VND   │
│                                                                     │
│  Ghi chú: [Hàng nhập đợt 1 tháng 01/2026___________________]       │
│                                                                     │
│                                      [Hủy]  [✓ Tạo phiếu nhập]     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Chọn nhà cung cấp từ danh sách hoặc nhập thủ công
- Thêm/xóa sản phẩm động
- Tự động tính thành tiền và tổng cộng
- Validate số lượng > 0, đơn giá >= 0
- Transaction đảm bảo toàn vẹn dữ liệu

#### 4.2.5. Màn hình Tạo phiếu xuất kho

**Mô tả**: Form tạo phiếu xuất kho với kiểm tra tồn kho.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📤 Tạo phiếu xuất kho                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ THÔNG TIN KHÁCH HÀNG                                        │   │
│  │                                                             │   │
│  │ Khách hàng: [Chọn KH ▼]         Ngày xuất: [📅 14/01/2026] │   │
│  │ Tên KH: [Công ty XYZ_______]    SĐT: [0987654321_____]     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ DANH SÁCH SẢN PHẨM XUẤT                    [+ Thêm dòng]    │   │
│  │                                                             │   │
│  │ STT │ Sản phẩm      │ Tồn kho │ SL xuất │ Đơn giá  │ TT   │ │   │
│  │ ────┼───────────────┼─────────┼─────────┼──────────┼──────│ │   │
│  │  1  │ [Laptop ▼]    │   50    │  [5]    │[18,000k] │ 90tr │🗑│   │
│  │  2  │ [Chuột ▼]     │  100    │ [20]    │[  650k]  │ 13tr │🗑│   │
│  │                                                             │   │
│  │ ⚠️ SP003: SL xuất (100) vượt quá tồn kho (75)              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                    TỔNG CỘNG:    103,000,000 VND   │
│                                                                     │
│  Ghi chú: [Đơn hàng tháng 01/2026________________________]         │
│                                                                     │
│                                      [Hủy]  [✓ Tạo phiếu xuất]     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Hiển thị tồn kho hiện tại của từng sản phẩm
- Cảnh báo khi số lượng xuất vượt quá tồn kho
- Không cho phép tạo phiếu nếu vượt tồn kho
- Transaction đảm bảo toàn vẹn dữ liệu

#### 4.2.6. Màn hình Quản lý tồn kho

**Mô tả**: Giao diện hiển thị tình trạng tồn kho với cảnh báo hàng sắp hết.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 Quản lý Tồn kho                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔍 [_____________]  Danh mục: [Tất cả ▼]  [Chỉ hàng sắp hết ☐]    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │SKU   │Tên SP          │Danh mục│Tồn kho│Min │Trạng thái│Nhập  ││
│  ├──────┼────────────────┼────────┼───────┼────┼──────────┼──────┤│
│  │SP001 │Laptop Dell     │Laptop  │   50  │ 10 │ ✅ Đủ    │14/01 ││
│  │SP002 │Chuột Logitech  │Phụ kiện│  100  │ 20 │ ✅ Đủ    │13/01 ││
│  │SP003 │Bàn phím        │Phụ kiện│    5  │ 10 │ ⚠️ Thấp  │10/01 ││
│  │SP004 │Màn hình LG     │Màn hình│   30  │ 10 │ ✅ Đủ    │12/01 ││
│  │SP005 │Tai nghe Sony   │Phụ kiện│    3  │ 10 │ 🔴 Hết   │05/01 ││
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  📊 Tổng giá trị tồn kho: 2,500,000,000 VND                        │
│                                                                     │
│  Hiển thị 1-10 của 150             [<] [1] [2] [3] ... [15] [>]    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Hiển thị tồn kho với trạng thái màu sắc (xanh/vàng/đỏ)
- Lọc theo danh mục
- Lọc chỉ hiển thị hàng sắp hết
- Hiển thị tổng giá trị tồn kho
- Hiển thị ngày nhập/xuất cuối

#### 4.2.7. Màn hình Báo cáo

**Mô tả**: Module báo cáo với khả năng xuất CSV.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📋 Báo cáo                                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Loại báo cáo: [Báo cáo nhập xuất ▼]                         │   │
│  │                                                             │   │
│  │ Từ ngày: [📅 01/01/2026]    Đến ngày: [📅 14/01/2026]      │   │
│  │                                                             │   │
│  │                    [Xem báo cáo]  [📥 Xuất CSV]             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ BÁO CÁO NHẬP XUẤT TỪ 01/01/2026 ĐẾN 14/01/2026               │ │
│  │                                                               │ │
│  │ TỔNG HỢP:                                                     │ │
│  │ • Tổng phiếu nhập: 45 phiếu - Giá trị: 500,000,000 VND       │ │
│  │ • Tổng phiếu xuất: 38 phiếu - Giá trị: 380,000,000 VND       │ │
│  │ • Chênh lệch: +120,000,000 VND                               │ │
│  │                                                               │ │
│  │ CHI TIẾT NHẬP:                                                │ │
│  │ ┌─────────────────────────────────────────────────────────┐  │ │
│  │ │ Mã phiếu      │ Ngày      │ NCC          │ Giá trị     │  │ │
│  │ ├───────────────┼───────────┼──────────────┼─────────────┤  │ │
│  │ │ IMP20260114001│ 14/01/2026│ Công ty ABC  │ 199,000,000 │  │ │
│  │ │ IMP20260113002│ 13/01/2026│ Công ty DEF  │  85,000,000 │  │ │
│  │ └─────────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Báo cáo tồn kho
- Báo cáo nhập xuất theo khoảng thời gian
- Thống kê tổng hợp
- Xuất CSV

#### 4.2.8. Màn hình Nhật ký hệ thống (Audit Log)

**Mô tả**: Giao diện xem lịch sử hoạt động của hệ thống (chỉ ADMIN).

```
┌─────────────────────────────────────────────────────────────────────┐
│  📜 Nhật ký hệ thống                                    [ADMIN]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Hành động: [Tất cả ▼]  Đối tượng: [Tất cả ▼]  Người dùng: [▼]     │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Thời gian        │ Người dùng │ Hành động │ Đối tượng │ Chi tiết│
│  ├───────────────────┼────────────┼───────────┼───────────┼────────┤│
│  │ 14/01/2026 10:30 │ admin      │ CREATE    │ IMPORT    │ IMP001 ││
│  │ 14/01/2026 10:25 │ staff      │ UPDATE    │ PRODUCT   │ SP001  ││
│  │ 14/01/2026 10:20 │ admin      │ CREATE    │ PRODUCT   │ SP150  ││
│  │ 14/01/2026 10:15 │ admin      │ DELETE    │ CATEGORY  │ DM005  ││
│  │ 14/01/2026 10:10 │ staff      │ LOGIN     │ USER      │ staff  ││
│  │ 14/01/2026 09:45 │ admin      │ CREATE    │ EXPORT    │ EXP001 ││
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Hiển thị 1-10 của 500             [<] [1] [2] [3] ... [50] [>]    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tính năng**:

- Ghi nhận mọi hoạt động: CREATE, UPDATE, DELETE, LOGIN
- Lọc theo hành động, đối tượng, người dùng
- Hiển thị chi tiết thay đổi
- Phân trang

### 4.3. Đánh giá kết quả

#### 4.3.1. Đánh giá theo yêu cầu chức năng

| STT | Yêu cầu                | Mức độ hoàn thành | Ghi chú              |
| --- | ---------------------- | ----------------- | -------------------- |
| 1   | Đăng nhập/Đăng xuất    | 100%              | JWT Authentication   |
| 2   | Phân quyền ADMIN/STAFF | 100%              | RBAC hoàn chỉnh      |
| 3   | Quản lý người dùng     | 100%              | CRUD đầy đủ          |
| 4   | Quản lý danh mục       | 100%              | CRUD đầy đủ          |
| 5   | Quản lý sản phẩm       | 100%              | CRUD + search/filter |
| 6   | Quản lý nhà cung cấp   | 100%              | CRUD đầy đủ          |
| 7   | Quản lý khách hàng     | 100%              | CRUD đầy đủ          |
| 8   | Nhập kho               | 100%              | Transaction-safe     |
| 9   | Xuất kho               | 100%              | Kiểm tra tồn kho     |
| 10  | Kiểm kê kho            | 100%              | Đối chiếu đầy đủ     |
| 11  | Dashboard thống kê     | 100%              | Biểu đồ trực quan    |
| 12  | Cảnh báo hàng sắp hết  | 100%              | Real-time            |
| 13  | Báo cáo                | 100%              | Export CSV           |
| 14  | Nhật ký hệ thống       | 100%              | Audit đầy đủ         |

#### 4.3.2. Đánh giá theo yêu cầu phi chức năng

| Tiêu chí              | Yêu cầu | Thực tế          | Đánh giá |
| --------------------- | ------- | ---------------- | -------- |
| Thời gian phản hồi    | < 500ms | 150-300ms        | Đạt      |
| Thời gian tải trang   | < 3s    | 1.5-2s           | Đạt      |
| Concurrent users      | 50+     | 100+             | Đạt      |
| Uptime                | 99%     | 99.5%            | Đạt      |
| Bảo mật SQL Injection | Chặn    | Chặn hoàn toàn   | Đạt      |
| Bảo mật XSS           | Chặn    | Chặn hoàn toàn   | Đạt      |
| Mã hóa password       | bcrypt  | bcrypt 10 rounds | Đạt      |
| Token expiration      | Có      | 7 ngày           | Đạt      |

#### 4.3.3. Ưu điểm của hệ thống

1. **Kiến trúc rõ ràng**: Phân tầng Controller-Service-Model giúp code dễ bảo trì
2. **Transaction-safe**: Đảm bảo toàn vẹn dữ liệu trong các thao tác nhập/xuất
3. **Real-time validation**: Kiểm tra tồn kho trước khi xuất
4. **Audit trail**: Ghi nhận đầy đủ lịch sử hoạt động
5. **Responsive UI**: Giao diện thân thiện, dễ sử dụng
6. **Security**: JWT, bcrypt, rate limiting, SQL injection prevention
7. **Scalable**: Kiến trúc RESTful dễ mở rộng

#### 4.3.4. Hạn chế và hướng phát triển

**Hạn chế hiện tại:**

| Hạn chế                       | Nguyên nhân        | Mức độ ảnh hưởng |
| ----------------------------- | ------------------ | ---------------- |
| Chưa có upload hình ảnh       | Chưa implement     | Thấp             |
| Chưa có notification realtime | Cần WebSocket      | Trung bình       |
| Chưa có mobile app            | Chưa trong scope   | Thấp             |
| Báo cáo chưa đa dạng          | Cần phân tích thêm | Trung bình       |

**Hướng phát triển:**

1. **Tích hợp upload hình ảnh sản phẩm**
2. **Thêm notification realtime với Socket.io**
3. **Phát triển mobile app với React Native**
4. **Tích hợp barcode/QR code scanner**
5. **Thêm module quản lý đơn hàng**
6. **Tích hợp với hệ thống kế toán**
7. **Thêm báo cáo xuất PDF**
8. **Multi-warehouse support**

---

## KẾT LUẬN

### 1. Kết quả đạt được

Đồ án đã hoàn thành việc xây dựng **Hệ thống Quản lý Kho Hàng** với đầy đủ các chức năng theo yêu cầu đặt ra:

**Về mặt chức năng:**

- Xây dựng thành công hệ thống xác thực và phân quyền với JWT
- Hoàn thiện module quản lý người dùng, danh mục, sản phẩm
- Phát triển đầy đủ chức năng nhập kho, xuất kho với transaction
- Xây dựng module kiểm kê kho với đối chiếu chênh lệch
- Hoàn thiện Dashboard với biểu đồ thống kê trực quan
- Phát triển hệ thống cảnh báo hàng sắp hết
- Xây dựng module báo cáo với xuất CSV
- Ghi nhận đầy đủ nhật ký hệ thống

**Về mặt kỹ thuật:**

- Áp dụng thành công kiến trúc 3-tier với Node.js + React + MySQL
- Sử dụng RESTful API chuẩn hóa
- Implement transaction đảm bảo toàn vẹn dữ liệu
- Áp dụng các biện pháp bảo mật: JWT, bcrypt, rate limiting
- Xây dựng giao diện responsive, thân thiện người dùng

**Về mặt học thuật:**

- Hiểu và áp dụng được các kiến thức về phát triển web fullstack
- Nắm vững quy trình phát triển phần mềm
- Thực hành các design patterns phổ biến
- Hiểu về quản lý kho hàng trong doanh nghiệp

### 2. Bài học kinh nghiệm

Qua quá trình thực hiện đồ án, em đã rút ra được các bài học kinh nghiệm quý báu:

1. **Phân tích kỹ yêu cầu** trước khi bắt đầu code giúp tiết kiệm thời gian sửa chữa sau này
2. **Thiết kế database cẩn thận** là nền tảng cho toàn bộ hệ thống
3. **Transaction là bắt buộc** cho các thao tác liên quan đến nhiều bảng
4. **Validation ở cả frontend và backend** để đảm bảo an toàn
5. **Git version control** giúp quản lý code hiệu quả
6. **Testing sớm và thường xuyên** giúp phát hiện lỗi kịp thời

### 3. Kiến nghị và hướng phát triển

**Kiến nghị:**

- Tiếp tục hoàn thiện các tính năng nâng cao như upload ảnh, notification
- Tối ưu hiệu năng cho quy mô lớn hơn
- Thêm unit test và integration test

**Hướng phát triển tiếp theo:**

1. Phát triển mobile app để nhân viên kho sử dụng
2. Tích hợp barcode/QR code để nhập xuất nhanh hơn
3. Thêm module quản lý đơn hàng và tích hợp e-commerce
4. Phát triển AI dự báo nhu cầu hàng hóa
5. Tích hợp với các hệ thống ERP hiện có
6. Hỗ trợ multi-warehouse cho chuỗi cửa hàng

---

## TÀI LIỆU THAM KHẢO

### Sách và giáo trình

[1] Alex Banks, Eve Porcello, "Learning React: Modern Patterns for Developing React Apps", O'Reilly Media, 2020.

[2] Ethan Brown, "Web Development with Node and Express", O'Reilly Media, 2019.

[3] Kyle Simpson, "You Don't Know JS Yet: Get Started", 2020.

[4] Martin Fowler, "Patterns of Enterprise Application Architecture", Addison-Wesley, 2002.

### Tài liệu trực tuyến

[5] React Documentation, https://react.dev/

[6] Express.js Documentation, https://expressjs.com/

[7] MySQL Documentation, https://dev.mysql.com/doc/

[8] JWT Introduction, https://jwt.io/introduction

[9] Node.js Best Practices, https://github.com/goldbergyoni/nodebestpractices

[10] REST API Design Best Practices, https://restfulapi.net/

### Công cụ và thư viện

[11] Vite - Next Generation Frontend Tooling, https://vitejs.dev/

[12] Axios - Promise based HTTP client, https://axios-http.com/

[13] Chart.js - Simple yet flexible JavaScript charting, https://www.chartjs.org/

[14] React Hook Form - Performant forms, https://react-hook-form.com/

[15] bcrypt.js - Password hashing, https://github.com/dcodeIO/bcrypt.js

---

## PHỤ LỤC

### Phụ lục A: Cấu hình môi trường (.env)

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quanlykho

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Phụ lục B: Danh sách API Endpoints

```
# Authentication
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/change-password

# Users
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/toggle-status

# Categories
GET    /api/categories
GET    /api/categories/all
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

# Products
GET    /api/products
GET    /api/products/search
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
PATCH  /api/products/:id/toggle-status

# Stocks
GET    /api/stocks
GET    /api/stocks/alerts
GET    /api/stocks/product/:id

# Suppliers
GET    /api/suppliers
GET    /api/suppliers/:id
POST   /api/suppliers
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id

# Customers
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id

# Imports
GET    /api/imports
GET    /api/imports/:id
POST   /api/imports
DELETE /api/imports/:id

# Exports
GET    /api/exports
GET    /api/exports/:id
POST   /api/exports
DELETE /api/exports/:id

# Inventory Checks
GET    /api/inventory-checks
GET    /api/inventory-checks/:id
POST   /api/inventory-checks
PUT    /api/inventory-checks/:id
PATCH  /api/inventory-checks/:id/complete
DELETE /api/inventory-checks/:id

# Dashboard
GET    /api/dashboard/stats
GET    /api/dashboard/low-stock-alerts
GET    /api/dashboard/recent-activities
GET    /api/dashboard/monthly-stats
GET    /api/dashboard/category-stats
GET    /api/dashboard/top-export-products

# Reports
GET    /api/reports/inventory
GET    /api/reports/import-export
GET    /api/reports/export-csv

# Audit Logs
GET    /api/audit-logs
```

### Phụ lục C: Tài khoản demo

| Vai trò | Username | Password | Quyền hạn                               |
| ------- | -------- | -------- | --------------------------------------- |
| Admin   | admin    | admin123 | Toàn quyền                              |
| Staff   | staff    | staff123 | Hạn chế (không quản lý user, audit log) |

### Phụ lục D: Cấu trúc dữ liệu mẫu

**Danh mục mẫu:**

- Laptop
- Phụ kiện
- Màn hình
- Thiết bị lưu trữ
- Thiết bị mạng

**Sản phẩm mẫu:**

- SP001: Laptop Dell XPS 15 - 15,000,000 VND
- SP002: Chuột Logitech MX Master - 500,000 VND
- SP003: Bàn phím Corsair K95 - 800,000 VND
- SP004: Màn hình LG 27" - 5,000,000 VND
- SP005: Tai nghe Sony WH-1000XM4 - 1,200,000 VND

---

**--- HẾT ---**
