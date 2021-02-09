const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require ("console.table")
require("dotenv").config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,

  port: 3306,

  user: process.env.DB_USER,

  password: process.env.DB_PASS,
  database: "employeeDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`Database connection online at port 3306`);
  execDB();
});

function execDB() {
  inquirer
    .prompt({
      name: "topMenu",
      type: "rawlist",
      message: "Please select an action.",
      choices: [
        "View Record",
        "Create Record",
        "Update Record",
        "Delete Record",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.topMenu) {
        case "View Record":
          console.log("View selected.");
          viewDB();
          break;
        case "Create Record":
          console.log("Create selected.");
          break;
        case "Update Record":
          console.log("Update selected.");
          break;
        case "Delete Record":
          console.log("Delete selected.");
          break;
        case "Exit":
          console.log("Thank you for using CTrack. Have a nice day.");
          connection.end();
      }
    });
}

function viewDB() {
  inquirer
    .prompt({
      name: "viewMenu",
      type: "rawlist",
      message: "Which records would you like to access?",
      choices: [
        "Employees",
        "Teams",
        "Budget Utilization",
      ],
    })
    .then(function (answer) {
      switch (answer.viewMenu) {
        case "Employees":
          var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary,";
              query += "department.department FROM employee LEFT JOIN role ON (employee.role_id = role.id)";
              query += "LEFT JOIN department on (role.department_id = department.id)";
              connection.query(query, function(err, res){
                console.table(res)
              })
          break;
        case "Teams":
          console.log("Teams selected.");
          break;
        case "Budget Utilization":
          console.log("Budget Util. Selected")
          break;
      }
      execDB();
    });
}
