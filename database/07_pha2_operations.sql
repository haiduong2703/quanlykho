-- =====================================================================
-- Migration Pha 2: Nghiệp vụ mở rộng
--   - Phân loại phiếu nhập (PURCHASE / CUSTOMER_RETURN / TRANSFER_IN) + QC workflow
--   - Phân loại phiếu xuất (SALE / DISPOSAL / TRANSFER_OUT) + FIFO/LIFO + Picking
--   - Gắn warehouse_id, batch_id, location_id vào item/receipt
-- Idempotent: chạy lại an toàn.
-- =====================================================================
USE warehouse_db;

-- =====================================================================
-- 1. ALTER import_receipts
-- =====================================================================
DROP PROCEDURE IF EXISTS __pha2_alter_import_receipts;
DELIMITER $$
CREATE PROCEDURE __pha2_alter_import_receipts()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='import_receipts' AND COLUMN_NAME='receipt_type') THEN
    ALTER TABLE import_receipts
      ADD COLUMN receipt_type ENUM('PURCHASE','CUSTOMER_RETURN','TRANSFER_IN') DEFAULT 'PURCHASE' AFTER receipt_code;
    ALTER TABLE import_receipts ADD INDEX idx_receipt_type (receipt_type);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='import_receipts' AND COLUMN_NAME='warehouse_id') THEN
    ALTER TABLE import_receipts ADD COLUMN warehouse_id INT NULL AFTER supplier_phone;
    ALTER TABLE import_receipts ADD INDEX idx_warehouse (warehouse_id);
    ALTER TABLE import_receipts ADD CONSTRAINT fk_import_warehouse
      FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='import_receipts' AND COLUMN_NAME='qc_status') THEN
    ALTER TABLE import_receipts
      ADD COLUMN qc_status ENUM('NOT_REQUIRED','PENDING','PASSED','REJECTED') DEFAULT 'NOT_REQUIRED' AFTER status,
      ADD COLUMN qc_note TEXT NULL AFTER qc_status,
      ADD COLUMN qc_by INT NULL AFTER qc_note,
      ADD COLUMN qc_at TIMESTAMP NULL AFTER qc_by;
    ALTER TABLE import_receipts ADD INDEX idx_qc_status (qc_status);
    ALTER TABLE import_receipts ADD CONSTRAINT fk_import_qc_by
      FOREIGN KEY (qc_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='import_receipts' AND COLUMN_NAME='source_export_receipt_id') THEN
    ALTER TABLE import_receipts
      ADD COLUMN source_export_receipt_id INT NULL AFTER rejected_reason,
      ADD COLUMN source_transfer_receipt_id INT NULL AFTER source_export_receipt_id;
    ALTER TABLE import_receipts ADD CONSTRAINT fk_import_src_export
      FOREIGN KEY (source_export_receipt_id) REFERENCES export_receipts(id) ON DELETE SET NULL;
    ALTER TABLE import_receipts ADD CONSTRAINT fk_import_src_transfer
      FOREIGN KEY (source_transfer_receipt_id) REFERENCES transfer_receipts(id) ON DELETE SET NULL;
  END IF;
END$$
DELIMITER ;
CALL __pha2_alter_import_receipts();
DROP PROCEDURE __pha2_alter_import_receipts;

-- =====================================================================
-- 2. ALTER import_receipt_items
-- =====================================================================
DROP PROCEDURE IF EXISTS __pha2_alter_import_items;
DELIMITER $$
CREATE PROCEDURE __pha2_alter_import_items()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='import_receipt_items' AND COLUMN_NAME='batch_id') THEN
    ALTER TABLE import_receipt_items
      ADD COLUMN batch_id INT NULL AFTER product_id,
      ADD COLUMN location_id INT NULL AFTER batch_id,
      ADD COLUMN batch_code VARCHAR(50) NULL AFTER location_id,
      ADD COLUMN manufacture_date DATE NULL AFTER batch_code,
      ADD COLUMN expiry_date DATE NULL AFTER manufacture_date;
    ALTER TABLE import_receipt_items ADD INDEX idx_batch (batch_id);
    ALTER TABLE import_receipt_items ADD INDEX idx_location (location_id);
    ALTER TABLE import_receipt_items ADD CONSTRAINT fk_import_item_batch
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL;
    ALTER TABLE import_receipt_items ADD CONSTRAINT fk_import_item_location
      FOREIGN KEY (location_id) REFERENCES warehouse_locations(id) ON DELETE SET NULL;
  END IF;
END$$
DELIMITER ;
CALL __pha2_alter_import_items();
DROP PROCEDURE __pha2_alter_import_items;

