-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: warehouse_db
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int DEFAULT NULL,
  `entity_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'Quản trị viên','LOGIN','USER',1,'admin',NULL,'::1','2026-03-25 10:19:53');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Nẹp Nhôm Trang Trí','Các loại nẹp nhôm trang trí nội ngoại thất: nẹp chân tường, nẹp góc, nẹp chống trượt, nẹp chuyển tiếp...','2026-03-21 17:54:28','2026-03-21 17:54:28'),(2,'Nẹp Inox Trang Trí','Các loại nẹp inox trang trí cao cấp: nẹp chữ T, nẹp góc, nẹp viền, nẹp phân cách sàn...','2026-03-21 17:54:28','2026-03-21 17:54:28'),(3,'Nẹp Nhựa','Các loại nẹp nhựa PVC trang trí: nẹp góc, nẹp chân tường, nẹp co giãn, nẹp bảo vệ...','2026-03-21 17:54:28','2026-03-21 17:54:28'),(4,'Nẹp Đồng Trang Trí','Các loại nẹp đồng trang trí cao cấp: nẹp chữ T, nẹp góc, nẹp phân cách, nẹp chống trượt...','2026-03-21 17:54:28','2026-03-21 17:54:28');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tax_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_name` (`name`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'CUS-001','Công ty TNHH Nội Thất Hoàng Gia','Nguyễn Thị Lan','0956789012','noithat@hoanggia.vn','111 Nguyễn Văn Cừ, Q.5, TP.HCM','0312346001',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(2,'CUS-002','Cửa hàng Decor Mộc Nhiên','Trần Văn Tùng','0967890123','mocnhien@decor.vn','222 Lý Thường Kiệt, Q.10, TP.HCM',NULL,NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(3,'CUS-003','Công ty CP Xây Dựng Hải Phong','Lê Thị Bích','0978901234','haiphong@xaydung.vn','333 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM','0312346003',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(4,'CUS-004','Xưởng Mộc Anh Tuấn','Võ Anh Tuấn','0989012345','anhtuanmoc@gmail.com','444 Lê Văn Sỹ, Q.3, TP.HCM',NULL,NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(5,'CUS-005','Công ty TNHH Thiết Kế Nội Thất 3D','Phạm Minh Quân','0990123456','contact@noithat3d.vn','555 Nam Kỳ Khởi Nghĩa, Q.3, TP.HCM','0312346005',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `export_receipt_items`
--

DROP TABLE IF EXISTS `export_receipt_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `export_receipt_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `export_receipt_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_export_receipt` (`export_receipt_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `export_receipt_items_ibfk_1` FOREIGN KEY (`export_receipt_id`) REFERENCES `export_receipts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `export_receipt_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `export_receipt_items`
--

LOCK TABLES `export_receipt_items` WRITE;
/*!40000 ALTER TABLE `export_receipt_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `export_receipt_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `export_receipts`
--

DROP TABLE IF EXISTS `export_receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `export_receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receipt_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `customer_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `note` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_reason` text COLLATE utf8mb4_unicode_ci,
  `export_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_code` (`receipt_code`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_receipt_code` (`receipt_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_export_date` (`export_date`),
  CONSTRAINT `export_receipts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `export_receipts_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `export_receipts_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `export_receipts`
--

LOCK TABLES `export_receipts` WRITE;
/*!40000 ALTER TABLE `export_receipts` DISABLE KEYS */;
/*!40000 ALTER TABLE `export_receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipt_items`
--

DROP TABLE IF EXISTS `import_receipt_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipt_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `import_receipt_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_import_receipt` (`import_receipt_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `import_receipt_items_ibfk_1` FOREIGN KEY (`import_receipt_id`) REFERENCES `import_receipts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `import_receipt_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt_items`
--

LOCK TABLES `import_receipt_items` WRITE;
/*!40000 ALTER TABLE `import_receipt_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `import_receipt_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipts`
--

DROP TABLE IF EXISTS `import_receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receipt_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `supplier_id` int DEFAULT NULL,
  `supplier_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplier_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `note` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_reason` text COLLATE utf8mb4_unicode_ci,
  `import_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_code` (`receipt_code`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_receipt_code` (`receipt_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_supplier` (`supplier_id`),
  KEY `idx_status` (`status`),
  KEY `idx_import_date` (`import_date`),
  CONSTRAINT `import_receipts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `import_receipts_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `import_receipts_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipts`
--

LOCK TABLES `import_receipts` WRITE;
/*!40000 ALTER TABLE `import_receipts` DISABLE KEYS */;
/*!40000 ALTER TABLE `import_receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_check_details`
--

DROP TABLE IF EXISTS `inventory_check_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_check_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventory_check_id` int NOT NULL,
  `product_id` int NOT NULL,
  `system_quantity` int NOT NULL DEFAULT '0',
  `actual_quantity` int NOT NULL DEFAULT '0',
  `difference` int NOT NULL DEFAULT '0',
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inventory_check` (`inventory_check_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `inventory_check_details_ibfk_1` FOREIGN KEY (`inventory_check_id`) REFERENCES `inventory_checks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_check_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_check_details`
--

LOCK TABLES `inventory_check_details` WRITE;
/*!40000 ALTER TABLE `inventory_check_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_check_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_checks`
--

DROP TABLE IF EXISTS `inventory_checks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_checks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `check_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `check_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('DRAFT','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  `total_products` int DEFAULT '0',
  `total_difference` int DEFAULT '0',
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `check_code` (`check_code`),
  KEY `idx_check_code` (`check_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_check_date` (`check_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `inventory_checks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_checks`
--

LOCK TABLES `inventory_checks` WRITE;
/*!40000 ALTER TABLE `inventory_checks` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_checks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `min_stock` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_sku` (`sku`),
  KEY `idx_name` (`name`),
  KEY `idx_category` (`category_id`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'NNT-001','Len chân tường nhôm kiểu dán','','https://svietdecor.com/wp-content/uploads/2025/07/Len-chan-tuong-kieu-dan-1.webp','m',118000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(2,1,'NNT-002','Nẹp Nhôm Góc Ngoài MY12','','https://svietdecor.com/wp-content/uploads/2025/07/MY12-nhom-2.webp','m',85000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(3,1,'NNT-003','Nẹp khe co giãn sàn bê tông','Nẹp khe co giãn sàn bê tông là sản phẩm nẹp trang trí được làm từ chất liệu nhựa PVC nguyên sinh, kích thước mặt cắt với chiều dài đáy 30mm x 8mm, sản phẩm dùng để tạo khe co giãn cho các sân, đường bê tông có diện tích lớn.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-khe-co-gian-san-be-tong-4.webp','m',36000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(4,1,'NNT-004','Nẹp nhôm chống trượt đèn LED','Liên hệ 0922 272 345 để nhận giá ưu đãi theo nhu cầu!','https://svietdecor.com/wp-content/uploads/2025/03/Nep-chong-truot-cau-thang-LED-1.webp','m',212000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(5,1,'NNT-005','Nẹp lập là nhôm 20 mm','','https://svietdecor.com/wp-content/uploads/2025/03/La-nhom-20mm-8-a.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(6,1,'NNT-006','Nẹp Thảm DC7','','https://svietdecor.com/wp-content/uploads/2025/02/nep-tham-DC7-3.webp','m',50000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(7,1,'NNT-007','Len Chân Tường LED','','https://svietdecor.com/wp-content/uploads/2025/02/Len-chan-tuong-LED-DCP80-10.webp','m',124000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(8,1,'NNT-008','Nẹp kết thúc MB3.5','','https://svietdecor.com/wp-content/uploads/2025/01/Nep-ket-thuc-MB3.5-1.webp','m',35000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(9,1,'NNT-009','Nẹp kết thúc MB5.0','','https://svietdecor.com/wp-content/uploads/2025/01/Nep-ket-thuc-MB5-sviet-11.webp','m',35000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(10,1,'NNT-010','Nẹp nhôm ngắt nước dưới NAN-D','','https://svietdecor.com/wp-content/uploads/2024/12/Nep-hom-ngat-nuoc-duoi-NAN-D-8.webp','m',60000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(11,1,'NNT-011','Nẹp nhôm ngắt nước trên NAN-T','','https://svietdecor.com/wp-content/uploads/2024/12/Nep-nhom-ngat-nuoc-tren-NAN-T-3.webp','m',60000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(12,1,'NNT-012','Nẹp nhôm U7 có tai','','https://svietdecor.com/wp-content/uploads/2024/12/13825-VU7mm-nhom-co-tai-SViet.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(13,1,'NNT-013','Nẹp Nhôm U15-10 mm','','https://svietdecor.com/wp-content/uploads/2024/08/Nep-Nhom-U15mm-a1.webp','m',100000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(14,1,'NNT-014','Nẹp Nhôm U5 mm','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-nhom-U-5-SViet-26825-1.webp','m',30000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(15,1,'NNT-015','Nẹp Nhôm Ngắt Nước Trên Dưới','','https://svietdecor.com/wp-content/uploads/2024/07/nep-ngat-nuoc-5.webp','m',60000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(16,1,'NNT-016','Nẹp nhựa chống trượt cầu thang','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-nhua-trong-tron-a-5.webp','m',50000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(17,1,'NNT-017','Nẹp bán nguyệt D40','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-nhom-D40-3.webp','m',144000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(18,1,'NNT-018','Nẹp U Nhôm 12mm','','https://svietdecor.com/wp-content/uploads/2024/06/Nep-Nhom-U12.5mm-a1.webp','m',36000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(19,1,'NNT-019','Nẹp Nhôm U10 mm','','https://svietdecor.com/wp-content/uploads/2024/06/U10-mm-nhom-a2.webp','m',33000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(20,1,'NNT-020','Nẹp Nhôm V30','','https://svietdecor.com/wp-content/uploads/2024/06/Nep-Nhom-V30-4.webp','m',50000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(21,1,'NNT-021','Nẹp Khe Co Giãn MP120','Tải tài liệu kỹ thuật nẹp khe co giãn tại đây','https://svietdecor.com/wp-content/uploads/2024/06/Nep-Khe-Co-Gian-MP120.webp','m',225000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(22,1,'NNT-022','Nẹp Nhôm Chống Trượt NLP25','Tải tài liệu kỹ thuật nẹp nhôm chống trượt ở đây','https://svietdecor.com/wp-content/uploads/2024/05/Nep-Nhom-Chong-Truot-NLP25-20.webp','m',98000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(23,1,'NNT-023','Nẹp Nhôm Chống Trượt NLP20','Tải tài liệu kỹ thuật nẹp nhôm chống trượt ở đây','https://svietdecor.com/wp-content/uploads/2024/05/NLP20-sviet-3.webp','m',92000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(24,1,'NNT-024','Nẹp Nhôm V10','','https://svietdecor.com/wp-content/uploads/2024/05/Nep-Nhom-V10-1cm-2.webp','m',26000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(25,1,'NNT-025','Len Chân Tường DCP60','Tải tài liệu kỹ thuật nẹp len chân tường DCP 60-80','https://svietdecor.com/wp-content/uploads/2024/03/DCP60-2.webp','m',118000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(26,1,'NNT-026','Nẹp Nhôm Kết Thúc Sàn Gỗ MF12','','https://svietdecor.com/wp-content/uploads/2024/01/MF12-3.webp','m',56000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(27,1,'NNT-027','Nẹp Nhôm U7-11 mm','','https://svietdecor.com/wp-content/uploads/2023/11/Nep-Nhom-U7-11-mm-15925-1.webp','m',32000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(28,1,'NNT-028','Nẹp Nhôm U3 mm','','https://svietdecor.com/wp-content/uploads/2023/11/U5-10mm-nhom-2.webp','m',40000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(29,1,'NNT-029','Nẹp Nhôm Góc Trong MC6.8','','https://svietdecor.com/wp-content/uploads/2023/10/Nep-nhom-MC6.8-1.webp','m',32000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(30,1,'NNT-030','Nẹp Nhôm Góc Ngoài MY10.3','','https://svietdecor.com/wp-content/uploads/2023/10/Nep-nhom-goc-ngoai-my10.3-2.webp','m',83000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(31,1,'NNT-031','Nẹp nhôm vân gỗ – Nẹp nhôm giả gỗ','','https://svietdecor.com/wp-content/uploads/2023/09/nep-nhom-van-go.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(32,1,'NNT-032','Nẹp Nhôm U3X3 mm','','https://svietdecor.com/wp-content/uploads/2024/07/nep-nhom-u5mm.webp','m',37000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(33,1,'NNT-033','Nẹp Nhôm U50 mm','','https://svietdecor.com/wp-content/uploads/2023/07/nep-nhom-chu-u50mm.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(34,1,'NNT-034','Nẹp nhôm chữ H','','https://svietdecor.com/wp-content/uploads/2023/07/nep-nhom-chu-h-2.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(35,1,'NNT-035','Nẹp nhôm nối tấm Polycarbonate','','https://svietdecor.com/wp-content/uploads/2023/07/nep-nhom-noi-tam-polycarbonate.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(36,1,'NNT-036','Nẹp Chênh Cốt NOP','Tải tài liệu kỹ thuật nẹp nhôm chống trượt ở đây','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Chenh-Cot-NOP-1-2.webp','m',148000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(37,1,'NNT-037','Nẹp Nhôm MF9 – Nẹp Kết Thúc Sàn','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-nhom-ket-thuc-MF9-5.webp','m',52000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(38,1,'NNT-038','Nẹp Nhôm Bo Cánh Tủ U18.8','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Nhom-U18.8mm-3.webp','m',39000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(39,1,'NNT-039','Nẹp Khe Co Giãn 0405','Tải tài liệu kỹ thuật nẹp khe co giãn tại đây','https://svietdecor.com/wp-content/uploads/2023/03/nep-khe-co-gian-0405.webp','m',616000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(40,1,'NNT-040','Nẹp Khe Co Giãn L38x89','Tải tài liệu kỹ thuật nẹp khe co giãn tại đây','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Khe-Co-Gian-L38x89-5.webp','m',186000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(41,1,'NNT-041','Nẹp Khe Co Giãn MP80','Tải tài liệu kỹ thuật nẹp khe co giãn tại đây','https://svietdecor.com/wp-content/uploads/2023/03/MP80-nhom-1.webp','m',150000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(42,1,'NNT-042','Nẹp Chống Trượt NCP','Tải tài liệu kỹ thuật nẹp nhôm chống trượt ở đây','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Chong-Truot-NCP-1-1.webp','m',92000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(43,1,'NNT-043','Nẹp Nhôm Góc Tường Ngoài OC12.5','','https://svietdecor.com/wp-content/uploads/2023/03/nep-goc-oc12.5.webp','m',50000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(44,1,'NNT-044','Nẹp Nhôm Góc Vuông D10','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Nhom-Goc-Vuong-D10-10.webp','m',45000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(45,1,'NNT-045','Nẹp Góc YL12','','https://svietdecor.com/wp-content/uploads/2023/03/YL-12-nhom-1.webp','m',38000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(46,1,'NNT-046','Nẹp Nhôm Góc Gạch YL10','','https://svietdecor.com/wp-content/uploads/2023/03/YL-10-nhom-1.webp','m',32000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(47,1,'NNT-047','Nẹp Nhôm Bo Góc Tròn YC12','','https://svietdecor.com/wp-content/uploads/2023/03/YC12-nhom-1.webp','m',41000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(48,1,'NNT-048','Nẹp Góc YC10','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Goc-YC10-a1.webp','m',38000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(49,1,'NNT-049','Nẹp nhôm LMB30','','https://svietdecor.com/wp-content/uploads/2023/03/LMB30-nhom-b-1.webp','m',45000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(50,1,'NNT-050','Nẹp Nhôm LMB19.8','','https://svietdecor.com/wp-content/uploads/2023/03/nep-nhom-l8x20-6.webp','m',39000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(51,1,'NNT-051','Nẹp Nhôm L10x30','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Nhom-L10x30-b-1.webp','m',45000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(52,1,'NNT-052','Nẹp nhôm L3x20','','https://svietdecor.com/wp-content/uploads/2023/03/nep-nhom-l3x20-7.webp','m',33000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(53,1,'NNT-053','Nẹp Nhôm T40 mm','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Nhom-T40mm-1-2.webp','m',70000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(54,1,'NNT-054','Nẹp nhôm T12 mm','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-nhom-T12-mm-4.webp','m',25000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(55,1,'NNT-055','Nẹp Nhôm V40','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Nhom-V40-2.webp','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(56,1,'NNT-056','Nẹp Nhôm V25','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Nhom-V25-1-scaled.webp','m',45000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(57,1,'NNT-057','Len chân tường DCP80','Tải tài liệu kỹ thuật nẹp len chân tường DCP 60-80','https://svietdecor.com/wp-content/uploads/2023/03/LEN80-2-1.webp','m',150000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(58,1,'NNT-058','Nẹp Sập Nhôm Kính Cường lực, Đế Nẹp nhôm 2 mặt','','https://svietdecor.com/wp-content/uploads/2023/02/Nep-goc-nhua-mat-trang.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(59,1,'NNT-059','Nẹp bán nguyệt D60','','https://svietdecor.com/wp-content/uploads/2022/07/Nep-nhom-D60-2.webp','m',106000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(60,1,'NNT-060','Nẹp Nhôm V20','','https://svietdecor.com/wp-content/uploads/2022/03/Nep-Nhom-V20-1-1.webp','m',38000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(61,1,'NNT-061','Nẹp Nhôm V15','','https://svietdecor.com/wp-content/uploads/2022/03/Nep-Nhom-V15-6.webp','m',36000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(62,1,'NNT-062','Nẹp nhôm kết thúc thảm YC','','https://svietdecor.com/wp-content/uploads/2021/12/nep-tham-YC.webp','m',68000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(63,1,'NNT-063','Nẹp nhôm nối thảm chữ Z','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-nhom-noi-tham-chu-Z-14.webp','m',75000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(64,1,'NNT-064','Nẹp Nhôm U20 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-nhom-u20mm.webp','m',48000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(65,1,'NNT-065','Nẹp Nhôm T6 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Nhom-T6-mm-7.webp','m',21000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(66,1,'NNT-066','Nẹp Nhôm T30 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Nhom-T30-5-1.webp','m',45000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(67,1,'NNT-067','Nẹp Nhôm T14 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Nhom-T14-mm-4.webp','m',36000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(68,1,'NNT-068','Nẹp Nhôm T8 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-nhom-T8-mm.webp','m',25000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(69,1,'NNT-069','Nẹp Nhôm T10 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Nhom-Chu-T10-mm-1-1.webp','m',30000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(70,1,'NNT-070','Nẹp Nhôm T25 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Nhom-T25-mm-2-2.webp','m',42000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(71,1,'NNT-071','Nẹp Nhôm T20 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-nhom-T20-8.webp','m',39000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(72,1,'NNT-072','Nẹp Nhôm L10x20','','https://svietdecor.com/wp-content/uploads/2021/12/z5681048182858_71a9ccbd66e8f1c879062fcc09fe5044.webp','m',39000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(73,1,'NNT-073','Nẹp nhôm chống trượt NLP12','Tải tài liệu kỹ thuật nẹp nhôm chống trượt ở đây','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Nhom-Chong-Truot-NLP12-0111-6.webp','m',90000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(74,1,'NNT-074','Nẹp Nhôm Chống Trượt NLP8.0','Tải tài liệu kỹ thuật nẹp nhôm chống trượt ở đây','https://svietdecor.com/wp-content/uploads/2021/12/NLP8-1-1.webp','m',86000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(75,1,'NNT-075','Nẹp mũi bậc cầu thang TL30','Tải tài liệu kỹ thuật nẹp nhôm chống trượt ở đây','https://svietdecor.com/wp-content/uploads/2021/12/Nep-mui-bac-cau-thang-TL30-n1.webp','m',118000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(76,2,'NIT-001','Nẹp F25 inox 304','','https://svietdecor.com/wp-content/uploads/2025/07/Nep-F25-inox-304-6.webp','m',150000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(77,2,'NIT-002','Nẹp inox 201 T20mm','','https://svietdecor.com/wp-content/uploads/2025/06/Nep-inox-201-T20mm-2.webp','m',39000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(78,2,'NIT-003','Nẹp inox 201 T15mm','','https://svietdecor.com/wp-content/uploads/2025/06/Nep-inox-201-T15mm-2.webp','m',32000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(79,2,'NIT-004','Nẹp inox 201 V20mm','','https://svietdecor.com/wp-content/uploads/2025/06/Nep-inox-201-V20mm-2.webp','m',30000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(80,2,'NIT-005','Nẹp inox 201 V15mm','','https://svietdecor.com/wp-content/uploads/2025/06/Nep-inox-201-V15mm-2.webp','m',26000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(81,2,'NIT-006','Nẹp inox 201 T10mm','','https://svietdecor.com/wp-content/uploads/2025/06/Nep-inox-201-T10mm-2.webp','m',30000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(82,2,'NIT-007','Nẹp Lập Là Inox 100mm – LA100','Nẹp lập là inox 100mm với kích thước mặt cắt là 100mm x 0.3mm chuyên dùng trong thi công công trình thương mại, showroom, mặt dựng lớn. Chất liệu Inox 201 chống ăn mòn cao, bền bỉ theo thời gian. Màu sắc: Trắng gương, vàng gương, đen dương, vàng hồng.','https://svietdecor.com/wp-content/uploads/2025/06/La-cuon-inox-LA100-1.webp','m',59000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(83,2,'NIT-008','Nẹp Lập Là Inox 80mm – LA80','Nẹp lập là inox 80mm với kích thước mặt cắt 80mm x 0.3mm; cuộn dài 50m. Dùng cho công trình cần che phủ mảng lớn như mặt dựng, bảng hiệu hoặc khu vực ốp lát nội thất kích thước lớn. Chất liệu Inox 201 đảm bảo độ sáng bóng và bền màu theo thời gian.','https://svietdecor.com/wp-content/uploads/2025/06/La-cuon-inox-LA80-1.webp','m',49000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(84,2,'NIT-009','Nẹp Lập Là Inox 50mm – LA50','Nẹp lập là inox 50mm có chiều dài mặt cắt 50mm, độ dày 0.3mm; cuộn dài 50m. Màu sắc: Trắng gương, vàng gương, đen dương, vàng hồng. Nẹp dùng tạo điểm nhấn cho các mảng tường, che mép gạch/ đá/ gỗ giúp tăng thẩm mỹ cho công trình.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-Lap-La-Inox-50mm-1.webp','m',28000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(85,2,'NIT-010','Nẹp Lập Là Inox 40mm – LA40','Nẹp lập là inox 40mm làm từ chất liệu Inox 201. Kích thước mặt cắt 40mm X 0.3mm, cuộn dài 50m. Màu sắc: Trắng gương, vàng gương, đen dương, vàng hồng. Nẹp dùng để trang trí nội thất, vách tường, sàn nhà, cửa,... giúp tăng tính thẩm mỹ cho công trình.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-Lap-La-Inox-40mm-2.webp','m',25000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(86,2,'NIT-011','Nẹp Lập Là Inox 30mm – LA30','Nẹp lập là inox 30mm với kích thước mặt cắt 30mm x 0.3mm, cuộn dài 5m. Màu sắc: Trắng gương, vàng gương, đen dương, vàng hồng. Nẹp được dùng để tạo các đường nét vàng gương trang trí cho các công trình giúp tăng tính thẩm mỹ và độ hoàn thiện.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-Lap-La-Inox-30mm-3.webp','m',44000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(87,2,'NIT-012','Nẹp Lập Là Inox 20mm – LA20','Nẹp lập là inox 20 có kích thước mặt cắt rộng là 20mm, dày 0.3mm; cuộn dài 5m. Nẹp được dùng trong các vị trí như viền tường, cạnh cánh tủ hoặc viền nẹp nội thất. Chất liệu inox 201, sản phẩm có độ bền cao, không gỉ sét.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-Lap-La-Inox-20mm-3.webp','m',32000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(88,2,'NIT-013','Nẹp Lập Là Inox 10mm – LA10','Nẹp lập là inox 10mm với màu sắc: Trắng gương, vàng gương, đen dương, vàng hồng Kích thước mặt cắt: 10mm x 0.3mm; cuộn dài 5m.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-Lap-La-Inox-10mm-3.webp','m',28000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(89,2,'NIT-014','Nẹp Inox Chữ L5x25 mm','','https://svietdecor.com/wp-content/uploads/2024/07/nep-inox-chu-L5x25mm-2.webp','m',65000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(90,2,'NIT-015','Nẹp Inox 304 V35 mm','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-inox-304-V35-3.webp','m',96000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(91,2,'NIT-016','Nẹp Inox 304 T10 mm','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Inox-T10-3.webp','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(92,2,'NIT-017','Nẹp Len Chân Tường Inox Kiểu Vuông','','https://svietdecor.com/wp-content/uploads/2024/06/Len-chan-tuong-inox-vuong-2.7.25-8.webp','m',200000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(93,2,'NIT-018','Nẹp Thảm Inox, Nẹp chặn thảm inox','Nẹp thảm inox là một phụ kiện được sử dụng để bảo vệ và trang trí các cạnh thảm, giúp tăng tính thẩm mỹ và độ bền cho thảm.','https://svietdecor.com/wp-content/uploads/2023/10/nep-tham-inox.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(94,2,'NIT-019','Nẹp Inox Sàn Gỗ','Nẹp inox sàn gỗ là phụ kiện được sử dụng để che chắn và bảo vệ các đường viền của sàn gỗ, giúp tăng tính thẩm mỹ và độ bền cho sàn.','https://svietdecor.com/wp-content/uploads/2023/09/nep-inox-san-go.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(95,2,'NIT-020','Nẹp Inox Kính Cường Lực','','https://svietdecor.com/wp-content/uploads/2023/08/nep-inox-kinh-cuong-luc.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(96,2,'NIT-021','Nẹp INOX Bán Nguyệt (Nẹp điện inox)','','https://svietdecor.com/wp-content/uploads/2023/08/INOX-BAN-NGUYET-5.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(97,2,'NIT-022','Len chân tường Inox (Nẹp Inox Chân Tường)','','https://svietdecor.com/wp-content/uploads/2023/07/nep-inox-chan-tuong.jpg','m',200000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(98,2,'NIT-023','Nẹp Vát 10×20 mm','','https://svietdecor.com/wp-content/uploads/2023/06/Nep-Vat-10x20-2.webp','m',58000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(99,2,'NIT-024','Nẹp Inox ốp lát YC','','https://svietdecor.com/wp-content/uploads/2023/03/Op-lat-YC-inox-3.webp','m',100000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(100,2,'NIT-025','Nẹp Inox Ốp Lát GD','','https://svietdecor.com/wp-content/uploads/2023/03/NEP-INOX-OP-LAT-GD.webp','m',132000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(101,2,'NIT-026','Nẹp Inox Ốp Lát GV','','https://svietdecor.com/wp-content/uploads/2023/03/NEP-INOX-OP-LAT-GV-3.webp','m',112000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(102,2,'NIT-027','Nẹp Inox U11 mm','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-Inox-U11.webp','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(103,2,'NIT-028','Nẹp Inox U6 mm','','https://svietdecor.com/wp-content/uploads/2023/03/Nep-inox-U6-3.webp','m',78000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(104,2,'NIT-029','Nẹp Inox U4 mm','','https://svietdecor.com/wp-content/uploads/2023/03/U4-INOX-201-4.webp','m',73000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(105,2,'NIT-030','Nẹp Inox Chữ L25x10 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-inox-chu-L25x10-4.webp','m',83000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(106,2,'NIT-031','Nẹp Inox 304 T25 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Inox-304-T25-1.webp','m',93000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(107,2,'NIT-032','Nẹp Inox 304 T8 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Inox-T8-2-1.webp','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(108,2,'NIT-033','Nẹp Inox 304 T15 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-inox-304-T15-10.webp','m',83000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(109,2,'NIT-034','Nẹp Inox 304 T6 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-inox-t8mm-4.webp','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(110,2,'NIT-035','Nẹp Inox 304 T30 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Inox-T30-3.webp','m',112000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(111,2,'NIT-036','Nẹp Inox 304 T20 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Inox-T20.webp','m',90000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(112,2,'NIT-037','Nẹp Inox U3 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-inox-u4mm-3.webp','m',75000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(113,2,'NIT-038','Nẹp Inox U5 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-inox-u4mm-3.webp','m',78000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(114,2,'NIT-039','Nẹp Inox U8 mm','','https://svietdecor.com/wp-content/uploads/2023/03/nep-inox-u6mm-3-1.webp','m',78000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(115,2,'NIT-040','Nẹp Inox U10 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Inox-U10-mm-1.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(116,2,'NIT-041','Nẹp Kính Inox Chữ U','','https://svietdecor.com/wp-content/uploads/2021/12/1x1-trang-14-scaled.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(117,2,'NIT-042','Nẹp Inox U12 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Inox-U12mm-3.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(118,2,'NIT-043','Nẹp Inox U15 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-inox-U20mm-4.webp','m',86000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(119,2,'NIT-044','Nẹp Inox U20 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-Inox-U20-2.webp','m',86000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(120,2,'NIT-045','Nẹp Inox U25 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-inox-U20mm-4.webp','m',86000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(121,2,'NIT-046','Nẹp Inox 304 V15 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-inox-304-V15-4.webp','m',61000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(122,2,'NIT-047','Nẹp Inox 304 V10 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-inox-304-v10-2.webp','m',45000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(123,2,'NIT-048','Nẹp Inox 304 V30 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-inox-304-V30.webp','m',96000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(124,2,'NIT-049','Nẹp Inox 304 V20 mm','','https://svietdecor.com/wp-content/uploads/2021/12/Nep-inox-304-V20-2-1.webp','m',70000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(125,2,'NIT-050','Nẹp Inox 304 V25 mm','','https://svietdecor.com/wp-content/uploads/2022/03/nep-inox-304-v20-6.webp','m',83000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(126,2,'NIT-051','Nẹp Inox La Cuộn Đủ Kích Thước','Các loại nẹp la inox cuộn độ rộng mặt cắt gồm: 10mm, 20mm, 30mm, 40mm, 50mm, 80mm, 100mm,... Nẹp la cuộn có độ dày thường là 0.3mm; chiều dài cuộn từ 5m - 50m hoặc theo đơn đặt hàng sản xuất. Có hai loại la cuộn gồm loại có băng keo dán sẵn phía mặt sau nẹp (loại mặt cắt 10mm, 20mm, 30mm) và loại không có phải dùng keo chuyên dụng để dán thi công. Nẹp có đủ các màu sắc: Trắng gương, vàng gương, đen dương, vàng hồng.','https://svietdecor.com/wp-content/uploads/2021/12/Nep-inox-la-cuon.webp','m',28000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(127,2,'NIT-052','La Inox 304 5mm – Tạo chỉ','Nẹp la inox 304 5mm dùng để tạo chỉ trang trí trên các bề mặt sàn, tường,... Nẹp có đủ các kích thước chiều dài mặt cắt và độ dày từ 5mm, chiều dài theo đặt hàng sản xuất.','https://svietdecor.com/wp-content/uploads/2021/12/1x1-trang-15-scaled.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(128,3,'NNH-001','Nẹp nhựa JW – U1210 – Nẹp bọc viền, chỉ âm thạch cao','','https://svietdecor.com/wp-content/uploads/2026/02/Nep-nhua-JW-U1210-1.webp','m',21000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(129,3,'NNH-002','Nẹp nhựa JW – U105 – Nẹp bọc viền, chỉ âm thạch cao','','https://svietdecor.com/wp-content/uploads/2026/02/Nep-nhua-JW-U105-a1.webp','m',21000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(130,3,'NNH-003','Nẹp nhựa JW – UT (JTC5.0) – Nẹp U ron thạch cao','','https://svietdecor.com/wp-content/uploads/2026/02/Nep-nhua-JW-UT-1.webp','m',25000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(131,3,'NNH-004','Nẹp nhựa JW – M203020 – Nẹp trần thạch cao giật cấp','','https://svietdecor.com/wp-content/uploads/2026/02/Nep-nhua-JW-M203020-1.webp','m',28000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(132,3,'NNH-005','Nẹp nhựa JW – M201010 – Nẹp trần thạch cao giật cấp','','https://svietdecor.com/wp-content/uploads/2026/02/Nep-nhua-JW-M201010-1b.webp','m',25000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(133,3,'NNH-006','Nẹp nhựa JW-D001 | Nẹp góc vòm, góc tường cong','','https://svietdecor.com/wp-content/uploads/2026/02/Nep-nhua-JW-D001-1a.webp','m',22000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(134,3,'NNH-007','Nẹp góc thạch cao V10x20','','https://svietdecor.com/wp-content/uploads/2026/01/Nep-Goc-Thach-Cao-V10x20-161262.webp','m',6000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(135,3,'NNH-008','Nẹp chỉ ngắt nước dưới NAN DC','Nẹp chỉ ngắt nước dưới NAN DC với chất liệu nhựa PVC nguyên sinh; Kích thước mặt cắt 47mm x 21mm, chiều dài 2.5m. Được dùng trong hạng mục tạo chỉ ngắt nước dưới.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-chi-ngat-nuoc-NAN-DC-4.webp','m',20000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(136,3,'NNH-009','Nẹp khe co giãn sàn bê tông','Nẹp khe co giãn sàn bê tông là sản phẩm nẹp trang trí được làm từ chất liệu nhựa PVC nguyên sinh, kích thước mặt cắt với chiều dài đáy 30mm x 8mm, sản phẩm dùng để tạo khe co giãn cho các sân, đường bê tông có diện tích lớn.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-khe-co-gian-san-be-tong-4.webp','m',36000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(137,3,'NNH-010','Nẹp vát góc bê tông T30','Nẹp vát góc bê tông T30 có độ dài thanh là 2.5 mét, mặt cắt với chiều dài đáy là 28mm và 2 cạnh bên là 20mm.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-vat-goc-be-tong-T30-3.webp','m',22000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(138,3,'NNH-011','Nẹp vát góc bê tông T20','Nẹp vát góc bê tông T20 có độ dài thanh là 2.5 mét, mặt cắt với chiều dài đáy là 20mm và 2 cạnh bên là 14mm. Nẹp vát góc bê tông còn được gọi là Chamfer (nẹp tam giác).','https://svietdecor.com/wp-content/uploads/2025/06/Nep-vat-goc-be-tong-T20-3.webp','m',16000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(139,3,'NNH-012','Nẹp nhựa bo góc ngoài YS10','SViệt Decor cung cấp nẹp nhựa ốp lát chính hãng, nẹp được làm bằng chất liệu nhựa PVC nguyên sinh bền chắc giúp bảo vệ góc ốp lát không bị sứt mẻ khi có va chạm.','https://svietdecor.com/wp-content/uploads/2025/06/Nep-bo-goc-ngoai-YS10-3.webp','m',16000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(140,3,'NNH-013','Nẹp Ron Âm Trần Thạch Cao U12','','https://svietdecor.com/wp-content/uploads/2024/09/14-Nep-Ron-Am-Tran-Thach-Cao-U12-a-1.webp','m',20730.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(141,3,'NNH-014','Nẹp Nhựa Sàn Gỗ Chữ T','','https://svietdecor.com/wp-content/uploads/2024/07/1x1-trang-19-scaled.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(142,3,'NNH-015','Nẹp Mũi Bậc Cầu Thang Nhựa Giả Gỗ','','https://svietdecor.com/wp-content/uploads/2024/06/nep-mui-bac-san-go-3-scaled.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(143,3,'NNH-016','Nẹp Góc Thạch Cao V20x20','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-goc-thach-cao-V20X20.webp','m',6000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(144,3,'NNH-017','Nẹp Góc Thạch Cao V30','','https://svietdecor.com/wp-content/uploads/2024/07/12-Nep-Goc-Thach-Cao-V30-a-1.webp','m',10000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(145,3,'NNH-018','Nẹp Trát Góc Tường TG10 Không Mũ','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Trat-Goc-Tuong-TG10-Khong-Mu-3.webp','m',7040.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(146,3,'NNH-019','Nẹp Tách Khe Vật Liệu F10','','https://svietdecor.com/wp-content/uploads/2024/07/1-Nep-Tach-Khe-Vat-Lieu-F10.webp','m',21090.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(147,3,'NNH-020','Nẹp Khe Trần Thạch Cao Z10','','https://svietdecor.com/wp-content/uploads/2024/07/11-Nep-Khe-Tran-Thach-Cao-Z10-a-1.webp','m',8800.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(148,3,'NNH-021','Nẹp Trát Góc Tường TG10V Có Mũ','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Trat-Goc-Tuong-TG10V-Co-Mu-1.webp','m',7360.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(149,3,'NNH-022','Nẹp Tách Khe Vật Liệu DF 10','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Tach-Khe-Vat-Lieu-DF10-1.webp','m',17600.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(150,3,'NNH-023','Nẹp Nhựa Ngắt Nước Dưới NAN-D','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Ngat-Nuoc-Duoi-2.webp','m',17600.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(151,3,'NNH-024','Nẹp Nhựa Ngắt Nước Trên NAN-T','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Ngat-Nuoc-Tren-1.webp','m',20000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(152,3,'NNH-025','Nẹp Mốc Trát Tường T10','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Moc-Trat-Tuong-T10-1.webp','m',7680.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(153,3,'NNH-026','Nẹp Góc Âm Thạch Cao 20×20','','https://svietdecor.com/wp-content/uploads/2024/07/10-Nep-Goc-Am-Thach-Cao-a-2.webp','m',9450.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(154,3,'NNH-027','Nẹp Ron Âm Trần Thạch Cao U22','','https://svietdecor.com/wp-content/uploads/2024/07/15-Nep-Ron-Am-Tran-Thach-Cao-U22-a-2.webp','m',30180.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(155,3,'NNH-028','Nẹp Chặn Vữa VL','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Chan-Vua-1.webp','m',10800.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(156,3,'NNH-029','Nẹp Chỉ Âm Tường U20','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Chi-Am-Tuong-U20-4.webp','m',12000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(157,3,'NNH-030','Nẹp Chỉ Âm Tường U15','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-Chi-Am-Tuong-U15-3.webp','m',11200.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(158,3,'NNH-031','Nẹp nhựa chống trượt cầu thang','','https://svietdecor.com/wp-content/uploads/2024/07/Nep-nhua-trong-tron-a-5.webp','m',50000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(159,3,'NNH-032','Nẹp Nhựa Chữ F Sàn Gỗ','','https://svietdecor.com/wp-content/uploads/2024/07/1x1-trang-17-scaled.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(160,3,'NNH-033','Nẹp Chỉ Âm Tường U2010','','https://svietdecor.com/wp-content/uploads/2024/06/Nep-Chi-Am-Tuong-U2010-2.webp','m',12000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(161,3,'NNH-034','Nẹp nhựa góc vuông','','https://svietdecor.com/wp-content/uploads/2023/10/nep-nhua-goc-vuong.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(162,3,'NNH-035','Nẹp nhựa bo góc','Nẹp nhựa bo góc là một loại nẹp được sử dụng để bảo vệ và trang trí các góc cạnh của tường, sàn, bậc cầu thang và các vị trí khác trong công trình xây dựng.','https://svietdecor.com/wp-content/uploads/2023/10/nep-nhua-bo-goc.jpg','m',16000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(163,3,'NNH-036','Nẹp nhựa chân tường, phào nhựa ốp chân tường, sàn nhựa','','https://svietdecor.com/wp-content/uploads/2023/10/nep-nhua-chan-tuong-1.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(164,3,'NNH-037','Nẹp nhựa chữ V, nẹp nhựa PVC chữ V ốp góc','','https://svietdecor.com/wp-content/uploads/2023/09/nep-nhua-chu-v.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(165,3,'NNH-038','Nẹp Sàn Nhựa, Nẹp Kết Thúc Sàn Nhựa','','https://svietdecor.com/wp-content/uploads/2023/09/nep-ket-thuc-san-nhua.jpg','m',80000.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(166,3,'NNH-039','Nẹp Nhựa Chữ L của Sàn Gỗ','','https://svietdecor.com/wp-content/uploads/2023/03/1x1-trang-18-scaled.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(167,3,'NNH-040','Đế Nhựa','','https://svietdecor.com/wp-content/uploads/2023/03/de-nhua.webp','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(168,4,'NDT-001','Nẹp đồng T10 gân','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-4-510x339-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(169,4,'NDT-002','Nẹp chỉ đồng','','https://svietdecor.com/wp-content/uploads/2021/12/ne1bab9p-c491e1bb93ng-che1bbaf-t-trang-trc3ad-cao-ce1baa5p-c491e1bab9p-gic3a1-re1babb-510x512-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(170,4,'NDT-003','Nẹp Đồng Bậc Cầu Thang Chữ L','','https://svietdecor.com/wp-content/uploads/2024/01/nep-dong-chong-truot-cau-thang.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(171,4,'NDT-004','Nẹp Đồng T Chống Trơn','','https://svietdecor.com/wp-content/uploads/2023/03/nep-t-chong-tron.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(172,4,'NDT-005','Nẹp đồng sàn gỗ chữ T','','https://svietdecor.com/wp-content/uploads/2023/09/nep-dong-san-go.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(173,4,'NDT-006','Nẹp Đồng U5','','https://svietdecor.com/wp-content/uploads/2023/07/nep-dong-chu-u5-tron.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(174,4,'NDT-007','Nẹp Đồng L25 Trơn','','https://svietdecor.com/wp-content/uploads/2023/07/nep-dong-chu-l25-tron.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(175,4,'NDT-008','Nẹp Đồng Chữ F33','','https://svietdecor.com/wp-content/uploads/2021/12/ne1bab9p-c491e1bb93ng-che1bbaf-f-trang-trc3ad-cao-ce1baa5p-c491e1bab9p-gic3a1-re1babb-510x340-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(176,4,'NDT-009','Nẹp Đồng V15 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-v-trang-tri-cao-cap-ben-dep-gia-re-3-510x340-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(177,4,'NDT-010','Nẹp Đồng V20 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-v-trang-tri-cao-cap-ben-dep-gia-re-1-510x340-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(178,4,'NDT-011','Nẹp Đồng V30 mm','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-v-trang-tri-cao-cap-ben-dep-gia-re-2-510x383-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(179,4,'NDT-012','Nẹp Đồng T30 Gân','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-6-510x340-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(180,4,'NDT-013','Nẹp Đồng T15 Gân','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-8-510x486-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(181,4,'NDT-014','Nẹp Đồng T15 Trơn','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-7-510x340-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(182,4,'NDT-015','Nẹp Đồng T20 Trơn','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-9-510x339-2.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(183,4,'NDT-016','Nẹp Đồng T10 Trơn','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-9-510x339-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(184,4,'NDT-017','Nẹp Đồng T8 Thẳng','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-1-510x510-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(185,4,'NDT-018','Nẹp Đồng T20 Gân','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-3-510x340-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(186,4,'NDT-019','Nẹp Đồng T30 Trơn','','https://svietdecor.com/wp-content/uploads/2021/12/nep-dong-chu-t-trang-tri-cao-cap-dep-gia-re-5-510x340-1.jpg','m',0.00,50,1,'2026-03-21 17:54:28','2026-03-21 17:54:28');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `type` enum('IMPORT','EXPORT','ADJUST','INVENTORY_CHECK') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `before_quantity` int NOT NULL DEFAULT '0',
  `after_quantity` int NOT NULL DEFAULT '0',
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` int DEFAULT NULL,
  `reference_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_product` (`product_id`),
  KEY `idx_type` (`type`),
  KEY `idx_reference` (`reference_type`,`reference_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `last_import_date` timestamp NULL DEFAULT NULL,
  `last_export_date` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_quantity` (`quantity`),
  CONSTRAINT `stocks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
INSERT INTO `stocks` VALUES (1,1,100,NULL,NULL,'2026-03-21 18:05:57'),(2,2,100,NULL,NULL,'2026-03-21 18:05:57'),(3,3,100,NULL,NULL,'2026-03-21 18:05:57'),(4,4,100,NULL,NULL,'2026-03-21 18:05:57'),(5,5,100,NULL,NULL,'2026-03-21 18:05:57'),(6,6,100,NULL,NULL,'2026-03-21 18:05:57'),(7,7,100,NULL,NULL,'2026-03-21 18:05:57'),(8,8,100,NULL,NULL,'2026-03-21 18:05:57'),(9,9,100,NULL,NULL,'2026-03-21 18:05:57'),(10,10,100,NULL,NULL,'2026-03-21 18:05:57'),(11,11,100,NULL,NULL,'2026-03-21 18:05:57'),(12,12,100,NULL,NULL,'2026-03-21 18:05:57'),(13,13,100,NULL,NULL,'2026-03-21 18:05:57'),(14,14,100,NULL,NULL,'2026-03-21 18:05:57'),(15,15,100,NULL,NULL,'2026-03-21 18:05:57'),(16,16,100,NULL,NULL,'2026-03-21 18:05:57'),(17,17,100,NULL,NULL,'2026-03-21 18:05:57'),(18,18,100,NULL,NULL,'2026-03-21 18:05:57'),(19,19,100,NULL,NULL,'2026-03-21 18:05:57'),(20,20,100,NULL,NULL,'2026-03-21 18:05:57'),(21,21,100,NULL,NULL,'2026-03-21 18:05:57'),(22,22,100,NULL,NULL,'2026-03-21 18:05:57'),(23,23,100,NULL,NULL,'2026-03-21 18:05:57'),(24,24,100,NULL,NULL,'2026-03-21 18:05:57'),(25,25,100,NULL,NULL,'2026-03-21 18:05:57'),(26,26,100,NULL,NULL,'2026-03-21 18:05:57'),(27,27,100,NULL,NULL,'2026-03-21 18:05:57'),(28,28,100,NULL,NULL,'2026-03-21 18:05:57'),(29,29,100,NULL,NULL,'2026-03-21 18:05:57'),(30,30,100,NULL,NULL,'2026-03-21 18:05:57'),(31,31,100,NULL,NULL,'2026-03-21 18:05:57'),(32,32,100,NULL,NULL,'2026-03-21 18:05:57'),(33,33,100,NULL,NULL,'2026-03-21 18:05:57'),(34,34,100,NULL,NULL,'2026-03-21 18:05:57'),(35,35,100,NULL,NULL,'2026-03-21 18:05:57'),(36,36,100,NULL,NULL,'2026-03-21 18:05:57'),(37,37,100,NULL,NULL,'2026-03-21 18:05:57'),(38,38,100,NULL,NULL,'2026-03-21 18:05:57'),(39,39,100,NULL,NULL,'2026-03-21 18:05:57'),(40,40,100,NULL,NULL,'2026-03-21 18:05:57'),(41,41,100,NULL,NULL,'2026-03-21 18:05:57'),(42,42,100,NULL,NULL,'2026-03-21 18:05:57'),(43,43,100,NULL,NULL,'2026-03-21 18:05:57'),(44,44,100,NULL,NULL,'2026-03-21 18:05:57'),(45,45,100,NULL,NULL,'2026-03-21 18:05:57'),(46,46,100,NULL,NULL,'2026-03-21 18:05:57'),(47,47,100,NULL,NULL,'2026-03-21 18:05:57'),(48,48,100,NULL,NULL,'2026-03-21 18:05:57'),(49,49,100,NULL,NULL,'2026-03-21 18:05:57'),(50,50,100,NULL,NULL,'2026-03-21 18:05:57'),(51,51,100,NULL,NULL,'2026-03-21 18:05:57'),(52,52,100,NULL,NULL,'2026-03-21 18:05:57'),(53,53,100,NULL,NULL,'2026-03-21 18:05:57'),(54,54,100,NULL,NULL,'2026-03-21 18:05:57'),(55,55,100,NULL,NULL,'2026-03-21 18:05:57'),(56,56,100,NULL,NULL,'2026-03-21 18:05:57'),(57,57,100,NULL,NULL,'2026-03-21 18:05:57'),(58,58,100,NULL,NULL,'2026-03-21 18:05:57'),(59,59,100,NULL,NULL,'2026-03-21 18:05:57'),(60,60,100,NULL,NULL,'2026-03-21 18:05:57'),(61,61,100,NULL,NULL,'2026-03-21 18:05:57'),(62,62,100,NULL,NULL,'2026-03-21 18:05:57'),(63,63,100,NULL,NULL,'2026-03-21 18:05:57'),(64,64,100,NULL,NULL,'2026-03-21 18:05:57'),(65,65,100,NULL,NULL,'2026-03-21 18:05:57'),(66,66,100,NULL,NULL,'2026-03-21 18:05:57'),(67,67,100,NULL,NULL,'2026-03-21 18:05:57'),(68,68,100,NULL,NULL,'2026-03-21 18:05:57'),(69,69,100,NULL,NULL,'2026-03-21 18:05:57'),(70,70,100,NULL,NULL,'2026-03-21 18:05:57'),(71,71,100,NULL,NULL,'2026-03-21 18:05:57'),(72,72,100,NULL,NULL,'2026-03-21 18:05:57'),(73,73,100,NULL,NULL,'2026-03-21 18:05:57'),(74,74,100,NULL,NULL,'2026-03-21 18:05:57'),(75,75,100,NULL,NULL,'2026-03-21 18:05:57'),(76,76,100,NULL,NULL,'2026-03-21 18:05:57'),(77,77,100,NULL,NULL,'2026-03-21 18:05:57'),(78,78,100,NULL,NULL,'2026-03-21 18:05:57'),(79,79,100,NULL,NULL,'2026-03-21 18:05:57'),(80,80,100,NULL,NULL,'2026-03-21 18:05:57'),(81,81,100,NULL,NULL,'2026-03-21 18:05:57'),(82,82,100,NULL,NULL,'2026-03-21 18:05:57'),(83,83,100,NULL,NULL,'2026-03-21 18:05:57'),(84,84,100,NULL,NULL,'2026-03-21 18:05:57'),(85,85,100,NULL,NULL,'2026-03-21 18:05:57'),(86,86,100,NULL,NULL,'2026-03-21 18:05:57'),(87,87,100,NULL,NULL,'2026-03-21 18:05:57'),(88,88,100,NULL,NULL,'2026-03-21 18:05:57'),(89,89,100,NULL,NULL,'2026-03-21 18:05:57'),(90,90,100,NULL,NULL,'2026-03-21 18:05:57'),(91,91,100,NULL,NULL,'2026-03-21 18:05:57'),(92,92,100,NULL,NULL,'2026-03-21 18:05:57'),(93,93,100,NULL,NULL,'2026-03-21 18:05:57'),(94,94,100,NULL,NULL,'2026-03-21 18:05:57'),(95,95,100,NULL,NULL,'2026-03-21 18:05:57'),(96,96,100,NULL,NULL,'2026-03-21 18:05:57'),(97,97,100,NULL,NULL,'2026-03-21 18:05:57'),(98,98,100,NULL,NULL,'2026-03-21 18:05:57'),(99,99,100,NULL,NULL,'2026-03-21 18:05:57'),(100,100,100,NULL,NULL,'2026-03-21 18:05:57'),(101,101,100,NULL,NULL,'2026-03-21 18:05:57'),(102,102,100,NULL,NULL,'2026-03-21 18:05:57'),(103,103,100,NULL,NULL,'2026-03-21 18:05:57'),(104,104,100,NULL,NULL,'2026-03-21 18:05:57'),(105,105,100,NULL,NULL,'2026-03-21 18:05:57'),(106,106,100,NULL,NULL,'2026-03-21 18:05:57'),(107,107,100,NULL,NULL,'2026-03-21 18:05:57'),(108,108,100,NULL,NULL,'2026-03-21 18:05:57'),(109,109,100,NULL,NULL,'2026-03-21 18:05:57'),(110,110,100,NULL,NULL,'2026-03-21 18:05:57'),(111,111,100,NULL,NULL,'2026-03-21 18:05:57'),(112,112,100,NULL,NULL,'2026-03-21 18:05:57'),(113,113,100,NULL,NULL,'2026-03-21 18:05:57'),(114,114,100,NULL,NULL,'2026-03-21 18:05:57'),(115,115,100,NULL,NULL,'2026-03-21 18:05:57'),(116,116,100,NULL,NULL,'2026-03-21 18:05:57'),(117,117,100,NULL,NULL,'2026-03-21 18:05:57'),(118,118,100,NULL,NULL,'2026-03-21 18:05:57'),(119,119,100,NULL,NULL,'2026-03-21 18:05:57'),(120,120,100,NULL,NULL,'2026-03-21 18:05:57'),(121,121,100,NULL,NULL,'2026-03-21 18:05:57'),(122,122,100,NULL,NULL,'2026-03-21 18:05:57'),(123,123,100,NULL,NULL,'2026-03-21 18:05:57'),(124,124,100,NULL,NULL,'2026-03-21 18:05:57'),(125,125,100,NULL,NULL,'2026-03-21 18:05:57'),(126,126,100,NULL,NULL,'2026-03-21 18:05:57'),(127,127,100,NULL,NULL,'2026-03-21 18:05:57'),(128,128,100,NULL,NULL,'2026-03-21 18:05:57'),(129,129,100,NULL,NULL,'2026-03-21 18:05:57'),(130,130,100,NULL,NULL,'2026-03-21 18:05:57'),(131,131,100,NULL,NULL,'2026-03-21 18:05:57'),(132,132,100,NULL,NULL,'2026-03-21 18:05:57'),(133,133,100,NULL,NULL,'2026-03-21 18:05:57'),(134,134,100,NULL,NULL,'2026-03-21 18:05:57'),(135,135,100,NULL,NULL,'2026-03-21 18:05:57'),(136,136,100,NULL,NULL,'2026-03-21 18:05:57'),(137,137,100,NULL,NULL,'2026-03-21 18:05:57'),(138,138,100,NULL,NULL,'2026-03-21 18:05:57'),(139,139,100,NULL,NULL,'2026-03-21 18:05:57'),(140,140,100,NULL,NULL,'2026-03-21 18:05:57'),(141,141,100,NULL,NULL,'2026-03-21 18:05:57'),(142,142,100,NULL,NULL,'2026-03-21 18:05:57'),(143,143,100,NULL,NULL,'2026-03-21 18:05:57'),(144,144,100,NULL,NULL,'2026-03-21 18:05:57'),(145,145,100,NULL,NULL,'2026-03-21 18:05:57'),(146,146,100,NULL,NULL,'2026-03-21 18:05:57'),(147,147,100,NULL,NULL,'2026-03-21 18:05:57'),(148,148,100,NULL,NULL,'2026-03-21 18:05:57'),(149,149,100,NULL,NULL,'2026-03-21 18:05:57'),(150,150,100,NULL,NULL,'2026-03-21 18:05:57'),(151,151,100,NULL,NULL,'2026-03-21 18:05:57'),(152,152,100,NULL,NULL,'2026-03-21 18:05:57'),(153,153,100,NULL,NULL,'2026-03-21 18:05:57'),(154,154,100,NULL,NULL,'2026-03-21 18:05:57'),(155,155,100,NULL,NULL,'2026-03-21 18:05:57'),(156,156,100,NULL,NULL,'2026-03-21 18:05:57'),(157,157,100,NULL,NULL,'2026-03-21 18:05:57'),(158,158,100,NULL,NULL,'2026-03-21 18:05:57'),(159,159,100,NULL,NULL,'2026-03-21 18:05:57'),(160,160,100,NULL,NULL,'2026-03-21 18:05:57'),(161,161,100,NULL,NULL,'2026-03-21 18:05:57'),(162,162,100,NULL,NULL,'2026-03-21 18:05:57'),(163,163,100,NULL,NULL,'2026-03-21 18:05:57'),(164,164,100,NULL,NULL,'2026-03-21 18:05:57'),(165,165,100,NULL,NULL,'2026-03-21 18:05:57'),(166,166,100,NULL,NULL,'2026-03-21 18:05:57'),(167,167,100,NULL,NULL,'2026-03-21 18:05:57'),(168,168,100,NULL,NULL,'2026-03-21 18:05:57'),(169,169,100,NULL,NULL,'2026-03-21 18:05:57'),(170,170,100,NULL,NULL,'2026-03-21 18:05:57'),(171,171,100,NULL,NULL,'2026-03-21 18:05:57'),(172,172,100,NULL,NULL,'2026-03-21 18:05:57'),(173,173,100,NULL,NULL,'2026-03-21 18:05:57'),(174,174,100,NULL,NULL,'2026-03-21 18:05:57'),(175,175,100,NULL,NULL,'2026-03-21 18:05:57'),(176,176,100,NULL,NULL,'2026-03-21 18:05:57'),(177,177,100,NULL,NULL,'2026-03-21 18:05:57'),(178,178,100,NULL,NULL,'2026-03-21 18:05:57'),(179,179,100,NULL,NULL,'2026-03-21 18:05:57'),(180,180,100,NULL,NULL,'2026-03-21 18:05:57'),(181,181,100,NULL,NULL,'2026-03-21 18:05:57'),(182,182,100,NULL,NULL,'2026-03-21 18:05:57'),(183,183,100,NULL,NULL,'2026-03-21 18:05:57'),(184,184,100,NULL,NULL,'2026-03-21 18:05:57'),(185,185,100,NULL,NULL,'2026-03-21 18:05:57'),(186,186,100,NULL,NULL,'2026-03-21 18:05:57');
/*!40000 ALTER TABLE `stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tax_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_name` (`name`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'SUP-001','Công ty TNHH Nhôm Việt','Nguyễn Văn Hùng','0901234567','contact@nhomviet.vn','123 Trường Chinh, Q.Tân Bình, TP.HCM','0312345001',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(2,'SUP-002','Công ty CP Inox Phú Thịnh','Trần Thị Mai','0912345678','info@inoxphuthinh.vn','456 Cộng Hòa, Q.Tân Bình, TP.HCM','0312345002',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(3,'SUP-003','Công ty TNHH Nhựa Xây Dựng Miền Nam','Lê Văn Bình','0923456789','sales@nhuaxaydung.vn','789 Kinh Dương Vương, Q.6, TP.HCM','0312345003',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(4,'SUP-004','Công ty TNHH Kim Loại Màu Toàn Cầu','Phạm Thị Hoa','0934567890','info@kloaimautoancau.vn','321 An Dương Vương, Q.5, TP.HCM','0312345004',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(5,'SUP-005','Công ty CP Vật Liệu Trang Trí Đất Việt','Võ Văn Nam','0945678901','contact@datviet.vn','654 Võ Văn Kiệt, Q.1, TP.HCM','0312345005',NULL,1,'2026-03-21 17:54:28','2026-03-21 17:54:28');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','STAFF') COLLATE utf8mb4_unicode_ci DEFAULT 'STAFF',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@svietdecor.com','$2a$10$5jK9ei21h07Aj7W5NpmXZuQOaLA/b12ft2RZaE7cQc70r8hc/33Dy','Quản trị viên','ADMIN',1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(2,'staff','staff@svietdecor.com','$2a$10$jMc4m4/kE.h6yng2Ai7H0OGutvmWbkNe8WDfoDR9GktYUKtnDvAte','Nhân viên kho','STAFF',1,'2026-03-21 17:54:28','2026-03-21 17:54:28'),(3,'nguyen_van_a','nva@svietdecor.com','$2a$10$7KnGuEmE0QSobtbGdXVOu.VvukeeaKHUY8qlARZ.TsqHzpa05aboa','Nguyễn Văn An','STAFF',1,'2026-03-21 17:54:28','2026-03-21 17:54:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-25 17:20:47
