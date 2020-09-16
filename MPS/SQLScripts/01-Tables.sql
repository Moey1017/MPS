-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: mps
-- Source Schemata: dbmps
-- Created: Thu Mar  5 14:21:56 2020
-- Workbench Version: 8.0.19
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema mps
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mps` ;

-- ----------------------------------------------------------------------------
-- Table mps.admin
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`admins` (
  `login_id` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`login_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.driver
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`drivers` (
  `driver_id` INT(6) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `tel_no` VARCHAR(20) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`driver_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.car
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`cars` (
  `registration` VARCHAR(15) NOT NULL,
  `driver_id` INT(6),
  `make` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `colour` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`registration`),
  FOREIGN KEY (`driver_id`)REFERENCES `mps`.`drivers`(`driver_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.store
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`store` (
  `pallet_id` VARCHAR(255) NOT NULL,
  `car_reg` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`pallet_id`),
  INDEX `car_reg` (`car_reg` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Table mps.inbound_order
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`inbound_order` (
	`batch_id` VARCHAR(255) NOT NULL,
	`pallet_id` VARCHAR(255) NOT NULL,
	`order_pallet_count` INT NOT NULL,
	`expected_activation_time` TIMESTAMP NULL,
	`sku_name` VARCHAR(255) NOT NULL,
	`sku_code` VARCHAR(255) NOT NULL,
	`status` VARCHAR(255) NOT NULL,
	`max_pallet_height` INT NOT NULL,
	`pallet_width` INT NOT NULL,
	`wms_receipt_link_id` INT NULL,
	`wms_request_status_read` INT NULL,
	`wms_storage_status_read` INT NULL,
	PRIMARY KEY (`batch_id`, `pallet_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.outbound_order
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`outbound_order` (
	`batch_id` VARCHAR(255) NOT NULL,
	`pallet_id` VARCHAR(255) NOT NULL,
	`order_pallet_count` INT NOT NULL,
	`expected_activation_time` TIMESTAMP NULL,
	`status` VARCHAR(255) NOT NULL,
	`index` INT DEFAULT 0 NOT NULL,
	`source` VARCHAR(50) NULL,
	`wms_link_id` INT NULL,
	`wms_request_status_read` INT NULL,
	`wms_output_status_read` INT NULL,
	`automated_activation_time` DATETIME NULL,
	`target` BIGINT NULL,
	PRIMARY KEY (`batch_id`, `pallet_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Store History
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`store_history` (
	`history_no` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`registration` VARCHAR(15) NOT NULL,
	`activity` VARCHAR(10) NOT NULL,
	`ts` TIMESTAMP NOT NULL);    

-- ----------------------------------------------------------------------------
-- Indexes for mps.inbound_order
-- ----------------------------------------------------------------------------
USE mps;

CREATE INDEX ind_status_request_status_read
	ON inbound_order (status, wms_request_status_read);

	
CREATE index ind_status_storage_status_read
	ON inbound_order (status, wms_storage_status_read);
