const consoleTable = require("console.table");
const inquirer = require('inquirer');
const connection = require("./connection.js");

// array for new employee info
let updateEmployeeInfo = [];

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

addRole = () => {
  connection.query('SELECT * FROM department', function (err, res) {
    if (err) throw err;
    inquirer.prompt([{
      type: "input",
      name: "newRole",
      message: "What role would you like to add?"
    },
      {
        type: "input",
        name: "newSalary",
        message: "What is the salary for this new position?"
      },
      {
        type: "list",
        name: "connectDep",
        message: "What department is the new role in?",
        choices: res.map(function (role) {
          return {
            name: role.name,
            value: role.id
          }
        })
      }])
      .then((response) => {
        roleQueries(response);
      });
  })

}

roleQueries = (response) => {
  connection.query("INSERT INTO role (??) VALUES (?, ?, ?)", [["title", "salary", "department_id"], response.newRole, response.newSalary, response.connectDep], function (err, res) {
    if (err) throw err;
    console.log("Congrats. A new role has been added.");
    initiatePrompt(connection);
  });
}

updateEmployeeRole = () => {
  connection.query('SELECT id, role_id, CONCAT (first_name, " ", last_name) AS name FROM employee', async function (err, res) {
    try {
      const employeeUpdate = await inquirer.prompt([{
        type:"list",
        name: "empID",
        message: "Select the employee that you want to update the role for.",
        choices: res.map(function(employeeRole) {
          return {
            name: employeeRole.name,
            value: employeeRole.id
          }
        })
      }]).then((response) => {
        updateEmployeeInfo.push(response.empID);
      });
    } catch (err) {
      console.log(err);
    }
  connection.query('SELECT * FROM role', async function (err, res) {
    try {
      const roleUpdate = await inquirer.prompt([{
        type:"list",
        name:"roleUpdate",
        message: "Select the employee's role",
        choices: res.map(function(newRole) {
          return {
            name: newRole.title,
            value: newRole.id
          }
        })
      }]) .then((response) => {
        updateEmployeeInfo.push(response.roleUpdate);
        console.log(updateEmployeeInfo);
        updateQueries(response);
      });
    } catch (err) {
      console.log(err);
    }
  })
    
    initiatePrompt(connection);
  });
}

updateQueries = (response) => {
  connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [updateEmployeeInfo[1], updateEmployeeInfo[0]], function (err, res) {
    if (err) throw err;
    console.log("Congrats! The employee's role has successfully been updated.");
    initiatePrompt(connection);
  })
}
// prompts questions for user to answer in terminal
initiatePrompt(connection);