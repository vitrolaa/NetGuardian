CREATE DATABASE IF NOT EXISTS netGuardian;
USE netGuardian;

CREATE TABLE IF NOT EXISTS DEVICES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) UNIQUE NOT NULL, 
    type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TESTS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL, 
    status VARCHAR(50) NOT NULL, 
    latency INT,             
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES DEVICES(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Seed Data
INSERT IGNORE INTO DEVICES (name, ip_address, type) VALUES
('Roteador Central', '192.168.1.1', 'Roteador'),
('Servidor de Arquivos', '10.0.0.10', 'Servidor'),
('Ponto de Acesso Sala 3', '192.168.1.100', 'Access Point'),
('Impressora Fiscal', '192.168.1.200', 'Impressora');

INSERT IGNORE INTO TESTS (device_id, status, latency) VALUES
(1, 'ONLINE', 2),
(1, 'ONLINE', 3),
(1, 'ONLINE', 1);

INSERT IGNORE INTO TESTS (device_id, status, latency) VALUES
(2, 'ONLINE', 5),
(2, 'OFFLINE', NULL),
(2, 'ONLINE', 6);

INSERT IGNORE INTO TESTS (device_id, status, latency) VALUES
(4, 'TIMEOUT', NULL),
(4, 'ONLINE', 8);
