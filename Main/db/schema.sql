DROP DATABASE IF EXISIS mycompany_db;
CREATE DATABASE mycompany_db;
USE mycompany_db

CREATE TABLE department (
    DepartmentID INT NOT NULL AUTO_INCREAMENT REIMARY KEY,
    DepartmentName VARCHAR(30) not NULL

);

CREATE TABLE jobs (
job_id INT NOT NULL AUTO_INCREAMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
DepartmentID INT
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREAMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
   job_id INT, 
    manager_id INT NULL 
);
