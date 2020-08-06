-- ----------------------------------------------------------------------------
--
-- Default insert for admin
-- Username = mpsAdminUsername
-- Password = Password1$
-- Password can be changed later dev and username can be changed 
--
-- ----------------------------------------------------------------------------

INSERT IGNORE INTO `mps`.`admins` (`login_id`, `password`)
VALUES 
('mpsAdminUsername','$2y$12$v7E5wQzQyfsa0mr07eUFBOsEi5U7lmbpQ9cakKkUQnLEmMHbnec7y');

-- ----------------------------------------------------------------------------
--
-- Default insert for drivers
--
-- ----------------------------------------------------------------------------

INSERT IGNORE INTO `mps`.`drivers`(`driver_id`, `name`, `tel_no`, `email`)
VALUES
	(NULL,'Moey','0833890984','moey@gmail.com'),
	(NULL,'Jasmine','0833812312','Jasmine@gmail.com'),
	(NULL,'Andrew','08338123114','Andrew@gmail.com');

-- ----------------------------------------------------------------------------
--
-- Default insert for cars 
--
-- ----------------------------------------------------------------------------

	
INSERT IGNORE INTO `mps`.`cars`(`registration`,`make`,`model`,`colour`)
VALUES
	('WRWR312','Toyota','LandCruiser','Silver'),
	('DUIW567','BMW','X5','DARK BLUE'),
	('EEWR789','MERS','GLC2000','BLACK');

-- ----------------------------------------------------------------------------
--
-- Default insert for store 
--
-- ----------------------------------------------------------------------------

INSERT IGNORE INTO `mps`.`store` (`pallet_id`, `car_reg`)
VALUES 
  ('101', NULL),
  ('102', NULL),
  ('103', NULL),
  ('104', NULL),
  ('201', NULL),
  ('202', NULL),
  ('203', NULL),
  ('204', NULL),
  ('301', NULL),
  ('302', NULL),
  ('303', NULL),
  ('304', NULL);

