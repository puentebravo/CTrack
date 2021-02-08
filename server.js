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

connection.connect(function (err) {
  if (err) throw err;
  console.log(`Database connection online at port 3306`);
  execDB();
});

function execDB() {
  inquirer.prompt({
    name: "topMenu",
    type: "rawlist",
    message: "Please select an action.",
    choices: ["View Record", "Create Record", "Update Record", "Delete Record", "Exit"],
  }).then(function(answer){
    switch (answer.topMenu) {
      case "View Record":
        console.log("View selected.")
        break;
      case "Create Record":
        console.log("Create selected.")
        break;
      case "Update Record":
        console.log("Update selected.")
        break;
      case "Delete Record":
        console.log("Delete selected.")
        break;
      case "Exit":
        console.log("Thank you for using CTrack. Have a nice day.");
        connection.end()
    }
  });
}
