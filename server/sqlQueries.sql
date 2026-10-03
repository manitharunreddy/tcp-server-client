CREATE DATABASE `tcp-server`;

USE `tcp-server`;

CREATE TABLE IF NOT EXISTS received_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_ip VARCHAR(45) NOT NULL,
    client_port INT,
    message LONGTEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);