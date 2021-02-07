const mysql = require("mysql");
const inquirer = require("inquirer");
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,

  port: 3306,

  user: process.env.DB_USER,

  password: process.env.DB_PASS,
  database: "employeeDB",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(`Database connection online at port 3306`)
})
