# HỆ THỐNG QUẢN LÝ KHO

Hệ thống quản lý kho đầy đủ sử dụng Node.js, Express.js, MySQL, React, và Vite.

## MÔ TẢ

Đây là hệ thống quản lý kho hàng toàn diện với các tính năng:
- Quản lý sản phẩm, danh mục, tồn kho
- Nhập/xuất kho với transaction an toàn
- Phân quyền người dùng (ADMIN, STAFF)
- Dashboard thống kê
- Báo cáo và export CSV

## CÔNG NGHỆ SỬ DỤNG

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **MySQL**: Database với connection pool
- **JWT**: Authentication
- **bcrypt**: Mã hóa mật khẩu
- **express-validator**: Validation
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logger

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client với interceptors
- **React Hook Form**: Form management
- **React Toastify**: Notifications
- **date-fns**: Date formatting

## KIẾN TRÚC

```
Routes → Controllers → Services → Models → Database
```

### Backend Structure
```
backend/
├── src/
│   ├── config/          # Database config, constants
│   ├── middlewares/     # Auth, roleCheck, validate, errorHandler
│   ├── utils/           # JWT, bcrypt, responseHelper, csvExport
│   ├── models/          # 8 models (User, Category, Product, Stock, Import/Export Receipts)
│   ├── services/        # Business logic với transaction
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   └── validators/      # Input validation rules
├── server.js            # Entry point
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── config/          # API config với Axios interceptors
│   ├── contexts/        # AuthContext
│   ├── routes/          # ProtectedRoute, AdminRoute
│   ├── pages/           # All pages
│   ├── components/      # Reusable components
│   └── styles/          # CSS files
└── package.json
```

## CÀI ĐẶT VÀ CHẠY

### Yêu cầu
- Node.js >= 16
- MySQL >= 5.7
- npm hoặc yarn

### 1. Cài đặt Database

```bash
# Tạo database và import schema
mysql -u root -p < database/01_schema.sql

# Import dữ liệu mẫu
mysql -u root -p < database/02_seed.sql
```

**Lưu ý**: Nếu gặp lỗi password hash trong seed file, cần cập nhật password hash mới:

```bash
# Trong Node.js REPL hoặc tạo script:
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin123', 10));  # Password cho admin
console.log(bcrypt.hashSync('staff123', 10));  # Password cho staff
```

Sau đó cập nhật vào file `database/02_seed.sql` phần INSERT users.

### 2. Cài đặt Backend

```bash
cd backend
npm install

# Copy .env.example và cấu hình
cp .env.example .env

# Chỉnh sửa .env với thông tin MySQL của bạn:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=warehouse_db

# Chạy server
npm run dev  # Development mode
# hoặc
npm start    # Production mode
```

Server sẽ chạy tại: `http://localhost:5000`
API endpoint: `http://localhost:5000/api`

### 3. Cài đặt Frontend

```bash
cd frontend
npm install

# Chạy frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## TÀI KHOẢN DEMO

Sau khi import seed data, bạn có thể đăng nhập với:

- **Admin**:
  - Username: `admin`
  - Password: `admin123`

- **Staff**:
  - Username: `staff`
  - Password: `staff123`

## API ENDPOINTS

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin user
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

### Users (ADMIN only)
- `GET /api/users` - Danh sách người dùng
- `GET /api/users/:id` - Chi tiết người dùng
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:id` - Cập nhật người dùng
- `DELETE /api/users/:id` - Xóa người dùng
- `PATCH /api/users/:id/toggle-status` - Bật/tắt tài khoản

### Categories
- `GET /api/categories` - Danh sách danh mục (paginated)
- `GET /api/categories/all` - Tất cả danh mục (no pagination)
- `GET /api/categories/:id` - Chi tiết danh mục
- `POST /api/categories` - Tạo danh mục
- `PUT /api/categories/:id` - Cập nhật danh mục
- `DELETE /api/categories/:id` - Xóa danh mục

### Products
- `GET /api/products` - Danh sách sản phẩm (paginated, filterable)
- `GET /api/products/search?keyword=` - Tìm kiếm sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `PATCH /api/products/:id/toggle-status` - Bật/tắt sản phẩm

### Stocks
- `GET /api/stocks` - Danh sách tồn kho (paginated, filterable)
- `GET /api/stocks/alerts` - Cảnh báo tồn kho thấp
- `GET /api/stocks/product/:id` - Tồn kho theo sản phẩm

### Import Receipts
- `GET /api/imports` - Danh sách phiếu nhập
- `GET /api/imports/:id` - Chi tiết phiếu nhập
- `POST /api/imports` - Tạo phiếu nhập (transaction)
- `DELETE /api/imports/:id` - Xóa phiếu nhập (transaction)

