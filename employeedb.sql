DROP DATABASE IF EXISTS employeeDB;

create database employeeDB;

use employeeDB;

create table department (
id integer(10) auto_increment primary key,
name varchar(30) not null
);

CREATE TABLE role (
id INTEGER(10) AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) not null,
salary DECIMAL not null,
department_id INTEGER(10) NOT NULL
);

CREATE TABLE employee (
id INTEGER(10) AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER(10) NOT NULL,
manager_id INTEGER(10) NOT NULL
);

INSERT INTO department (name)
VALUES ("engineering"), ("Human_Resources"), ("Security"), ("Executive"), ("R&D"), ("Sales"), ("Marketing"), ("Legal");
