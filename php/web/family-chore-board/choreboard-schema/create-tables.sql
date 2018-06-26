CREATE TABLE users
(
	id SERIAL PRIMARY KEY,
	name varchar(80) NOT NULL UNIQUE,
	password varchar(80) NOT NULL,
	is_admin bool DEFAULT false,
	account_balance real DEFAULT 0,
	streak int DEFAULT 0
);

CREATE TABLE chores
(
	id SERIAL PRIMARY KEY,
	name varchar(100) NOT NULL UNIQUE,
	choredough real NOT NULL
);

CREATE TABLE transactions
(
	id SERIAL PRIMARY KEY,
	amount real DEFAULT 0,
	new_balance real,
	"type" transactionType DEFAULT 'dough',
	description text NOT NULL,
	"date" date DEFAULT NOW(),
	user_id int references users(id) NOT NULL,
	chore_id int references chores(id)
);

CREATE TABLE tasks
(
	id SERIAL PRIMARY KEY,
	description text NOT NULL UNIQUE
);

CREATE TABLE chores_to_users
(
	id SERIAL PRIMARY KEY,
	chore_id int references chores(id) NOT NULL,
	user_id int references users(id) NOT NULL,
	chore_completed bool DEFAULT false
);

CREATE TABLE task_to_chore
(
	id SERIAL PRIMARY KEY,
	task_id int references tasks(id) NOT NULL,
	chore_id int references chores(id) NOT NULL,
	task_minuet_estimate int NOT NULL,
	task_completed bool DEFAULT false
);
