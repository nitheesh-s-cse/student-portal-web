-- ============================================================
--  STUDENT PORTAL  –  Complete MySQL Setup Script
--  Run this file once to create the database and all tables.
--  Command: mysql -u root -p < setup.sql
-- ============================================================

-- 1. Create the database (skip if it already exists)
CREATE DATABASE IF NOT EXISTS student_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_portal;

-- ============================================================
-- 2. TABLE: admin
--    Stores admin login credentials.
--    Create your admin account manually after setup (see section 5).
-- ============================================================
CREATE TABLE IF NOT EXISTS admin (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. TABLE: students
--    Each student gets a unique student_id (e.g. STU-0001)
--    and a bcrypt-hashed password.
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  student_id    VARCHAR(20)  NOT NULL UNIQUE,   -- e.g. STU-0001
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  class         VARCHAR(50)  NOT NULL,           -- e.g. CSE-A, MCA-2
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. TABLE: marks
--    Stores subject-wise marks for each student.
--    subject_name is free text (e.g. "Mathematics").
-- ============================================================
CREATE TABLE IF NOT EXISTS marks (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  student_id      VARCHAR(20)  NOT NULL,
  subject_name    VARCHAR(100) NOT NULL,
  marks_obtained  INT          NOT NULL DEFAULT 0,
  max_marks       INT          NOT NULL DEFAULT 100,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 5. Create admin account (NO default credentials)
--    Run this command AFTER setup to create your admin user.
--    Replace YOUR_USERNAME and YOUR_PASSWORD with your own values.
--
--    Generate a bcrypt hash first:
--    node -e "require('bcrypt').hash('YourPassword',10).then(h=>console.log(h))"
--
--    Then run this SQL (replace the hash with your generated one):
--    INSERT INTO admin (username, password_hash) VALUES (
--      'your_username',
--      '$2b$10$YOUR_GENERATED_HASH_HERE'
--    );
-- ============================================================

-- (No default admin is inserted. Create your own using the steps above.)

-- ============================================================
-- 6. Verify everything was created
-- ============================================================
SHOW TABLES;
SELECT 'Database setup complete!' AS status;