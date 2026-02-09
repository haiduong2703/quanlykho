-- Inventory Check Tables for warehouse_db
USE warehouse_db;

-- Drop tables if exists
DROP TABLE IF EXISTS inventory_check_details;
DROP TABLE IF EXISTS inventory_checks;

-- Table: inventory_checks (Phiếu kiểm kê)
CREATE TABLE inventory_checks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  check_code VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('DRAFT', 'COMPLETED', 'CANCELLED') DEFAULT 'DRAFT',
  total_products INT DEFAULT 0,
  total_difference INT DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_check_code (check_code),
  INDEX idx_user (user_id),
  INDEX idx_check_date (check_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: inventory_check_details (Chi tiết kiểm kê)
CREATE TABLE inventory_check_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inventory_check_id INT NOT NULL,
  product_id INT NOT NULL,
  system_quantity INT NOT NULL DEFAULT 0,
  actual_quantity INT NOT NULL DEFAULT 0,
  difference INT NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_check_id) REFERENCES inventory_checks(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_inventory_check (inventory_check_id),
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
