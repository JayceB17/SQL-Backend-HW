const inquirer = require('inquirer');
const db = require("./config/connection")
// // const mysql = require('mysql2');
// const fs = require('fs');
// const { up } = require('inquirer/lib/utils/readline');
// const PORT = process.env.PORT || 3001;

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'My50456$my',
//     database: 'mycompany_db',
// });
db.connect(err => {
    if(err) throw err 
    console.log("you are now connected to the database!")
    console.log("welcome!")
    displayOptions()
})

// function executeSqlScript(scriptPath) {
//     const script = fs.readFileSync(scriptPath, 'utf8');
//     const statements = script.split(';').filter(Boolean);

//     let currentStatement = '';

//     statements.forEach((statement) => {
//         currentStatement += statement.trim();

//         if (currentStatement.endsWith(';')) {
//             connection.query(currentStatement, (error, results) => {
//                 if (error) {
//                     console.error('Error executing SQL statement:', error);
//                 } else {
//                     console.log('SQL statement executed successfully:', currentStatement);
//                 }
//             });

//             currentStatement = '';
//         }
//     });
// }

// Displays mycompanys lists of choices between departments, jobs and employees.
function displayOptions() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Welcome to mycompanys database. What is it that you want?',
        choices: ['View Departments', 'View Jobs', 'View Employees', 'Add Department', {name:'Add Job'}, 'Add Employee', 'Update an Employees Job'],
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case 'View Departments':
          console.log('You choose: View Departments');
          viewDepartments();
          break;
        case 'View Jobs':
          console.log('You choose: View Jobs');
            viewJobs();
          break;
        case 'View Employees':
          console.log('You choose: View Employees');
          viewEmployees();
          break;
        case 'Add Department':
            console.log('You choose: Add Department');
            addDepartment();
            break;
        case 'Add Job':
            console.log('You choose: Add Job');
            addJobs();
            break;
        case 'Add Employee':
            console.log('You choose: Add Employee');
            addEmployee(); 
            break;
        case 'Update an Employees Job':
            console.log('You choose: Update an Employees Job');
            updateEmployeeJob();
            break;
        default:
          console.log('Invalid choice');
      } 
    });
}
function viewDepartments() {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        displayOptions();
    });
}
function viewJobs() {
    const sql = `SELECT * FROM jobs`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        displayOptions();
    });
}
function viewEmployees() {
    const sql = `SELECT * FROM employee`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        displayOptions();
    });
}
function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What department do you want to add?',
    })
        .then(answer => {
            console.log(answer.name)
            const sql = `INSERT INTO department (name) VALUES ("${answer.name}")`;

            db.query(sql, (err, res) => {
                if (err) throw err;
                console.log(`You added department ${answer.name} to the database.`);
                displayOptions();
                console.log(answer.name);
            });
        });
}
function addJobs() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        const departmentchoices = res.map((department) => {
            return {
               name: department.name,
               value: department.id,
            };
        });
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What job do you want to add?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'This jobs salary:',
            },
            {
                type: 'list',
                name: 'department',
                message: 'What is this departments job?',
                choices: departmentchoices,
            },
        ])
            .then(answer => {
                const departmentId = answer.department;
                const sql = `INSERT INTO jobs (title, salary, department_id) VALUES (?, ?, ?)`;
                db.query(sql, [answer.title, answer.salary, departmentId],
                 (err, res) => {
                    if (err) throw err;
                    console.log(`Added job ${answer.title} to the database.`);
                    displayOptions();
                });
            });
    });
}
function addEmployee() {
    db.query(`SELECT * FROM employee`, (err, employees) => {
        if (err) throw err;
        db.query(`SELECT * FROM jobs`, (err, jobs) => {
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
                    name: 'job',
                    message: "What is the new employee's job?",
                    choices: jobs.map(job => job.title)
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the new employee's manager?",
                    choices: employees.map(manager => `${manager.first_name} ${manager.last_name}`)
                }
            ])
            .then(answer => {
                const { first_name, last_name, job, manager } = answer;

                const selectedJob = jobs.find(r => r.title === job);
                const selectedManager = employees.find(e => `${e.first_name} ${e.last_name}` === manager);

                const sql = `INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES (?, ?, ?, ?)`;
                const params = [first_name, last_name, selectedJob.job_id, selectedManager.id];

                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log(`Added employee ${first_name} ${last_name} to the database.`);
                    displayOptions();
                });
            });
        });
    });
}
function updateEmployeeJob() {
    const sql = `SELECT * FROM employee`;
    const sqlJobs = `SELECT * FROM jobs`;

    db.query(sql, (err, employees) => {
        if (err) throw err;
      db.query(sqlJobs, (err, jobs) => {
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
                    name: 'job',
                    message: 'What is the new job for the employee?',
                    choices: jobs.map(job => job.title)
                }
            ])
                .then(answer => {
                    const employee = employees.find(emp => emp.first_name === answer.employee);
                    const job = jobs.find(job => job.title === answer.job);
                    const updateSql = `UPDATE employee SET job_id = ? WHERE id = ?`;
                    const params = [job.job_id, employee.id];

                    db.query(updateSql, params, (err, result) => {
                        if (err) throw err;
                        console.log(`Updated employee ${answer.employee} to ${answer.job}.`);
                        displayOptions();
                    });
                });
        });
    });
}