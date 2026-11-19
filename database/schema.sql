-- =============================================================================
-- Database Schema for To-Do Web Application
-- Database Engine: MySQL 8.0+ / MariaDB 10.3+
-- Engine Type: InnoDB (for ACID compliance and foreign key support)
-- Character Set: utf8mb4 (full Unicode support including emojis)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Database Initialization
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS todo_app
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE todo_app;

-- -----------------------------------------------------------------------------
-- 2. Table: users
-- Stores registered user and administrator authentication and profile details.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: tasks
-- Stores task items created by users, with status, priority, and due dates.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_user_id
        FOREIGN KEY (user_id) 
        REFERENCES users (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    INDEX idx_tasks_user_id_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
