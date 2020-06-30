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
  `Colour` VARCHAR(10) NOT NULL,
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
AUTO_INCREMENT = 2
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
  `PalletID` SMALLINT(3) NOT NULL,
  `Registration` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`PalletID`),
  INDEX `Registration` (`Registration` ASC) ,
  CONSTRAINT `store_ibfk_1`
    FOREIGN KEY (`Registration`)
    REFERENCES `mps`.`cars` (`Registration`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;