const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const { up } = require('inquirer/lib/utils/readline');
const PORT = process.env.PORT || 3001;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company_db',
});

function executeSqlScript(scriptPath) {
    const script = fs.readFileSync(scriptPath, 'utf8');
    const statements = script.split(';').filter(Boolean);

    let currentStatement = '';

    statements.forEach((statement) => {
        currentStatement += statement.trim();

        if (currentStatement.endsWith(';')) {
            connection.query(currentStatement, (error, results) => {
                if (error) {
                    console.error('Error executing SQL statement:', error);
                } else {
                    console.log('SQL statement executed successfully:', currentStatement);
                }
            });

            currentStatement = '';
        }
    });
}
  
// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database.');
    executeSqlScript('./db/schema.sql');
    executeSqlScript('./db/seeds.sql');
    displayOptions();
});

function displayOptions() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Welcome to the company database. What would you like to do?',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update an Employees Role'],
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case 'View Departments':
          console.log('You selected: View Departments');
          viewDepartments();
          break;
        case 'View Roles':
          console.log('You selected: View Roles');
            viewRoles();
          break;
        case 'View Employees':
          console.log('You selected: View Employees');
          viewEmployees();
          break;
        case 'Add Department':
            console.log('You selected: Add Department');
            addDepartment();
            break;
        case 'Add Role':
            console.log('You selected: Add Role');
            addRole();
            break;
        case 'Add Employee':
            console.log('You selected: Add Employee');
            addEmployee(); 
            break;
        case 'Update an Employees Role':
            console.log('You selected: Update an Employees Role');
            updateEmployeeRole();
            break;
        default:
          console.log('Invalid choice');
      }
    });
}
function viewDepartments() {
    const sql = `SELECT * FROM department`;

    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        displayOptions();
    });
}
function viewRoles() {
    const sql = `SELECT * FROM jobs`;

    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        displayOptions();
    });
}
function viewEmployees() {
    const sql = `SELECT * FROM employee`;

    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        displayOptions();
    });
}
function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the name of the department you would like to add?'
    })
        .then(answer => {
            console.log(answer.name)
            const sql = `INSERT INTO department (DepartmentName) VALUES ("${answer.name}")`;

            connection.query(sql, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database.`);
                displayOptions();
                console.log(answer.name);
            });
        });
}
function addRole() {
    const sql = `SELECT * FROM department`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        const departmentchoices = res.map((department) => {
            return {
               name: department.DepartmenName,
               value: department.DepartmentID
            };
        });
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role you would like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Salary for this role:'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does this role belong to?',
                choices: departmentchoices,
            },
        ])
            .then(answer => {
                const departmentId = answer.department;
                const sql = `INSERT INTO jobs (title, salary, DepartmentID) VALUES (?, ?, ?)`;
                connection.query(sql, [answer.title, answer.salary, departmentId],
                 (err, res) => {
                    if (err) throw err;
                    console.log(`Added role ${answer.title} to the database.`);
                    displayOptions();
                });
            });
    });
}
function addEmployee() {
    connection.query(`SELECT * FROM employee`, (err, employees) => {
        if (err) throw err;
        connection.query(`SELECT * FROM jobs`, (err, roles) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the new employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the new employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the new employee's role?",
                    choices: roles.map(role => role.title)
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the new employee's manager?",
                    choices: employees.map(manager => `${manager.first_name} ${manager.last_name}`)
                }
            ])
            .then(answer => {
                const { first_name, last_name, role, manager } = answer;

                const selectedRole = roles.find(r => r.title === role);
                const selectedManager = employees.find(e => `${e.first_name} ${e.last_name}` === manager);

                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                const params = [first_name, last_name, selectedRole.role_id, selectedManager.id];

                connection.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log(`Added employee ${first_name} ${last_name} to the database.`);
                    displayOptions();
                });
            });
        });
    });
}
function updateEmployeeRole() {
    const sql = `SELECT * FROM employee`;
    const sqlRoles = `SELECT * FROM jobs`;

    connection.query(sql, (err, employees) => {
        if (err) throw err;
        connection.query(sqlRoles, (err, roles) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employees.map(employee => employee.first_name)
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the new role of the employee?',
                    choices: roles.map(role => role.title)
                }
            ])
                .then(answer => {
                    const employee = employees.find(emp => emp.first_name === answer.employee);
                    const role = roles.find(role => role.title === answer.role);
                    const updateSql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    const params = [role.role_id, employee.id];

                    connection.query(updateSql, params, (err, result) => {
                        if (err) throw err;
                        console.log(`Updated employee ${answer.employee} to ${answer.role}.`);
                        displayOptions();
                    });
                });
        });
    });
}