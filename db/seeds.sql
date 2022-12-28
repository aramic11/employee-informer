INSERT INTO department (id, name)
VALUES
	(1,'Sales'),
	(2,'Marketing'),
	(3,'Finance'),
	(4,'IT'),
	(5,'Engineering');

INSERT INTO role (id, title, salary, department_id)
VALUES
	(1,'Sales Rep', 75000, 1),
	(2,'Sales Manager', 100000, 1),
	(3,'Markerting Associate', 65000, 2),
	(4,'Accountant', 90000, 3),
	(5,'Tech Support', 80000, 4),
    (6,'Lead Engineer', 190000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
	(1,'Jon', 'Snow', 1, 1),
	(2, 'Sansa', 'Stark', 2, 2),
	(3, 'Bear', 'Grills', 2, 3),
	(4, 'Ahmed', 'Ramic', 3, 4);