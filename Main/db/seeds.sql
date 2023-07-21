INSERT INTO department (DepartmentID, DepartmentName)
VALUES
  (1, 'Frontend'),
  (2, 'Merch'),
  (3, 'Sales'),
  (4, 'Produce');

INSERT INTO jobs (title, salary, DepartmentID)
VALUES
  ('Frontend Manager', 80000, 1),
  ('Frontend Representative', 45000, 1),
  ('Merch Manager', 60000, 2),
  ('Stocker', 45000, 2),
  ('Sales Manager', 60000, 3),
  ('Sales assistant', 45000, 3),
  ('Produce Manager', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Dylan', 'Wright', 1, 6),
  ('Lindy', 'Jordan', 2, NULL),
  ('luis', 'Jones', 3, 3),
  ('Jacob', 'Lutz', 4, NULL),
  ('Martha', 'Brook', 5, 1),
  ('Kelly', 'Clarkson', 6, NULL),
  ('Kris', 'Reid', 7, NULL),