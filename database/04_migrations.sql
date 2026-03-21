-- Migration: Add stock movements, approval workflow, and other enhancements
USE warehouse_db;

-- ============================================
-- 1. Stock Movements Table (Lịch sử biến động tồn kho)
-- ============================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  type ENUM('IMPORT', 'EXPORT', 'ADJUST', 'INVENTORY_CHECK') NOT NULL,
  quantity INT NOT NULL,
  before_quantity INT NOT NULL DEFAULT 0,
  after_quantity INT NOT NULL DEFAULT 0,
  reference_type VARCHAR(50) NULL,
  reference_id INT NULL,
  reference_code VARCHAR(50) NULL,
  note TEXT,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_product (product_id),
  INDEX idx_type (type),
  INDEX idx_reference (reference_type, reference_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Approval Workflow for Import/Export Receipts
-- ============================================
-- Add status and approval columns to import_receipts
ALTER TABLE import_receipts
  ADD COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED' AFTER note,
  ADD COLUMN approved_by INT NULL AFTER status,
  ADD COLUMN approved_at TIMESTAMP NULL AFTER approved_by,
  ADD COLUMN rejected_reason TEXT NULL AFTER approved_at,
  ADD INDEX idx_status (status),
  ADD FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add status and approval columns to export_receipts
ALTER TABLE export_receipts
  ADD COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED' AFTER note,
  ADD COLUMN approved_by INT NULL AFTER status,
  ADD COLUMN approved_at TIMESTAMP NULL AFTER approved_by,
  ADD COLUMN rejected_reason TEXT NULL AFTER approved_at,
  ADD INDEX idx_status (status),
  ADD FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- 3. Insert stock movement history from existing data
-- ============================================
-- Populate stock_movements from existing import receipts
INSERT INTO stock_movements (product_id, type, quantity, before_quantity, after_quantity, reference_type, reference_id, reference_code, created_by, created_at)
SELECT
  iri.product_id,
  'IMPORT',
  iri.quantity,
  0,
  0,
  'IMPORT_RECEIPT',
  ir.id,
  ir.receipt_code,
  ir.user_id,
  ir.import_date
FROM import_receipt_items iri
JOIN import_receipts ir ON iri.import_receipt_id = ir.id;

-- Populate stock_movements from existing export receipts
INSERT INTO stock_movements (product_id, type, quantity, before_quantity, after_quantity, reference_type, reference_id, reference_code, created_by, created_at)
SELECT
  eri.product_id,
  'EXPORT',
  eri.quantity,
  0,
  0,
  'EXPORT_RECEIPT',
  er.id,
  er.receipt_code,
  er.user_id,
  er.export_date
FROM export_receipt_items eri
JOIN export_receipts er ON eri.export_receipt_id = er.id;
