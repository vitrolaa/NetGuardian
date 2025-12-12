-- Script para corrigir as tabelas do NetGuardian
-- Execute este script no MySQL Workbench ou via linha de comando

USE netGuardian;

-- Primeiro, verificar a estrutura atual da tabela TESTS
-- DESCRIBE TESTS;

-- Dropar as tabelas e recriá-las (ATENÇÃO: isso apaga os dados!)
DROP TABLE IF EXISTS TESTS;
DROP TABLE IF EXISTS DEVICES;

-- Recriar tabela DEVICES
CREATE TABLE DEVICES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) UNIQUE NOT NULL, 
    type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recriar tabela TESTS com a coluna status
CREATE TABLE TESTS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL, 
    status VARCHAR(50) NOT NULL, 
    latency INT,             
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES DEVICES(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Inserir dados de teste
INSERT INTO DEVICES (name, ip_address, type, status) VALUES
('Roteador Central', '192.168.1.1', 'router', 'online'),
('Servidor de Arquivos', '10.0.0.10', 'server', 'online'),
('Ponto de Acesso Sala 3', '192.168.1.100', 'switch', 'offline'),
('Impressora Fiscal', '192.168.1.200', 'printer', 'online');

INSERT INTO TESTS (device_id, status, latency) VALUES
(1, 'ONLINE', 2),
(1, 'ONLINE', 3),
(1, 'ONLINE', 1);

INSERT INTO TESTS (device_id, status, latency) VALUES
(2, 'ONLINE', 5),
(2, 'OFFLINE', NULL),
(2, 'ONLINE', 6);

INSERT INTO TESTS (device_id, status, latency) VALUES
(4, 'TIMEOUT', NULL),
(4, 'ONLINE', 8);

SELECT 'Tabelas recriadas com sucesso!' AS resultado;
