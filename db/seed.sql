INSERT INTO department (department_name)
VALUES 
    ("Sales"),
    ("Finance"),
    ("IT"),
    ("Human Resources");

INSERT INTO roles (title, salary, department_id)
VALUES 
    ("Salesperson", 80000, 1),
    ("Sales Lead", 100000, 1),
    ("Accountant", 75000, 2),
    ("Finance Manager", 110000, 2),
    ("Software Engineer", 90000, 3),
    ("Lead Engineer", 110000, 3),
    ("HR Coordinator", 70000, 4),
    ("HR Manager", 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Lonny", "Fortune", 1, 2),
    ("John", "Doe", 2, NULL),
    ("Todd", "Smith",3, 4),
    ("Jenn", "White",4, NULL),
    ("Karen", "Adams",5, 6),
    ("Victoria", "Bea",6, NULL),
    ("Letty", "Grady",7, 8),
    ("Tony", "Grey",8, NULL),
    ("April", "May",1, 2),
    ("Marry", "Up",3, 4),
    ("Cindy", "Loud",5, 6),
    ("Tom", "Brown",7, 8),
    ("Eve", "Johnson",1, 2),
    ("Isaac", "Wright",5, 6);


