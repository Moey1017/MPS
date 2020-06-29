-- ----------------------------------------------------------------------------
--
-- Default insert for admin
-- Username = mpsAdminUsername
-- Password = Password1$
-- Password can be changed later dev and username can be changed 
--
-- ----------------------------------------------------------------------------

INSERT IGNORE INTO `mps`.`admin` (`LoginID`, `Password`)
VALUES 
('mpsAdminUsername','$2y$12$v7E5wQzQyfsa0mr07eUFBOsEi5U7lmbpQ9cakKkUQnLEmMHbnec7y');

-- ----------------------------------------------------------------------------
--
-- Default insert for store 
--
-- ----------------------------------------------------------------------------

INSERT IGNORE INTO `mps`.`store` (`StoreID`, `Registration`)
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