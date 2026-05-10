-- =====================================================================
-- Migration Pha 1: Foundation (multi-warehouse, location, batch, unit conversion, attributes, barcode, max_stock)
-- An toàn chạy lại (idempotent) — dùng information_schema để kiểm tra trước khi ALTER/CREATE.
-- Yêu cầu: MySQL 5.7+
-- =====================================================================
USE warehouse_db;

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 1. Bảng warehouses (nhiều kho)
-- =====================================================================
CREATE TABLE IF NOT EXISTS warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  manager_user_id INT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_active (is_active),
  INDEX idx_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed kho mặc định (chỉ chèn nếu chưa có)
INSERT INTO warehouses (code, name, address, is_default, is_active)
SELECT 'WH01', 'Kho chính', 'Địa chỉ kho chính', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE code = 'WH01');

-- =====================================================================
-- 2. Bảng warehouse_locations (Khu vực → Dãy → Kệ → Tầng → Ô)
-- =====================================================================
CREATE TABLE IF NOT EXISTS warehouse_locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  warehouse_id INT NOT NULL,
  code VARCHAR(50) NOT NULL,
  zone VARCHAR(20) NOT NULL,
  aisle VARCHAR(20) NULL,
  rack VARCHAR(20) NULL,
  shelf VARCHAR(20) NULL,
  bin VARCHAR(20) NULL,
  description VARCHAR(255),
  capacity INT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  UNIQUE KEY uk_wh_code (warehouse_id, code),
  INDEX idx_warehouse (warehouse_id),
  INDEX idx_zone (zone),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 3. Bảng batches (lô hàng + hạn sử dụng) — nền tảng cho FIFO/LIFO & xuất hủy
