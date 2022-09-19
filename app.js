const inquirer = require("inquirer");
const db = require("./db/connections");
const cTable = require("console.table");

db.connect((err) => {
  if (err) throw err;
  console.log("database connected");
  welcome();
});

welcome = () => {
  console.log("***********************************");
  console.log("*                                 *");
  console.log("*        EMPLOYEE MANAGER         *");
  console.log("*                                 *");
  console.log("***********************************");
  promptUser();
};

promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please select an option to proceed.",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee's Role",
          "Update an Employee's Manager",
          "View Employees by Department",
          "View Employees by Manager",
          "View Budget",
          "Delete Department",
          "Delete Role",
          "Delete Employee",
          "Exit",
        ],
      },
    ])
    .then((response) => {
      switch (response.options) {
        case "View All Departments":
          view("department");
          break;
        case "View All Roles":
          view("role");
          break;
        case "View All Employees":
          view("employee");
          break;
        case "View Employees by Department":
          view("employeeByDepartment");
          break;
        case "View Employees by Manager":
          view("employeeByManager");
          break;
        case "View Budget":
          view("budget");
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee's Role":
          updateRole();
          break;
        case "Update an Employee's Manager":
          updateManager();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        default:
          db.end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const view = (data) => {
  let sql;
  if (data === "department") {
    sql = `SELECT * FROM department`;
  } else if (data === "role") {
    sql = `SELECT 
        r.id as Role_Id, 
        r.title as Title, 
        d.department_name as Department, 
        r.salary as Salary 
        FROM roles AS r 
        JOIN department as d ON r.department_id = d.id`;
  } else if (data === "employee") {
    sql = `SELECT 
        e.id as Employee_ID, 
        e.first_name as First_Name, 
        e.last_name as Last_Name, 
        r.title as Job_Title, 
        d.department_name as Department, 
        r.salary as Salaries, 
        CONCAT(e2.first_name, " ", e2.last_name) as Manager 
        FROM employee as e 
        LEFT JOIN employee as e2 ON e2.id = e.manager_id
        LEFT JOIN roles as r ON e.role_id = r.id 
        LEFT JOIN department as d ON d.id = r.department_id`;
  } else if (data === "employeeByDepartment") {
    sql = `SELECT 
        d.department_name as Department,
        e.first_name as First_Name,
        e.last_name as Last_Name
        FROM department as d
        LEFT JOIN roles as r ON d.id = r.department_id
        LEFT JOIN employee as e ON r.id = e.role_id
        `;
  } else if (data === "employeeByManager") {
    sql = `SELECT 
        CONCAT(e1.first_name, " ", e1.last_name) as Manager,
        e2.first_name as First_Name,
        e2.last_name as Last_Name
        FROM employee as e1
        LEFT JOIN employee as e2 ON e1.manager_id = e2.id`;
  } else {
    sql = `SELECT 
        d.department_name as Department,
        sum(r.salary) as Total_Budget_Utlized
        FROM department as d
        JOIN roles as r ON d.id = r.department_id
        GROUP BY d.department_name`;
  }

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);

    promptUser();
  });
};

addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Please enter the new department you wish to add.",
      },
    ])
    .then((response) => {
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
      const input = response.department;

      db.query(sql, input, (err, results) => {
        if (err) throw err;
        console.log(
          `Added new ${response.department} to the "department" table.`
        );

        promptUser();
      });
    });
};


addRole = () => {

    const departmentList = [];
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        results.forEach( (dep) => {
            let object = {
                name: dep.department_name,
                value: dep.id
            }
            departmentList.push(object);
        });
    })

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Please enter the name of the role.',
        },
        {
            type: 'input',
            name: 'salary',
            message: "Please enter the salary for this role.",
            validate: (data) => {
                if (data) {
                    return true;
                } else {
                    console.log('Please provide the salray information in numeric characters.');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'department_id',
            message: "Please select the department this role belongs to.",
            choices: departmentList
        }
    ])
    .then((response) => {
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
        const input = [response.title, response.salary, response.department_id];
        db.query(sql, input, (err, results) => {
            if (err) throw err;
            console.log(`Added new ${response.title} to the roles table.`);
            promptUser();
        })
    })

}