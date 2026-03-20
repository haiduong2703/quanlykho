-- Set UTF-8 encoding
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE warehouse_db;

-- Clear existing data (in correct order due to foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE export_receipt_items;
TRUNCATE TABLE import_receipt_items;
TRUNCATE TABLE export_receipts;
TRUNCATE TABLE import_receipts;
TRUNCATE TABLE stocks;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed users
-- admin/admin123, staff/staff123, john_doe/123456
INSERT INTO users (username, email, password, full_name, role, is_active) VALUES
('admin', 'admin@example.com', '$2a$10$5jK9ei21h07Aj7W5NpmXZuQOaLA/b12ft2RZaE7cQc70r8hc/33Dy', 'Quản trị viên', 'ADMIN', TRUE),
('staff', 'staff@example.com', '$2a$10$jMc4m4/kE.h6yng2Ai7H0OGutvmWbkNe8WDfoDR9GktYUKtnDvAte', 'Nhân viên kho', 'STAFF', TRUE),
('john_doe', 'john@example.com', '$2a$10$7KnGuEmE0QSobtbGdXVOu.VvukeeaKHUY8qlARZ.TsqHzpa05aboa', 'Nguyễn Văn An', 'STAFF', TRUE);

-- Seed categories
INSERT INTO categories (name, description) VALUES
('Điện tử', 'Thiết bị điện tử, linh kiện, phụ kiện'),
('Thực phẩm', 'Thực phẩm khô, đóng gói, chế biến'),
('Văn phòng phẩm', 'Dụng cụ văn phòng, giấy tờ, bút viết'),
('Dược phẩm', 'Thuốc, vật tư y tế, thiết bị y tế'),
('Hóa chất', 'Hóa chất công nghiệp, dung môi, chất tẩy rửa');

-- Seed products
INSERT INTO products (category_id, sku, name, description, unit, price, min_stock, is_active) VALUES
-- Điện tử (category_id = 1)
(1, 'ELEC-001', 'Laptop Dell Inspiron 15', 'Laptop Dell Inspiron 15, i5-12500H, 8GB RAM, 256GB SSD', 'Chiếc', 15000000, 5, TRUE),
(1, 'ELEC-002', 'Chuột Logitech M171', 'Chuột không dây Logitech M171', 'Chiếc', 150000, 20, TRUE),
(1, 'ELEC-003', 'Bàn phím cơ Keychron K2', 'Bàn phím cơ Keychron K2, Blue Switch', 'Chiếc', 2500000, 10, TRUE),
(1, 'ELEC-004', 'Màn hình LG 24 inch', 'Màn hình LG 24 inch Full HD IPS', 'Chiếc', 3500000, 8, TRUE),

-- Thực phẩm (category_id = 2)
(2, 'FOOD-001', 'Gạo ST25', 'Gạo ST25 cao cấp', 'Kg', 35000, 100, TRUE),
(2, 'FOOD-002', 'Dầu ăn Simply', 'Dầu ăn Simply chai 1L', 'Chai', 45000, 50, TRUE),
(2, 'FOOD-003', 'Mì gói Hảo Hảo', 'Mì gói Hảo Hảo vị tôm chua cay', 'Thùng', 120000, 30, TRUE),
(2, 'FOOD-004', 'Nước mắm Nam Ngư', 'Nước mắm Nam Ngư 750ml', 'Chai', 35000, 40, TRUE),

-- Văn phòng phẩm (category_id = 3)
(3, 'OFF-001', 'Giấy A4 Double A', 'Giấy A4 Double A 70gsm', 'Ram', 85000, 50, TRUE),
(3, 'OFF-002', 'Bút bi Thiên Long', 'Bút bi Thiên Long TL-027', 'Cây', 3000, 200, TRUE),
(3, 'OFF-003', 'Kẹp tài liệu Plus', 'Kẹp tài liệu Plus 50mm', 'Hộp', 25000, 30, TRUE),
(3, 'OFF-004', 'Bìa cứng Plus A4', 'Bìa cứng Plus A4 5cm', 'Cái', 15000, 50, TRUE),

-- Dược phẩm (category_id = 4)
(4, 'MED-001', 'Paracetamol 500mg', 'Thuốc hạ sốt Paracetamol 500mg', 'Hộp', 25000, 100, TRUE),
(4, 'MED-002', 'Khẩu trang y tế', 'Khẩu trang y tế 4 lớp', 'Hộp', 50000, 200, TRUE),
(4, 'MED-003', 'Cồn y tế 90 độ', 'Cồn y tế 90 độ chai 100ml', 'Chai', 15000, 150, TRUE),
(4, 'MED-004', 'Băng gạc y tế', 'Băng gạc y tế vô trùng 7.5cm x 4m', 'Cuộn', 8000, 100, TRUE),

-- Hóa chất (category_id = 5)
(5, 'CHEM-001', 'Nước tẩy Clorox', 'Nước tẩy Clorox chai 1L', 'Chai', 30000, 40, TRUE),
(5, 'CHEM-002', 'Nước lau sàn Vim', 'Nước lau sàn Vim hương lavender 900ml', 'Chai', 35000, 50, TRUE),
(5, 'CHEM-003', 'Xà phòng rửa tay Lifebuoy', 'Xà phòng rửa tay Lifebuoy bảo vệ vượt trội', 'Chai', 40000, 60, TRUE),
(5, 'CHEM-004', 'Bột giặt OMO', 'Bột giặt OMO Matic 6kg', 'Túi', 180000, 20, TRUE);

-- Seed stocks for all products
INSERT INTO stocks (product_id, quantity, last_import_date) VALUES
(1, 10, NOW()),
(2, 50, NOW()),
(3, 15, NOW()),
(4, 12, NOW()),
(5, 200, NOW()),
(6, 80, NOW()),
(7, 50, NOW()),
(8, 60, NOW()),
(9, 100, NOW()),
(10, 300, NOW()),
(11, 50, NOW()),
(12, 80, NOW()),
(13, 150, NOW()),
(14, 250, NOW()),
(15, 180, NOW()),
(16, 120, NOW()),
(17, 60, NOW()),
(18, 80, NOW()),
(19, 90, NOW()),
(20, 30, NOW());

-- Seed import receipts
INSERT INTO import_receipts (receipt_code, user_id, supplier_name, supplier_phone, total_amount, note, import_date) VALUES
('IMP20260114001', 1, 'Công ty TNHH Điện tử ABC', '0901234567', 35000000, 'Nhập hàng tháng 1/2026', '2026-01-10 09:00:00'),
('IMP20260114002', 2, 'Công ty TNHH Thực phẩm XYZ', '0912345678', 12500000, 'Nhập hàng thực phẩm định kỳ', '2026-01-12 14:30:00'),
('IMP20260114003', 1, 'Công ty CP Văn phòng phẩm 123', '0923456789', 5500000, 'Nhập văn phòng phẩm Q1/2026', '2026-01-13 10:15:00');

-- Seed import receipt items
INSERT INTO import_receipt_items (import_receipt_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 5, 14500000, 72500000),
(1, 3, 10, 2400000, 24000000),
(1, 4, 8, 3400000, 27200000),
(2, 5, 100, 33000, 3300000),
(2, 6, 50, 43000, 2150000),
(2, 7, 30, 115000, 3450000),
(2, 8, 40, 33000, 1320000),
(3, 9, 100, 82000, 8200000),
(3, 10, 200, 2800, 560000),
(3, 11, 30, 23000, 690000),
(3, 12, 50, 14000, 700000);

-- Seed export receipts
INSERT INTO export_receipts (receipt_code, user_id, customer_name, customer_phone, total_amount, note, export_date) VALUES
('EXP20260114001', 2, 'Công ty TNHH Phân phối DEF', '0934567890', 18000000, 'Xuất hàng theo đơn đặt hàng #DH001', '2026-01-11 11:20:00'),
('EXP20260114002', 3, 'Siêu thị CoopMart', '0945678901', 8500000, 'Xuất hàng định kỳ tuần', '2026-01-13 15:45:00');

-- Seed export receipt items
INSERT INTO export_receipt_items (export_receipt_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 3, 15000000, 45000000),
(1, 2, 20, 150000, 3000000),
(2, 5, 50, 35000, 1750000),
(2, 6, 30, 45000, 1350000),
(2, 9, 20, 85000, 1700000),
(2, 10, 100, 3000, 300000);

-- Update stocks after exports
UPDATE stocks SET quantity = quantity - 3, last_export_date = '2026-01-11 11:20:00' WHERE product_id = 1;
UPDATE stocks SET quantity = quantity - 20, last_export_date = '2026-01-11 11:20:00' WHERE product_id = 2;
UPDATE stocks SET quantity = quantity - 50, last_export_date = '2026-01-13 15:45:00' WHERE product_id = 5;
UPDATE stocks SET quantity = quantity - 30, last_export_date = '2026-01-13 15:45:00' WHERE product_id = 6;
UPDATE stocks SET quantity = quantity - 20, last_export_date = '2026-01-13 15:45:00' WHERE product_id = 9;
UPDATE stocks SET quantity = quantity - 100, last_export_date = '2026-01-13 15:45:00' WHERE product_id = 10;
