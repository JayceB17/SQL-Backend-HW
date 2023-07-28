DROP DATABASE IF EXISTS mycompany_db;
CREATE DATABASE mycompany_db;
USE mycompany_db;

CREATE TABLE department (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) 

);

CREATE TABLE jobs (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) ,
salary DECIMAL,
department_id INT
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) ,
    last_name VARCHAR(30) ,
   job_id INT, 
    manager_id INT NULL 
);