-- =====================================================================
CREATE TABLE IF NOT EXISTS batches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  batch_code VARCHAR(50) NOT NULL,
  product_id INT NOT NULL,
  supplier_id INT NULL,
  warehouse_id INT NULL,
  manufacture_date DATE NULL,
  expiry_date DATE NULL,
  import_receipt_id INT NULL,
  initial_quantity INT NOT NULL DEFAULT 0,
  remaining_quantity INT NOT NULL DEFAULT 0,
  unit_price DECIMAL(15,2) DEFAULT 0,
  status ENUM('ACTIVE','EXPIRED','DAMAGED','DEPLETED') DEFAULT 'ACTIVE',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
  FOREIGN KEY (import_receipt_id) REFERENCES import_receipts(id) ON DELETE SET NULL,
  UNIQUE KEY uk_product_batch (product_id, batch_code),
  INDEX idx_product (product_id),
  INDEX idx_warehouse (warehouse_id),
  INDEX idx_expiry (expiry_date),
  INDEX idx_status (status),
  INDEX idx_remaining (remaining_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 4. Bảng product_units (quy đổi đơn vị: 1 Thùng = 10 Lốc = 100 Chai)
-- =====================================================================
CREATE TABLE IF NOT EXISTS product_units (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  unit_name VARCHAR(30) NOT NULL,
  conversion_rate DECIMAL(15,4) NOT NULL DEFAULT 1,
  is_base BOOLEAN DEFAULT FALSE,
  barcode VARCHAR(100) NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uk_product_unit (product_id, unit_name),
  INDEX idx_product (product_id),
  INDEX idx_base (is_base),
  INDEX idx_barcode (barcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 5. Bảng product_attributes (thuộc tính biến thể: màu, kích cỡ, …)
-- =====================================================================
CREATE TABLE IF NOT EXISTS product_attributes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  attr_name VARCHAR(50) NOT NULL,
  attr_value VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id),
  INDEX idx_attr (attr_name, attr_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 6. Bảng stock_by_location (tồn chi tiết theo product × warehouse × location × batch)
--    Bảng stocks cũ giữ nguyên làm tồn tổng (cache) để tương thích.
-- =====================================================================
CREATE TABLE IF NOT EXISTS stock_by_location (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  location_id INT NULL,
  batch_id INT NULL,
  quantity INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
  FOREIGN KEY (location_id) REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
  INDEX idx_product (product_id),
  INDEX idx_warehouse (warehouse_id),
  INDEX idx_location (location_id),
  INDEX idx_batch (batch_id),
  INDEX idx_quantity (quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Unique composite (product + warehouse + location + batch). MySQL cho phép nhiều NULL trong UNIQUE,
-- nên ta dùng thêm cột "sig" để ép ràng buộc khi location/batch là NULL. Giải pháp khác:
-- thay NULL bằng 0 ở application layer khi upsert. Chúng ta giữ index thường ở trên và enforce ở code.

-- =====================================================================
-- 7. Bảng transfer_receipts (phiếu chuyển kho nội bộ) — sẽ dùng ở Pha 2, đặt schema sẵn
-- =====================================================================
CREATE TABLE IF NOT EXISTS transfer_receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  receipt_code VARCHAR(50) UNIQUE NOT NULL,
  from_warehouse_id INT NOT NULL,
  to_warehouse_id INT NOT NULL,
  user_id INT NOT NULL,
  total_quantity INT NOT NULL DEFAULT 0,
  note TEXT,
  status ENUM('PENDING','IN_TRANSIT','COMPLETED','REJECTED','CANCELLED') DEFAULT 'PENDING',
  approved_by INT NULL,
  approved_at TIMESTAMP NULL,
  received_by INT NULL,
  received_at TIMESTAMP NULL,
  rejected_reason TEXT NULL,
  transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
  FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_receipt_code (receipt_code),
  INDEX idx_from (from_warehouse_id),
  INDEX idx_to (to_warehouse_id),
  INDEX idx_status (status),
  INDEX idx_transfer_date (transfer_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transfer_receipt_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transfer_receipt_id INT NOT NULL,
  product_id INT NOT NULL,
  batch_id INT NULL,
  from_location_id INT NULL,
  to_location_id INT NULL,
  quantity INT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transfer_receipt_id) REFERENCES transfer_receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
  FOREIGN KEY (from_location_id) REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  FOREIGN KEY (to_location_id) REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  INDEX idx_transfer (transfer_receipt_id),
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 8. ALTER products: thêm max_stock, barcode (dùng procedure để idempotent)
-- =====================================================================
DROP PROCEDURE IF EXISTS __pha1_alter_products;
DELIMITER $$
CREATE PROCEDURE __pha1_alter_products()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'max_stock') THEN
    ALTER TABLE products ADD COLUMN max_stock INT NOT NULL DEFAULT 0 AFTER min_stock;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'barcode') THEN
    ALTER TABLE products ADD COLUMN barcode VARCHAR(100) NULL AFTER sku;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.STATISTICS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND INDEX_NAME = 'idx_barcode') THEN
    ALTER TABLE products ADD INDEX idx_barcode (barcode);
  END IF;
END$$
DELIMITER ;

CALL __pha1_alter_products();
DROP PROCEDURE __pha1_alter_products;

-- =====================================================================
-- 9. ALTER stock_movements: bổ sung type TRANSFER, RETURN, DISPOSAL, QC_REJECT (idempotent)
-- =====================================================================
DROP PROCEDURE IF EXISTS __pha1_alter_stock_movements;
DELIMITER $$
CREATE PROCEDURE __pha1_alter_stock_movements()
BEGIN
  DECLARE cur_type TEXT;
  SELECT COLUMN_TYPE INTO cur_type
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stock_movements' AND COLUMN_NAME = 'type';

  IF cur_type IS NOT NULL AND cur_type NOT LIKE '%TRANSFER_IN%' THEN
    ALTER TABLE stock_movements
      MODIFY COLUMN type ENUM(
        'IMPORT','EXPORT','ADJUST','INVENTORY_CHECK',
        'TRANSFER_IN','TRANSFER_OUT','RETURN_IN','DISPOSAL','QC_REJECT'
      ) NOT NULL;
  END IF;

  -- Thêm cột warehouse_id, batch_id, location_id nếu chưa có
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stock_movements' AND COLUMN_NAME = 'warehouse_id') THEN
    ALTER TABLE stock_movements ADD COLUMN warehouse_id INT NULL AFTER product_id;
    ALTER TABLE stock_movements ADD INDEX idx_warehouse (warehouse_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stock_movements' AND COLUMN_NAME = 'batch_id') THEN
    ALTER TABLE stock_movements ADD COLUMN batch_id INT NULL AFTER warehouse_id;
    ALTER TABLE stock_movements ADD INDEX idx_batch (batch_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stock_movements' AND COLUMN_NAME = 'location_id') THEN
    ALTER TABLE stock_movements ADD COLUMN location_id INT NULL AFTER batch_id;
    ALTER TABLE stock_movements ADD INDEX idx_location (location_id);
  END IF;
END$$
DELIMITER ;

CALL __pha1_alter_stock_movements();
DROP PROCEDURE __pha1_alter_stock_movements;

-- =====================================================================
-- 10. Backfill dữ liệu
--    - Với mỗi product chưa có product_units: tạo 1 unit cơ sở từ cột products.unit.
--    - Với mỗi product có tồn trong stocks: đẩy vào stock_by_location tại kho mặc định, location/batch = NULL.
-- =====================================================================

-- Backfill product_units (base unit) từ products.unit
INSERT INTO product_units (product_id, unit_name, conversion_rate, is_base, barcode)
SELECT p.id, COALESCE(NULLIF(TRIM(p.unit), ''), 'Cái'), 1, TRUE, NULL
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM product_units pu WHERE pu.product_id = p.id);

-- Backfill stock_by_location từ stocks hiện tại (chỉ chèn nếu chưa có record nào cho product đó)
INSERT INTO stock_by_location (product_id, warehouse_id, location_id, batch_id, quantity)
SELECT s.product_id,
       (SELECT id FROM warehouses WHERE is_default = TRUE LIMIT 1),
       NULL, NULL, s.quantity
FROM stocks s
WHERE s.quantity IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM stock_by_location sbl WHERE sbl.product_id = s.product_id
  );

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

-- =====================================================================
-- Xong Pha 1. Kiểm tra nhanh:
--   SELECT COUNT(*) FROM warehouses;
--   SELECT COUNT(*) FROM product_units;
--   SELECT COUNT(*) FROM stock_by_location;
--   SHOW COLUMNS FROM products LIKE 'max_stock';
--   SHOW COLUMNS FROM products LIKE 'barcode';
-- =====================================================================