### Export Receipts
- `GET /api/exports` - Danh sách phiếu xuất
- `GET /api/exports/:id` - Chi tiết phiếu xuất
- `POST /api/exports` - Tạo phiếu xuất (transaction + validation)
- `DELETE /api/exports/:id` - Xóa phiếu xuất (transaction)

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/dashboard/low-stock-alerts` - Cảnh báo tồn kho
- `GET /api/dashboard/recent-activities` - Hoạt động gần đây

### Reports
- `GET /api/reports/inventory` - Báo cáo tồn kho
- `GET /api/reports/import-export?from=&to=` - Báo cáo nhập/xuất
- `GET /api/reports/export-csv` - Export CSV

## CHỨC NĂNG CHÍNH

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, STAFF)
- Protected routes
- Password hashing với bcrypt

### 2. Quản lý Người dùng (ADMIN)
- CRUD operations
- Phân quyền ADMIN/STAFF
- Bật/tắt tài khoản

### 3. Quản lý Danh mục
- CRUD operations
- Validation: Không xóa danh mục có sản phẩm

### 4. Quản lý Sản phẩm
- CRUD operations
- Tìm kiếm theo tên/SKU
- Lọc theo danh mục
- Tự động khởi tạo stock khi tạo sản phẩm

### 5. Nhập kho
- Tạo phiếu nhập với nhiều sản phẩm
- **Transaction safety**: Rollback nếu có lỗi
- Tự động cộng tồn kho
- Generate receipt code tự động (IMP20260114001)

### 6. Xuất kho
- Tạo phiếu xuất với nhiều sản phẩm
- **Validation tồn kho**: Không cho xuất vượt tồn
- **Transaction safety**: Rollback nếu có lỗi
- Tự động trừ tồn kho
- Generate receipt code tự động (EXP20260114001)

### 7. Tồn kho
- Xem tồn kho realtime
- Cảnh báo sản phẩm sắp hết (quantity <= min_stock)
- Tính giá trị tồn kho

### 8. Dashboard
- Tổng số sản phẩm
- Tổng phiếu nhập/xuất
- Số sản phẩm sắp hết
- Giá trị tồn kho
- Hoạt động gần đây

### 9. Báo cáo
- Báo cáo tồn kho
- Báo cáo nhập/xuất theo khoảng thời gian
- Export CSV

## TRANSACTION LOGIC

### Flow Nhập Kho
1. BEGIN TRANSACTION
2. Validate items (product exists, quantity > 0)
3. Generate receipt_code
4. Calculate total_amount
5. INSERT import_receipt
6. FOR EACH item:
   - INSERT import_receipt_item
   - UPDATE stocks: quantity += item.quantity
7. COMMIT TRANSACTION
8. ROLLBACK nếu có lỗi

### Flow Xuất Kho
1. BEGIN TRANSACTION
2. Validate items
3. **Check stock availability** (CRITICAL)
4. Generate receipt_code
5. Calculate total_amount
6. INSERT export_receipt
7. FOR EACH item:
   - INSERT export_receipt_item
   - UPDATE stocks: quantity -= item.quantity
8. COMMIT TRANSACTION
9. ROLLBACK nếu có lỗi

## SECURITY

- JWT tokens với expiration (7 ngày)
- Passwords hashed với bcrypt (10 salt rounds)
- SQL injection protection (prepared statements)
- CORS configuration
- Helmet middleware
- Rate limiting
- Input validation với express-validator
- Role-based access control

## DATABASE SCHEMA

8 bảng chính:
- `users` - Người dùng và phân quyền
- `categories` - Danh mục sản phẩm
- `products` - Sản phẩm
- `stocks` - Tồn kho
- `import_receipts` - Phiếu nhập kho
- `import_receipt_items` - Chi tiết phiếu nhập
- `export_receipts` - Phiếu xuất kho
- `export_receipt_items` - Chi tiết phiếu xuất

## TROUBLESHOOTING

### Lỗi kết nối MySQL
```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p -e "SELECT VERSION();"

# Kiểm tra .env file
cat backend/.env
```

### Lỗi authentication failed
- Xóa token trong localStorage
- Kiểm tra JWT_SECRET trong .env
- Verify password hash trong database

### Lỗi CORS
- Kiểm tra CORS_ORIGIN trong backend/.env
- Đảm bảo frontend URL đúng với CORS_ORIGIN

### Lỗi transaction
- Check MySQL InnoDB engine (required for transactions)
- Verify foreign key constraints
- Check database logs

## PHÁT TRIỂN THÊM

Các tính năng có thể mở rộng:
- [ ] Import/Export Excel
- [ ] In phiếu nhập/xuất PDF
- [ ] Notification system
- [ ] Audit logs
- [ ] Multi-warehouse support
- [ ] Barcode scanning
- [ ] Advanced reporting với charts
- [ ] Email notifications
- [ ] Mobile app

## TÁC GIẢ

Senior Fullstack Engineer

## LICENSE

MIT License
