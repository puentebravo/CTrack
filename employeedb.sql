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
manager_id INTEGER(10)
);

INSERT INTO department (name)
VALUES ("engineering"), ("Human_Resources"), ("Security"), ("Executive"), ("R&D"), ("Sales"), ("Marketing"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("engineer", 160000, 1), ("recruiter", 70000, 2), ("Chief_security_officer", 3, 90000), ("CEO", 4, 1000000), ("General_counsel", 125000, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mal", "Reynolds", 4, null);