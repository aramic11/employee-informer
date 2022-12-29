const consoleTable = require("console.table");
const inquirer = require('inquirer');
const connection = require("./connection.js");

// function that starts switch cases with a bunch of options for the user
initiatePrompt = (connection) => {
  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'firstInquiry',
      message: 'Welcome to the employee database application, What would you like to do??',
      choices: [
        'View All Departments',
        'View All Employees',
        'View All Roles',
        'Add Department',
        'Add an Employee',
        'Add Role',
        'Update Employee Role',
        'Exit'
      ]
    }
  ]).then((response) => {
    switch (response.firstInquiry) {
      case "View All Departments":
        viewAllDepartments();
        break;
      case "View All Employees":
        viewEmployees();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Add Role":
        addRole();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log("Thank you for using the employee management program. Have a great day!");
        connection.end();
    }
  });
}