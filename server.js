const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
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
  figlet("CTRACK V1.0", function (err, data) {
    if (err) throw err;
    console.log(data);
    execDB();
  });
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
  var query = "SELECT id, name FROM role";
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
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name FROM employee;";
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
    const deptRes = res;
    const deptArr = [];
    for (i = 0; i < deptRes.length; i++) {
      deptArr.push({
        name: deptRes[i].department,
        value: deptRes[i].id,
        short: deptRes[i].id,
      });
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
          viewDB();
          break;
        case "Create Record":
          addDB();
          break;
        case "Update Record":
          updateDB();
          break;
        case "Delete Record":
          deleteDb();
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
        choices: viewDeptChoices,
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
          var query =
            "INSERT INTO employee (first_name, last_name, role_id, manager_id)";
          query += "VALUES (?, ?, ?, ?)";
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
          var query = "INSERT INTO role (title, salary, department_id)";
          query += "VALUES (?, ?, ?)";
          connection.query(
            query,
            [answers.addRole, answers.roleSalary, answers.roleDept],
            function (err) {
              if (err) throw err;
              console.log("Record added.");
            }
          );
          break;
        case "Department":
          console.log("Department selected");
          var query = "INSERT INTO department (department)";
          query += "VALUES (?)";
          connection.query(query, [answers.createDept], function (err) {
            if (err) throw err;
            console.log("Record added.");
          });
          break;
      }
      execDB();
    });
}

function updateDB() {
  // number inputs here will be replaced with rawlist/function inputs once I figure that out
  inquirer
    .prompt([
      {
        name: "updateMenu",
        type: "rawlist",
        message: "What kind of employee record would you like to update?",
        choices: ["Role", "Manager"],
      },
      {
        name: "updateRoleTarget",
        type: "number",
        message: "Which employee would you like to update?",
        when: (answers) => answers.updateMenu === "Role",
      },
      {
        name: "updateRoleVal",
        type: "number",
        message: "Please select a new role.",
        when: (answers) => answers.updateMenu === "Role",
      },
      {
        name: "updateMgrTarget",
        type: "number",
        message: "Please select an employee to reassign.",
        when: (answers) => answers.updateMenu === "Manager",
      },
      {
        name: "updateMgrVal",
        type: "number",
        message: "Please select a new manager.",
        when: (answers) => answers.updateMenu === "Manager",
      },
    ])
    .then(function (answers) {
      switch (answers.updateMenu) {
        case "Role":
          var query = "UPDATE employee SET role_id = ? WHERE id = ?";
          connection.query(
            query,
            [
              parseInt(answers.updateRoleVal),
              parseInt(answers.updateRoleTarget),
            ],
            function (err) {
              if (err) throw err;
              console.log("Record updated!");
              viewEmp();
            }
          );
          break;
        case "Manager":
          var query = "UPDATE employee SET manager_id = ? WHERE id = ?";
          connection.query(
            query,
            [parseInt(answers.updateMgrVal), parseInt(answers.updateMgrTarget)],
            function (err) {
              if (err) throw err;
              console.log("Employee reassigned.");
              viewEmp();
            }
          );
          break;
      }
      execDB();
    });
}

function deleteDb() {
  inquirer
    .prompt([
      {
        name: "deleteMenu",
        type: "rawlist",
        message: "Which type of record would you like to delete?",
        choices: ["Employee", "Role", "Department"],
      },
      {
        name: "deleteEmp",
        type: "number",
        message: "Please specify an employee for removal.",
        when: (answers) => answers.deleteMenu === "Employee",
      },
      {
        name: "deleteRole",
        type: "number",
        message: "Please specify which role to remove.",
        when: (answers) => answers.deleteMenu === "Role",
      },
      {
        name: "deleteDept",
        type: "number",
        message: "Please select a department to remove.",
        when: (answers) => answers.deleteMenu === "Department",
      },
    ])
    .then(function (answers) {
      switch (answers.deleteMenu) {
        case "Employee":
          var query = "DELETE FROM employee WHERE id = ?"
          connection.query(query, [parseInt(answers.deleteEmp)], function (err) {
            if (err) throw err;
            console.log("Employee record deleted.");
            viewEmp();
          })
          break;
        case "Role":
          var query = "DELETE FROM role WHERE id = ?"
          connection.query(query, [parseInt(answers.deleteRole)], function (err) {
            if (err) throw err;
            console.log("Role deleted.")
            viewEmp();
          })
        case "Department":
          var query = "DELETE FROM department WHERE id = ?"
          connection.query(query, [parseInt(answers.deleteDept)], function (err) {
            if (err) throw err;
            console.log("Department deleted.")
            viewEmp();
          })
          break;
      }
      execDB();
    });
}