-- =====================================================================
-- 3. ALTER export_receipts
-- =====================================================================
DROP PROCEDURE IF EXISTS __pha2_alter_export_receipts;
DELIMITER $$
CREATE PROCEDURE __pha2_alter_export_receipts()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='export_receipts' AND COLUMN_NAME='receipt_type') THEN
    ALTER TABLE export_receipts
      ADD COLUMN receipt_type ENUM('SALE','DISPOSAL','TRANSFER_OUT') DEFAULT 'SALE' AFTER receipt_code,
      ADD COLUMN warehouse_id INT NULL AFTER customer_phone,
      ADD COLUMN disposal_reason TEXT NULL AFTER warehouse_id,
      ADD COLUMN pick_strategy ENUM('FIFO','LIFO','MANUAL') DEFAULT 'FIFO' AFTER disposal_reason,
      ADD COLUMN picking_status ENUM('NOT_STARTED','PICKING','PICKED','DELIVERED') DEFAULT 'NOT_STARTED' AFTER pick_strategy;
    ALTER TABLE export_receipts ADD INDEX idx_receipt_type (receipt_type);
    ALTER TABLE export_receipts ADD INDEX idx_warehouse (warehouse_id);
    ALTER TABLE export_receipts ADD INDEX idx_picking_status (picking_status);
    ALTER TABLE export_receipts ADD CONSTRAINT fk_export_warehouse
      FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL;
  END IF;
END$$
DELIMITER ;
CALL __pha2_alter_export_receipts();
DROP PROCEDURE __pha2_alter_export_receipts;

-- =====================================================================
-- 4. ALTER export_receipt_items
--    Một item có thể bị chia thành nhiều batch khi picking → ta giữ
--    export_receipt_items làm "yêu cầu xuất", còn picking chi tiết lưu ở
--    bảng export_receipt_picks mới (1 request → N pick rows).
-- =====================================================================
DROP PROCEDURE IF EXISTS __pha2_alter_export_items;
DELIMITER $$
CREATE PROCEDURE __pha2_alter_export_items()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='export_receipt_items' AND COLUMN_NAME='picked_quantity') THEN
    ALTER TABLE export_receipt_items
      ADD COLUMN picked_quantity INT NOT NULL DEFAULT 0 AFTER quantity;
  END IF;
END$$
DELIMITER ;
CALL __pha2_alter_export_items();
DROP PROCEDURE __pha2_alter_export_items;

CREATE TABLE IF NOT EXISTS export_receipt_picks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  export_receipt_item_id INT NOT NULL,
  batch_id INT NULL,
  location_id INT NULL,
  quantity INT NOT NULL,
  picked_by INT NULL,
  picked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (export_receipt_item_id) REFERENCES export_receipt_items(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
  FOREIGN KEY (location_id) REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  FOREIGN KEY (picked_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_item (export_receipt_item_id),
  INDEX idx_batch (batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- 5. ALTER inventory_checks: gắn vào 1 kho cụ thể (giữ tương thích — warehouse_id nullable)
-- =====================================================================
DROP PROCEDURE IF EXISTS __pha2_alter_inventory_checks;
DELIMITER $$
CREATE PROCEDURE __pha2_alter_inventory_checks()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='inventory_checks' AND COLUMN_NAME='warehouse_id') THEN
    ALTER TABLE inventory_checks ADD COLUMN warehouse_id INT NULL AFTER user_id;
    ALTER TABLE inventory_checks ADD INDEX idx_warehouse (warehouse_id);
    ALTER TABLE inventory_checks ADD CONSTRAINT fk_icheck_warehouse
      FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL;
  END IF;
END$$
DELIMITER ;
CALL __pha2_alter_inventory_checks();
DROP PROCEDURE __pha2_alter_inventory_checks;

-- =====================================================================
-- 6. Backfill receipt_type và warehouse_id cho các phiếu cũ
-- =====================================================================
UPDATE import_receipts
SET receipt_type = 'PURCHASE'
WHERE receipt_type IS NULL;

UPDATE export_receipts
SET receipt_type = 'SALE'
WHERE receipt_type IS NULL;

UPDATE import_receipts
SET warehouse_id = (SELECT id FROM warehouses WHERE is_default = TRUE LIMIT 1)
WHERE warehouse_id IS NULL;

UPDATE export_receipts
SET warehouse_id = (SELECT id FROM warehouses WHERE is_default = TRUE LIMIT 1)
WHERE warehouse_id IS NULL;

-- =====================================================================
-- Xong Pha 2 schema. Kiểm tra:
--   SHOW COLUMNS FROM import_receipts LIKE 'receipt_type';
--   SHOW COLUMNS FROM export_receipts LIKE 'pick_strategy';
--   SHOW COLUMNS FROM import_receipt_items LIKE 'batch_id';
--   SHOW TABLES LIKE 'export_receipt_picks';
-- =====================================================================
