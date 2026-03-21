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
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int DEFAULT NULL,
  `entity_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'Administrator','LOGIN','USER',1,'admin',NULL,'::1','2026-03-01 05:32:39'),(2,1,'Quản trị viên','LOGIN','USER',1,'admin',NULL,'::1','2026-03-04 17:28:48'),(3,1,'admin','IMPORT','IMPORT_RECEIPT',4,'IMP20260305001','{\"supplier\":\"An Phát\",\"total\":\"300090000.00\",\"items_count\":2}','::1','2026-03-05 15:36:34'),(4,1,'admin','EXPORT','EXPORT_RECEIPT',3,'EXP20260306001','{\"customer\":\"Nguyễn Văn A\",\"total\":\"150000000.00\",\"items_count\":1}','::1','2026-03-05 17:37:03'),(5,1,'Quản trị viên','LOGIN','USER',1,'admin',NULL,'::1','2026-03-09 08:58:41'),(6,1,'admin','CREATE','INVENTORY_CHECK',1,'CHK20260310001','{\"total_products\":4,\"total_difference\":0}','::1','2026-03-09 18:03:30'),(7,1,'admin','COMPLETE','INVENTORY_CHECK',1,'CHK20260310001','{\"total_products\":4,\"total_difference\":0}','::1','2026-03-09 18:03:46'),(8,1,'admin','CREATE','INVENTORY_CHECK',2,'CHK20260310002','{\"total_products\":4,\"total_difference\":2}','::1','2026-03-09 18:04:10'),(9,1,'admin','COMPLETE','INVENTORY_CHECK',2,'CHK20260310002','{\"total_products\":4,\"total_difference\":2}','::1','2026-03-09 18:04:15'),(10,1,'Quản trị viên','LOGIN','USER',1,'admin',NULL,'::1','2026-03-20 08:07:22'),(11,1,'admin','IMPORT','IMPORT_RECEIPT',4,'IMP20260320001','{\"supplier\":\"An Phát\",\"total\":\"150000000.00\",\"items_count\":1}','::1','2026-03-20 10:25:19'),(12,1,'admin','UPDATE','IMPORT_RECEIPT',4,'IMP20260320001','{\"supplier\":\"An Phát\",\"total\":\"150000000.00\"}','::1','2026-03-20 10:25:24'),(13,1,'admin','APPROVE','IMPORT_RECEIPT',4,'IMP20260320001','{}','::1','2026-03-20 10:28:29'),(14,1,'admin','EXPORT','EXPORT_RECEIPT',3,'EXP20260320001','{\"customer\":\"Siêu thị CoopMart\",\"total\":\"10300000.00\",\"items_count\":2}','::1','2026-03-20 10:29:18'),(15,1,'admin','APPROVE','EXPORT_RECEIPT',3,'EXP20260320001','{}','::1','2026-03-20 10:29:22');
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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Điện tử','Thiết bị điện tử, linh kiện, phụ kiện','2026-03-20 09:58:53','2026-03-20 09:58:53'),(2,'Thực phẩm','Thực phẩm khô, đóng gói, chế biến','2026-03-20 09:58:53','2026-03-20 09:58:53'),(3,'Văn phòng phẩm','Dụng cụ văn phòng, giấy tờ, bút viết','2026-03-20 09:58:53','2026-03-20 09:58:53'),(4,'Dược phẩm','Thuốc, vật tư y tế, thiết bị y tế','2026-03-20 09:58:53','2026-03-20 09:58:53'),(5,'Hóa chất','Hóa chất công nghiệp, dung môi, chất tẩy rửa','2026-03-20 09:58:53','2026-03-20 09:58:53');
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
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tax_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_name` (`name`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'CUS-001','Công ty TNHH Phân phối DEF','Phạm Văn Tùng','0934567890','def@distribution.vn','321 Võ Văn Tần, Q.3, TP.HCM','0312345681',NULL,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(2,'CUS-002','Siêu thị CoopMart','Nguyễn Thị Lan','0945678901','coopmart@retail.vn','654 Cách Mạng Tháng 8, Q.10, TP.HCM','0312345682',NULL,1,'2026-03-20 09:58:53','2026-03-20 09:58:53');
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
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_export_receipt` (`export_receipt_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `export_receipt_items_ibfk_1` FOREIGN KEY (`export_receipt_id`) REFERENCES `export_receipts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `export_receipt_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `export_receipt_items`
--

LOCK TABLES `export_receipt_items` WRITE;
/*!40000 ALTER TABLE `export_receipt_items` DISABLE KEYS */;
INSERT INTO `export_receipt_items` VALUES (1,1,1,3,15000000.00,45000000.00,NULL,'2026-03-20 09:58:53'),(2,1,2,20,150000.00,3000000.00,NULL,'2026-03-20 09:58:53'),(3,2,5,50,35000.00,1750000.00,NULL,'2026-03-20 09:58:53'),(4,2,6,30,45000.00,1350000.00,NULL,'2026-03-20 09:58:53'),(5,2,9,20,85000.00,1700000.00,NULL,'2026-03-20 09:58:53'),(6,2,10,100,3000.00,300000.00,NULL,'2026-03-20 09:58:53'),(7,3,10,100,3000.00,300000.00,'','2026-03-20 10:29:18'),(8,3,14,200,50000.00,10000000.00,'','2026-03-20 10:29:18');
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
  `receipt_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `customer_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'APPROVED',
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_reason` text COLLATE utf8mb4_unicode_ci,
  `export_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_code` (`receipt_code`),
  KEY `idx_receipt_code` (`receipt_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_export_date` (`export_date`),
  KEY `idx_status` (`status`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `export_receipts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `export_receipts_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `export_receipts_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `export_receipts`
--

LOCK TABLES `export_receipts` WRITE;
/*!40000 ALTER TABLE `export_receipts` DISABLE KEYS */;
INSERT INTO `export_receipts` VALUES (1,'EXP20260114001',2,1,'Công ty TNHH Phân phối DEF','0934567890',18000000.00,'Xuất hàng theo đơn đặt hàng #DH001','APPROVED',1,'2026-01-11 04:30:00',NULL,'2026-01-11 04:20:00','2026-03-20 09:58:53'),(2,'EXP20260114002',3,2,'Siêu thị CoopMart','0945678901',8500000.00,'Xuất hàng định kỳ tuần','APPROVED',1,'2026-01-13 09:00:00',NULL,'2026-01-13 08:45:00','2026-03-20 09:58:53'),(3,'EXP20260320001',1,2,'Siêu thị CoopMart','0945678901',10300000.00,'Xuất hàng ','APPROVED',1,'2026-03-20 10:29:22',NULL,'2026-03-20 10:29:19','2026-03-20 10:29:18');
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
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_import_receipt` (`import_receipt_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `import_receipt_items_ibfk_1` FOREIGN KEY (`import_receipt_id`) REFERENCES `import_receipts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `import_receipt_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt_items`
--

LOCK TABLES `import_receipt_items` WRITE;
/*!40000 ALTER TABLE `import_receipt_items` DISABLE KEYS */;
INSERT INTO `import_receipt_items` VALUES (1,1,1,5,14500000.00,72500000.00,NULL,'2026-03-20 09:58:53'),(2,1,3,10,2400000.00,24000000.00,NULL,'2026-03-20 09:58:53'),(3,1,4,8,3400000.00,27200000.00,NULL,'2026-03-20 09:58:53'),(4,2,5,100,33000.00,3300000.00,NULL,'2026-03-20 09:58:53'),(5,2,6,50,43000.00,2150000.00,NULL,'2026-03-20 09:58:53'),(6,2,7,30,115000.00,3450000.00,NULL,'2026-03-20 09:58:53'),(7,2,8,40,33000.00,1320000.00,NULL,'2026-03-20 09:58:53'),(8,3,9,100,82000.00,8200000.00,NULL,'2026-03-20 09:58:53'),(9,3,10,200,2800.00,560000.00,NULL,'2026-03-20 09:58:53'),(10,3,11,30,23000.00,690000.00,NULL,'2026-03-20 09:58:53'),(11,3,12,50,14000.00,700000.00,NULL,'2026-03-20 09:58:53'),(13,4,1,10,15000000.00,150000000.00,'','2026-03-20 10:25:24');
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
  `receipt_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `supplier_id` int DEFAULT NULL,
  `supplier_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplier_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'APPROVED',
  `approved_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_reason` text COLLATE utf8mb4_unicode_ci,
  `import_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_code` (`receipt_code`),
  KEY `idx_receipt_code` (`receipt_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_supplier` (`supplier_id`),
  KEY `idx_import_date` (`import_date`),
  KEY `idx_status` (`status`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `import_receipts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `import_receipts_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `import_receipts_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipts`
--

LOCK TABLES `import_receipts` WRITE;
/*!40000 ALTER TABLE `import_receipts` DISABLE KEYS */;
INSERT INTO `import_receipts` VALUES (1,'IMP20260114001',1,1,'Công ty TNHH Điện tử ABC','0901234567',35000000.00,'Nhập hàng tháng 1/2026','APPROVED',1,'2026-01-10 02:30:00',NULL,'2026-01-10 02:00:00','2026-03-20 09:58:53'),(2,'IMP20260114002',2,2,'Công ty TNHH Thực phẩm XYZ','0912345678',12500000.00,'Nhập hàng thực phẩm định kỳ','APPROVED',1,'2026-01-12 08:00:00',NULL,'2026-01-12 07:30:00','2026-03-20 09:58:53'),(3,'IMP20260114003',1,3,'Công ty CP Văn phòng phẩm 123','0923456789',5500000.00,'Nhập văn phòng phẩm Q1/2026','APPROVED',1,'2026-01-13 03:30:00',NULL,'2026-01-13 03:15:00','2026-03-20 09:58:53'),(4,'IMP20260320001',1,4,'An Phát','0982138123',150000000.00,'Máy tính','APPROVED',1,'2026-03-20 10:28:29',NULL,'2026-03-20 10:25:19','2026-03-20 10:25:19');
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
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inventory_check` (`inventory_check_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `inventory_check_details_ibfk_1` FOREIGN KEY (`inventory_check_id`) REFERENCES `inventory_checks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_check_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_check_details`
--

LOCK TABLES `inventory_check_details` WRITE;
/*!40000 ALTER TABLE `inventory_check_details` DISABLE KEYS */;
INSERT INTO `inventory_check_details` VALUES (1,1,3,15,15,0,NULL,'2026-03-09 18:03:30'),(2,1,2,30,30,0,NULL,'2026-03-09 18:03:30'),(3,1,1,17,17,0,NULL,'2026-03-09 18:03:30'),(4,1,4,12,12,0,NULL,'2026-03-09 18:03:30'),(5,2,3,15,15,0,NULL,'2026-03-09 18:04:10'),(6,2,2,30,30,0,NULL,'2026-03-09 18:04:10'),(7,2,1,17,17,0,NULL,'2026-03-09 18:04:10'),(8,2,4,12,10,-2,NULL,'2026-03-09 18:04:10');
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
  `check_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `check_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('DRAFT','COMPLETED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  `total_products` int DEFAULT '0',
  `total_difference` int DEFAULT '0',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `check_code` (`check_code`),
  KEY `idx_check_code` (`check_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_check_date` (`check_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `inventory_checks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_checks`
--

LOCK TABLES `inventory_checks` WRITE;
/*!40000 ALTER TABLE `inventory_checks` DISABLE KEYS */;
INSERT INTO `inventory_checks` VALUES (1,'CHK20260310001',1,'2026-03-09 18:03:31','COMPLETED',4,0,'','2026-03-09 18:03:30','2026-03-09 18:03:46'),(2,'CHK20260310002',1,'2026-03-09 18:04:10','COMPLETED',4,2,'','2026-03-09 18:04:10','2026-03-09 18:04:15');
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
  `sku` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'ELEC-001','Laptop Dell Inspiron 15','Laptop Dell Inspiron 15, i5-12500H, 8GB RAM, 256GB SSD',NULL,'Chiếc',15000000.00,5,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(2,1,'ELEC-002','Chuột Logitech M171','Chuột không dây Logitech M171',NULL,'Chiếc',150000.00,20,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(3,1,'ELEC-003','Bàn phím cơ Keychron K2','Bàn phím cơ Keychron K2, Blue Switch',NULL,'Chiếc',2500000.00,10,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(4,1,'ELEC-004','Màn hình LG 24 inch','Màn hình LG 24 inch Full HD IPS',NULL,'Chiếc',3500000.00,8,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(5,2,'FOOD-001','Gạo ST25','Gạo ST25 cao cấp',NULL,'Kg',35000.00,100,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(6,2,'FOOD-002','Dầu ăn Simply','Dầu ăn Simply chai 1L',NULL,'Chai',45000.00,50,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(7,2,'FOOD-003','Mì gói Hảo Hảo','Mì gói Hảo Hảo vị tôm chua cay',NULL,'Thùng',120000.00,30,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(8,2,'FOOD-004','Nước mắm Nam Ngư','Nước mắm Nam Ngư 750ml',NULL,'Chai',35000.00,40,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(9,3,'OFF-001','Giấy A4 Double A','Giấy A4 Double A 70gsm',NULL,'Ram',85000.00,50,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(10,3,'OFF-002','Bút bi Thiên Long','Bút bi Thiên Long TL-027',NULL,'Cây',3000.00,200,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(11,3,'OFF-003','Kẹp tài liệu Plus','Kẹp tài liệu Plus 50mm',NULL,'Hộp',25000.00,30,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(12,3,'OFF-004','Bìa cứng Plus A4','Bìa cứng Plus A4 5cm',NULL,'Cái',15000.00,50,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(13,4,'MED-001','Paracetamol 500mg','Thuốc hạ sốt Paracetamol 500mg',NULL,'Hộp',25000.00,100,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(14,4,'MED-002','Khẩu trang y tế','Khẩu trang y tế 4 lớp',NULL,'Hộp',50000.00,200,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(15,4,'MED-003','Cồn y tế 90 độ','Cồn y tế 90 độ chai 100ml',NULL,'Chai',15000.00,150,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(16,4,'MED-004','Băng gạc y tế','Băng gạc y tế vô trùng 7.5cm x 4m',NULL,'Cuộn',8000.00,100,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(17,5,'CHEM-001','Nước tẩy Clorox','Nước tẩy Clorox chai 1L',NULL,'Chai',30000.00,40,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(18,5,'CHEM-002','Nước lau sàn Vim','Nước lau sàn Vim hương lavender 900ml',NULL,'Chai',35000.00,50,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(19,5,'CHEM-003','Xà phòng rửa tay Lifebuoy','Xà phòng rửa tay Lifebuoy bảo vệ vượt trội',NULL,'Chai',40000.00,60,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(20,5,'CHEM-004','Bột giặt OMO','Bột giặt OMO Matic 6kg',NULL,'Túi',180000.00,20,1,'2026-03-20 09:58:53','2026-03-20 09:58:53');
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
INSERT INTO `stock_movements` VALUES (1,1,'IMPORT',5,0,0,'IMPORT_RECEIPT',1,'IMP20260114001',NULL,1,'2026-01-10 02:00:00'),(2,3,'IMPORT',10,0,0,'IMPORT_RECEIPT',1,'IMP20260114001',NULL,1,'2026-01-10 02:00:00'),(3,4,'IMPORT',8,0,0,'IMPORT_RECEIPT',1,'IMP20260114001',NULL,1,'2026-01-10 02:00:00'),(4,5,'IMPORT',100,0,0,'IMPORT_RECEIPT',2,'IMP20260114002',NULL,2,'2026-01-12 07:30:00'),(5,6,'IMPORT',50,0,0,'IMPORT_RECEIPT',2,'IMP20260114002',NULL,2,'2026-01-12 07:30:00'),(6,7,'IMPORT',30,0,0,'IMPORT_RECEIPT',2,'IMP20260114002',NULL,2,'2026-01-12 07:30:00'),(7,8,'IMPORT',40,0,0,'IMPORT_RECEIPT',2,'IMP20260114002',NULL,2,'2026-01-12 07:30:00'),(8,9,'IMPORT',100,0,0,'IMPORT_RECEIPT',3,'IMP20260114003',NULL,1,'2026-01-13 03:15:00'),(9,10,'IMPORT',200,0,0,'IMPORT_RECEIPT',3,'IMP20260114003',NULL,1,'2026-01-13 03:15:00'),(10,11,'IMPORT',30,0,0,'IMPORT_RECEIPT',3,'IMP20260114003',NULL,1,'2026-01-13 03:15:00'),(11,12,'IMPORT',50,0,0,'IMPORT_RECEIPT',3,'IMP20260114003',NULL,1,'2026-01-13 03:15:00'),(12,1,'IMPORT',20,0,0,'IMPORT_RECEIPT',4,'IMP20260305001',NULL,1,'2026-03-05 15:36:34'),(13,10,'IMPORT',30,0,0,'IMPORT_RECEIPT',4,'IMP20260305001',NULL,1,'2026-03-05 15:36:34'),(16,1,'EXPORT',3,0,0,'EXPORT_RECEIPT',1,'EXP20260114001',NULL,2,'2026-01-11 04:20:00'),(17,2,'EXPORT',20,0,0,'EXPORT_RECEIPT',1,'EXP20260114001',NULL,2,'2026-01-11 04:20:00'),(18,5,'EXPORT',50,0,0,'EXPORT_RECEIPT',2,'EXP20260114002',NULL,3,'2026-01-13 08:45:00'),(19,6,'EXPORT',30,0,0,'EXPORT_RECEIPT',2,'EXP20260114002',NULL,3,'2026-01-13 08:45:00'),(20,9,'EXPORT',20,0,0,'EXPORT_RECEIPT',2,'EXP20260114002',NULL,3,'2026-01-13 08:45:00'),(21,10,'EXPORT',100,0,0,'EXPORT_RECEIPT',2,'EXP20260114002',NULL,3,'2026-01-13 08:45:00'),(22,1,'EXPORT',10,0,0,'EXPORT_RECEIPT',3,'EXP20260306001',NULL,1,'2026-03-05 17:37:04'),(23,1,'IMPORT',10,7,17,'IMPORT_RECEIPT',4,'IMP20260320001',NULL,1,'2026-03-20 10:28:29'),(24,10,'EXPORT',100,200,100,'EXPORT_RECEIPT',3,'EXP20260320001',NULL,1,'2026-03-20 10:29:22'),(25,14,'EXPORT',200,250,50,'EXPORT_RECEIPT',3,'EXP20260320001',NULL,1,'2026-03-20 10:29:22');
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
INSERT INTO `stocks` VALUES (1,1,17,'2026-03-20 10:28:29','2026-01-11 04:20:00','2026-03-20 10:28:29'),(2,2,30,'2026-03-20 09:58:53','2026-01-11 04:20:00','2026-03-20 09:58:53'),(3,3,15,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(4,4,12,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(5,5,150,'2026-03-20 09:58:53','2026-01-13 08:45:00','2026-03-20 09:58:53'),(6,6,50,'2026-03-20 09:58:53','2026-01-13 08:45:00','2026-03-20 09:58:53'),(7,7,50,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(8,8,60,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(9,9,80,'2026-03-20 09:58:53','2026-01-13 08:45:00','2026-03-20 09:58:53'),(10,10,100,'2026-03-20 09:58:53','2026-03-20 10:29:22','2026-03-20 10:29:22'),(11,11,50,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(12,12,80,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(13,13,150,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(14,14,50,'2026-03-20 09:58:53','2026-03-20 10:29:22','2026-03-20 10:29:22'),(15,15,180,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(16,16,120,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(17,17,60,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(18,18,80,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(19,19,90,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53'),(20,20,30,'2026-03-20 09:58:53',NULL,'2026-03-20 09:58:53');
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
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tax_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_name` (`name`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'SUP-001','Công ty TNHH Điện tử ABC','Nguyễn Văn Hùng','0901234567','abc@electronics.vn','123 Nguyễn Trãi, Q.1, TP.HCM','0312345678',NULL,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(2,'SUP-002','Công ty TNHH Thực phẩm XYZ','Trần Thị Mai','0912345678','xyz@food.vn','456 Lê Lợi, Q.3, TP.HCM','0312345679',NULL,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(3,'SUP-003','Công ty CP Văn phòng phẩm 123','Lê Văn Bình','0923456789','vpp123@office.vn','789 Hai Bà Trưng, Q.1, TP.HCM','0312345680',NULL,1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(4,'SUP-004','An Phát','Nguyễn Văn B','0982138123','anphat@gmail.com','Hà Nội','0111193783',NULL,1,'2026-03-20 10:24:55','2026-03-20 10:24:55');
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
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','STAFF') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'STAFF',
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
INSERT INTO `users` VALUES (1,'admin','admin@example.com','$2a$10$5jK9ei21h07Aj7W5NpmXZuQOaLA/b12ft2RZaE7cQc70r8hc/33Dy','Quản trị viên','ADMIN',1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(2,'staff','staff@example.com','$2a$10$jMc4m4/kE.h6yng2Ai7H0OGutvmWbkNe8WDfoDR9GktYUKtnDvAte','Nhân viên kho','STAFF',1,'2026-03-20 09:58:53','2026-03-20 09:58:53'),(3,'john_doe','john@example.com','$2a$10$7KnGuEmE0QSobtbGdXVOu.VvukeeaKHUY8qlARZ.TsqHzpa05aboa','Nguyễn Văn An','STAFF',1,'2026-03-20 09:58:53','2026-03-20 09:58:53');
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

-- Dump completed on 2026-03-21 20:23:57
