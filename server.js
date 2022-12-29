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

viewEmployees = () => {
  connection.query("SELECT * FROM employee;",(err, data) => {
    if (err) throw err;
    console.table(data);
    initiatePrompt(connection);
  });
}

viewAllDepartments = () => {
  connection.query('SELECT * from department;', function (err, data) {
    if (err) throw err;
    console.table(data);
    initiatePrompt(connection);
  });
}

viewAllRoles = () => {
connection.query('SELECT * from role;', function (err, data) {
  if (err) throw err;
  console.table(data);
  initiatePrompt(connection);
});
}

addEmployee = () => {
connection.query(`SELECT * FROM role;`, (err, res) => {
    if (err) throw err;
    let roles = res.map(role => ({ name: role.title, value: role.id }));
    connection.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({ name: employee.first_name + '' + employee.last_name, value: employee.id }));

        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the employees first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employees last name?'
            },
            {
                name: 'role',
                type: 'list',
                message: 'What is this employees role?',
                choices: roles
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is this employees manager?',
                choices: employees
            }
        ]).then((response) => {
            connection.query(`INSERT INTO employee SET ?`,
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.role,
                    manager_id: response.manager,
                }),
                (err, res) => {
                    if (err) throw err;
                }
            console.log(`employee added to the database!`);
            initiatePrompt(connection);
        })
    })
})
}

addDepartment = () => {
inquirer.prompt({
  type: "input",
  name: "newDepartment",
  message: "What department would you like to add?"
})
  .then((response) => {
    departmentQueries(response);
  });
}

departmentQueries = (response) => {
connection.query("INSERT INTO department (name) VALUES (?)", response.newDepartment, function (err, res) {
  if (err) throw err;
  console.log("Congrats. A new department has been added.");
  initiatePrompt(connection);
});
}