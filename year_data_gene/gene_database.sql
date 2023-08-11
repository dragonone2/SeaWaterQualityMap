
username = 'qubit3'
password = 'unicon77@'
hostname = 'uws7-016.cafe24.com'
database_name = 'qubit3'
table_name = 'year_dara_random'
-- 데이터배이스 만들은 코드
CREATE DATABASE super_data
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
---------------------------------------
CREATE TABLE ocean_data_2018 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    times INT NOT NULL,
    area VARCHAR(50),
    coastal_name VARCHAR(50),
    layer_name VARCHAR(50),
    temperature DOUBLE,
    salinity DOUBLE,
    pH DOUBLE,
    dissolved_oxygen DOUBLE,
    COD DOUBLE,
    chlorophyll DOUBLE,
    TN DOUBLE,
    DIP DOUBLE,
    TP DOUBLE,
    Si_OH4 DOUBLE,
    SPM DOUBLE,
    DIN DOUBLE
);
----------------------------------------------
CREATE TABLE real_tiems_data (
    id INT AUTO_INCREMENT,
    times DATETIME,
    latitude FLOAT, -- 한국어: 위도
    longitude FLOAT, -- 한국어: 경도
    value FLOAT, -- 한국어: 값
    area VARCHAR(255),
    coastal_name VARCHAR(255),
    layer_name VARCHAR(255),
    temperature FLOAT,
    salinity FLOAT,
    pH FLOAT,
    dissolved_oxygen FLOAT,
    COD FLOAT,
    chlorophyll FLOAT,
    N FLOAT,
    DIP FLOAT,
    TP FLOAT,
    Si_OH4 FLOAT,
    PM FLOAT,
    DIN FLOAT,
    PRIMARY KEY(id)
);