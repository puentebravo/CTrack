const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
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

function viewEmp() {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary,";
  query +=
    "department.department, employee.manager_id FROM employee LEFT JOIN role ON (employee.role_id = role.id)";
  query += "LEFT JOIN department ON (role.department_id = department.id)";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

function viewRoleChoices() {
  var query = "SELECT name FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const roleArr = [];
    for (let i = 0; i < res.length; i++) {
      roleArr.push(res[i]);
    }
    return roleArr;
  });
}

function viewManagerChoices() {
  var query = "SELECT employee.first_name, employee.last_name FROM employee;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const managerArr = [];
    for (let i = 0; i < res.length; i++) {
      managerArr.push(res[i]);
    }
    return managerArr;
  });
}

function viewDeptChoices() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const deptArr = [];
    for (let i = 0; i < res.length; i++) {
      deptArr.push(res[i]);
    }
    return deptArr;
  });
}

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
          addDB();
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
      choices: ["Employees", "Teams", "Budget Utilization"],
    })
    .then(function (answer) {
      switch (answer.viewMenu) {
        case "Employees":
          viewEmp();
          break;
        case "Teams":
          console.log("Teams selected.");
          break;
        case "Budget Utilization":
          console.log("Budget Util. Selected");
          break;
      }
      execDB();
    });
}

function addDB() {
  inquirer
    .prompt([
      {
        name: "createMenu",
        type: "rawlist",
        message: "What kind of record would you like to add?",
        choices: ["Employee", "Role", "Department"],
      },
      {
        name: "empFirstName",
        type: "input",
        message: "Please enter the employee's first name.",
        when: (answers) => answers.createMenu === "Employee",
      },
      {
        name: "empLastName",
        type: "input",
        message: "Please enter the employee's last name.",
        when: (answers) => answers.createMenu === "Employee",
      },
      {
        name: "empRole",
        type: "number",
        message: "Please select a role.",
        // choices: [1, 2, 3, 4],
        when: (answers) => answers.createMenu === "Employee",
      },
      {
        name: "empManager",
        type: "number",
        message: "Please select a manager, if any.",
        // choices: [1, null],
        when: (answers) => answers.createMenu === "Employee",
      },
      {
        name: "addRole",
        type: "input",
        message: "Please input a title.",
        when: (answers) => answers.createMenu === "Role",
      },
      {
        name: "roleSalary",
        type: "number",
        message: "Please enter a salary.",
        when: (answers) => answers.createMenu === "Role",
      },
      {
        name: "roleDept",
        type: "rawlist",
        message: "Please select a department.",
        choices: viewDeptChoices(),
        when: (answers) => answers.createMenu === "Role",
      },
      {
        name: "createDept",
        type: "input",
        message: "Please enter a department name.",
        when: (answers) => answers.createMenu === "Department",
      },
    ])
    .then(function (answers) {
      switch (answers.createMenu) {
        case "Employee":
          console.log("employee selected");
          var query =
            "INSERT INTO employee (first_name, last_name, role_id, manager_id)";
          query +=
            "VALUES (?, ?, ?, ?)";
          connection.query(
            query,
            [
              answers.empFirstName,
              answers.empLastName,
              answers.empRole,
              answers.empManager,
            ],
            function (err) {
              if (err) throw err;
              console.log("Record added.");
              viewEmp();
            }
          );
          break;
        case "Role":
          console.log("Role Selected.");
          var query =
            "INSERT INTO role (title, salary, department_id)";
          query +=
            "VALUES (?, ?, ?)";
          connection.query(
            query,
            [
              answers.addRole,
              answers.roleSalary,
              answers.roleDept,
            ],
            function (err) {
              if (err) throw err;
              console.log("Record added.");
            }
          );
          break;
        case "Department":
          console.log("Department selected");
          var query =
          "INSERT INTO department (department)";
        query +=
          "VALUES (?)";
        connection.query(
          query,
          [
            answers.createDept
          ],
          function (err) {
            if (err) throw err;
            console.log("Record added.");
          }
        );
          break;
      }
      execDB();
    });
}