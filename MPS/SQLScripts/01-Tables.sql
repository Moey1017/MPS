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
  `LoginID` VARCHAR(20) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`LoginID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.car
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`cars` (
  `Registration` VARCHAR(15) NOT NULL,
  `Make` VARCHAR(100) NOT NULL,
  `Model` VARCHAR(100) NOT NULL,
  `Colour` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`Registration`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.driver
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`drivers` (
  `DriverID` INT(6) NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(25) NOT NULL,
  `TelNo` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`DriverID`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.driver_car
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`driver_car` (
  `DriverID` INT(6) NOT NULL,
  `Registration` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`DriverID`, `Registration`),
  INDEX `Registration` (`Registration` ASC) ,
  CONSTRAINT `driver_car_ibfk_1`
    FOREIGN KEY (`DriverID`)
    REFERENCES `mps`.`drivers` (`DriverID`),
  CONSTRAINT `driver_car_ibfk_2`
    FOREIGN KEY (`Registration`)
    REFERENCES `mps`.`cars` (`Registration`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- ----------------------------------------------------------------------------
-- Table mps.store
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mps`.`store` (
  `PalletID` VARCHAR(255) NOT NULL,
  `Car_reg` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`PalletID`),
  INDEX `Car_reg` (`Car_reg` ASC) ,
  CONSTRAINT `store_ibfk_1`
    FOREIGN KEY (`Car_reg`)
    REFERENCES `mps`.`cars` (`Registration`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
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
-- Indexes for mps.inbound_order
-- ----------------------------------------------------------------------------
USE mps;

CREATE INDEX ind_status_request_status_read
	ON inbound_order (status, wms_request_status_read);

	
CREATE index ind_status_storage_status_read
	ON inbound_order (status, wms_storage_status_read);