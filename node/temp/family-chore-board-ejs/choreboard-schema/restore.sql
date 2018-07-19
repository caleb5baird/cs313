DROP FUNCTION insert_transaction() CASCADE;
DROP FUNCTION update_chore_to_user() CASCADE;
DROP TABLE transactions;
DROP TABLE chores_to_users;
DROP TABLE task_to_chore;
DROP TABLE tasks;
DROP TABLE chores;
DROP TABLE users;
DROP TYPE transactionType;
CREATE TYPE transactionType AS ENUM ('dough', 'bonus', 'purchase', 'jurnaled');

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

--  Insert Transaction
CREATE FUNCTION insert_transaction() RETURNS trigger AS $insert_transaction$
BEGIN
	update users set account_balance = account_balance + NEW.amount where id=NEW.user_id;
	update transactions set new_balance = (SELECT account_balance FROM users WHERE id = NEW.user_id)
	WHERE id=NEW.id;
	RETURN NEW;
END;
$insert_transaction$ LANGUAGE plpgsql;
CREATE TRIGGER insert_transaction AFTER INSERT ON transactions
FOR EACH ROW EXECUTE PROCEDURE insert_transaction();

--  update chore_to_user
CREATE FUNCTION update_chore_to_user() RETURNS trigger AS $update_chore_to_user$
DECLARE
amount real;
BEGIN
	--  if the only thing that has changed is setting it to done make the transaction
	IF NEW.chore_completed != OLD.chore_completed AND NEW.chore_completed = TRUE
		AND NEW.user_id = OLD.user_id AND NEW.chore_id = OLD.chore_id
		THEN
		amount := (SELECT choredough FROM chores WHERE id=NEW.chore_id);
		INSERT INTO transactions (amount, user_id, chore_id, new_balance, description)
		VALUES (amount, NEW.user_id, NEW.chore_id,
			(SELECT account_balance FROM users WHERE id=NEW.user_id) + amount,
			(SELECT name FROM chores WHERE id=NEW.chore_id));
		--  and complete all children tasks
		UPDATE task_to_chore SET task_completed = true WHERE chore_id = NEW.chore_id;

		--  if all the chores are done add to the streak
		IF NOT EXISTS(SELECT id FROM chores_to_users WHERE user_id=NEW.user_id AND chore_completed=false)
			THEN UPDATE users SET streak = streak + 1 WHERE id=NEW.user_id;
END IF;
END If;
--  if the only thing that has changed is setting the status to not done than add a negative
--  transaction.
IF NEW.chore_completed != OLD.chore_completed AND NEW.chore_completed = FALSE
	AND NEW.user_id = OLD.user_id AND NEW.chore_id = OLD.chore_id
	THEN
	amount := (SELECT choredough FROM chores WHERE id=NEW.chore_id);
	INSERT INTO transactions (amount, user_id, chore_id, new_balance, description)
	VALUES (-amount, NEW.user_id, NEW.chore_id,
		(SELECT account_balance FROM users WHERE id=NEW.user_id) - amount,
		(SELECT name FROM chores WHERE id=NEW.chore_id));
	--  if all the chores were done than we need to take one away from the streak
	IF NOT EXISTS(SELECT id FROM chores_to_users WHERE user_id=NEW.user_id AND chore_completed=false AND chore_id!=NEW.chore_id)
		THEN UPDATE users SET streak = streak - 1 WHERE id=NEW.user_id;
END IF;
END If;
RETURN NEW;
END;
$update_chore_to_user$ LANGUAGE plpgsql;
CREATE TRIGGER update_chore_to_user AFTER UPDATE ON chores_to_users
FOR EACH ROW EXECUTE PROCEDURE update_chore_to_user();

INSERT INTO users (name, is_admin, password)
	VALUES ('Ammon', false, '$2y$10$hGjd2jiaH3v0tFTzWETZnOMdKrMCRHgTyXd.oj.c0Ta3Fw6HsRh7G'),
	('Joshua', false, '$2y$10$kFll2Rrp1/ZD4gxz4G17tOb1yIGutxLm./o1X.ztZt9DfrnofDHuq'),
	('Mattie', false, '$2y$10$zBTTW2eyc/l55Xg3/.ElIuGJD3oUBFn0Iq3QAeWmvEvKx4xG.e/h.'),
	('Russell', true, '$2y$10$MBGWbw9gbNqKmxnq85lbSOCoRsZ.HexSmaUFx42cm7YG/7jWt.O0.'),
	('Margie', true, '$2y$10$XvDa7KDL/w0aLcbWh5tKJelLi3zvb1UNv98/nrChoPhXXv3RvdwZW');

INSERT INTO chores (name, choredough)
	VALUES ('Bathroom – Downstairs', 5),
	('Bathroom – Upstairs', 5),
	('Batman - Downstairs', 5),
	('Batman – Upstairs', 5),
	('Bed', 0),
	('Bedroom', 0),
	('Bread', 30),
	('Car wipe down & trash', 10),
	('Critters', 15),
	('Dishes – Breakfast', 15),
	('Dishes – Dinner', 20),
	('Dust', 15),
	('Fingermarks – walls', 2),
	('Fires', 5),
	('Fix Breakfast', 15),
	('Fix Dinner', 30),
	('Fix Lunches', 15),
	('Garbages', 5),
	('Get Self Up', 0),
	('Laundry – 1 batch', 10),
	('Mop dining room, kitchen', 10),
	('Mudroom & Bathroom', 5),
	('Shovel Snow', 1),
	('Vacuum – Car', 15),
	('Vacuum Downstairs', 15),
	('Vacuum Upstairs', 15),
	('Windows', 3),
	('Wood', 3),
	('Special Assignment', 1);

