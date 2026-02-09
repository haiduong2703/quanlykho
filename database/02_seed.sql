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
-- Password for all: 123456 (will be updated by script)
INSERT INTO users (username, email, password, full_name, role, is_active) VALUES
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'ADMIN', TRUE),
('staff', 'staff@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff User', 'STAFF', TRUE),
('john_doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'STAFF', TRUE);

-- Seed categories
INSERT INTO categories (name, description) VALUES
('Dien tu', 'Thiet bi dien tu, linh kien, phu kien'),
('Thuc pham', 'Thuc pham kho, dong goi, che bien'),
('Van phong pham', 'Dung cu van phong, giay to, but viet'),
('Duoc pham', 'Thuoc, vat tu y te, thiet bi y te'),
('Hoa chat', 'Hoa chat cong nghiep, dung moi, chat tay rua');

-- Seed products
INSERT INTO products (category_id, sku, name, description, unit, price, min_stock, is_active) VALUES
-- Dien tu (category_id = 1)
(1, 'ELEC-001', 'Laptop Dell Inspiron 15', 'Laptop Dell Inspiron 15, i5-12500H, 8GB RAM, 256GB SSD', 'Chiec', 15000000, 5, TRUE),
(1, 'ELEC-002', 'Chuot Logitech M171', 'Chuot khong day Logitech M171', 'Chiec', 150000, 20, TRUE),
(1, 'ELEC-003', 'Ban phim co Keychron K2', 'Ban phim co Keychron K2, Blue Switch', 'Chiec', 2500000, 10, TRUE),
(1, 'ELEC-004', 'Man hinh LG 24 inch', 'Man hinh LG 24 inch Full HD IPS', 'Chiec', 3500000, 8, TRUE),

-- Thuc pham (category_id = 2)
(2, 'FOOD-001', 'Gao ST25', 'Gao ST25 cao cap', 'Kg', 35000, 100, TRUE),
(2, 'FOOD-002', 'Dau an Simply', 'Dau an Simply chai 1L', 'Chai', 45000, 50, TRUE),
(2, 'FOOD-003', 'Mi goi Hao Hao', 'Mi goi Hao Hao vi tom chua cay', 'Thung', 120000, 30, TRUE),
(2, 'FOOD-004', 'Nuoc mam Nam Ngu', 'Nuoc mam Nam Ngu 750ml', 'Chai', 35000, 40, TRUE),

-- Van phong pham (category_id = 3)
(3, 'OFF-001', 'Giay A4 Double A', 'Giay A4 Double A 70gsm', 'Ream', 85000, 50, TRUE),
(3, 'OFF-002', 'But bi Thien Long', 'But bi Thien Long TL-027', 'Cay', 3000, 200, TRUE),
(3, 'OFF-003', 'Kep tai lieu Plus', 'Kep tai lieu Plus 50mm', 'Hop', 25000, 30, TRUE),
(3, 'OFF-004', 'Bia cong Plus A4', 'Bia cong Plus A4 5cm', 'Cai', 15000, 50, TRUE),

-- Duoc pham (category_id = 4)
(4, 'MED-001', 'Paracetamol 500mg', 'Thuoc ha sot Paracetamol 500mg', 'Hop', 25000, 100, TRUE),
(4, 'MED-002', 'Khau trang y te', 'Khau trang y te 4 lop', 'Hop', 50000, 200, TRUE),
(4, 'MED-003', 'Con y te 90 do', 'Con y te 90 do chai 100ml', 'Chai', 15000, 150, TRUE),
(4, 'MED-004', 'Bang gac y te', 'Bang gac y te vo trung 7.5cm x 4m', 'Cuon', 8000, 100, TRUE),

-- Hoa chat (category_id = 5)
(5, 'CHEM-001', 'Nuoc tay Clorox', 'Nuoc tay Clorox chai 1L', 'Chai', 30000, 40, TRUE),
(5, 'CHEM-002', 'Nuoc lau san Vim', 'Nuoc lau san Vim huong lavender 900ml', 'Chai', 35000, 50, TRUE),
(5, 'CHEM-003', 'Xa phong rua tay Lifebuoy', 'Xa phong rua tay Lifebuoy bao ve vuot troi', 'Chai', 40000, 60, TRUE),
(5, 'CHEM-004', 'Bot giat OMO', 'Bot giat OMO Matic 6kg', 'Tui', 180000, 20, TRUE);

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
('IMP20260114001', 1, 'Cong ty TNHH Dien tu ABC', '0901234567', 35000000, 'Nhap hang thang 1/2026', '2026-01-10 09:00:00'),
('IMP20260114002', 2, 'Cong ty TNHH Thuc pham XYZ', '0912345678', 12500000, 'Nhap hang thuc pham dinh ky', '2026-01-12 14:30:00'),
('IMP20260114003', 1, 'Cong ty CP Van phong pham 123', '0923456789', 5500000, 'Nhap van phong pham Q1/2026', '2026-01-13 10:15:00');

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
('EXP20260114001', 2, 'Cong ty TNHH Phan phoi DEF', '0934567890', 18000000, 'Xuat hang theo don dat hang #DH001', '2026-01-11 11:20:00'),
('EXP20260114002', 3, 'Sieu thi CoopMart', '0945678901', 8500000, 'Xuat hang dinh ky tuan', '2026-01-13 15:45:00');

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
