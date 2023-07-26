DROP DATABASE IF EXISIS mycompany_db;
CREATE DATABASE mycompany_db;
USE mycompany_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREAMENT REIMARY KEY,
    name VARCHAR(30) 

);

CREATE TABLE jobs (
id INT NOT NULL AUTO_INCREAMENT PRIMARY KEY,
title VARCHAR(30) ,
salary DECIMAL,
Department_id INT
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREAMENT PRIMARY KEY,
    first_name VARCHAR(30) ,
    last_name VARCHAR(30) ,
   job_id INT, 
    manager_id INT NULL 
);