INSERT INTO tasks (description)
	VALUES ('Clean w/ cleaner toilet'),
	('Clean w/ cleaner sink'),
	('Clean w/ cleaner tub'),
	('Clean w/ cleaner counters'),
	('Mop'),
	('Mirrors'),
	('All clutter on level surfaces'),
	('All clutter on level surfaces (including closet floor)'),
	('vacuum'),
	('Wash dirty clothes'),
	('Mix and bake on batch of bread'),
	('Corner of doom'),
	('Pots & Pans'),
	('Counters'),
	('Sweep floor'),
	('empty & fill Dishwasher'),
	('sinks'),
	('clear table'),
	('empty kitchen garbage'),
	('cobwebs all corners upstair and down'),
	('One doorway or equivalent?'),
	('Build one full fire'),
	('Empty all garbages in house and roll black garbage can out to curb'),
	('Wash one batch'),
	('fold one batch'),
	('Put away one batch'),
	('Sweep & Mop floors'),
	('cleaner in toilet & sinks'),
	('empty garbage'),
	('organize shoes and remove all all illegal shoes'),
	('shovel 1 minuet'),
	('Bed'),
	('Car wipe down & trash'),
	('Critters'),
	('Fix Breakfast'),
	('Fix Dinner'),
	('Fix Lunch'),
	('Get Self Up'),
	('Windows'),
	('Wood'),
	('1 minuet hard work on project for Mom or Dad');

INSERT INTO transactions ("date", description, user_id)
	VALUES ('2017-12-20'::timestamp, 'Starting Balance',
		(Select id FROM users WHERE name='Mattie')),
	('2017-12-20'::timestamp, 'Starting Balance',
		(Select id FROM users WHERE name='Joshua')),
	('2017-12-20'::timestamp, 'Starting Balance',
		(Select id FROM users WHERE name='Ammon'));

INSERT INTO transactions ("date", amount, description, user_id)
	VALUES ('2018-02-10'::timestamp, 12.25, 'Paid for 12/21 – 2/9',
		(Select id FROM users WHERE name='Mattie')),
	('2018-02-10'::timestamp, 4.00, 'Consecutive days FROM 2/1 – 2/9',
		(Select id FROM users WHERE name='Mattie')),
	('2018-02-10'::timestamp, 7.83, 'Paid for 12/21 – 2/9',
		(Select id FROM users WHERE name='Joshua')),
	('2018-02-10'::timestamp, 2.50, 'Consecutive days FROM 2/1 – 2/9',
		(Select id FROM users WHERE name='Joshua')),
	('2018-02-10'::timestamp, 16.50, 'Paid for 12/21 – 2/9',
		(Select id FROM users WHERE name='Ammon')),
	('2018-02-10'::timestamp, 2.00, 'Consecutive days FROM 2/1 – 2/9',
		(Select id FROM users WHERE name='Ammon')),
	('2018-02-10'::timestamp, -12.99, 'Purchased bow saw at Ace',
		(Select id FROM users WHERE name='Ammon'));

INSERT INTO chores_to_users (user_id, chore_id)
	VALUES (1,15), (1, 10), (1, 22), (1, 9), (1, 5), (1, 6), (1, 19),
	(2, 1), (2, 3), (2, 7), (2, 25), (2, 5), (2, 6), (2, 19),
	(3, 2), (3, 14), (3, 28), (3, 5), (3, 6), (3, 19);

INSERT INTO task_to_chore (chore_id, task_id, task_minuet_estimate)
	VALUES (1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, .5), (1, 5, 1), (1, 6, .5),
	(2, 1, 1), (2, 2, 1), (2, 3, 1), (2, 4, .5), (2, 5, 1), (2, 6, .5),
	(3, 7, 5),
	(4, 7, 5),
	(5, 32, 0),
	(6, 8, 0),
	(7, 11, 30),
	(8, 33, 10),
	(9, 34, 15),
	(10, 12, 2), (10, 13, 2), (10, 14, 1), (10, 15, 2),
	(10, 16, 3), (10, 17, 2), (10, 18, 2), (10, 19, 1),
	(11, 12, 2), (11, 13, 2), (11, 14, 3), (11, 15, 2),
	(11, 16, 4), (11, 17, 3), (11, 18, 3), (11, 19, 1),
	(12, 20, 15),
	(13, 21, 2),
	(14, 22, 5),
	(15, 35, 15),
	(16, 36, 30),
	(17, 37, 15),
	(18, 23, 5),
	(19, 38, 0),
	(20, 24, 2), (20, 25, 6), (20, 26, 2),
	(21, 5, 5),
	(22, 27, 1), (22, 28, 2), (22, 29, 1), (22, 30, 1),
	(23, 31, 1),
	(24, 9, 15),
	(25, 9, 15),
	(26, 9, 15),
	(27, 39, 3),
	(28, 40, 3),
	(29, 41, 1);

UPDATE users SET streak=2 WHERE name='Ammon';
