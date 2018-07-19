DROP FUNCTION insert_transaction() CASCADE;
DROP FUNCTION make_an_accomplishment() CASCADE;
DROP FUNCTION delete_an_accomplishment() CASCADE;
DROP VIEW chores_not_done_by_person;
DROP VIEW chores_done_by_person;
DROP VIEW current_task_per_chore_per_person;
DROP VIEW tasks_done_per_person_per_chore_by_day;
DROP VIEW current_chores_per_person;
DROP TABLE transaction;
DROP TABLE accomplishment;
DROP TABLE assignment;
DROP TABLE chore_task;
DROP TABLE task;
DROP TABLE chore;
DROP TABLE person;
DROP TYPE transactionType;

CREATE TYPE transactionType AS ENUM ('dough', 'bonus', 'purchase', 'jurnaled');

/******************************************************************************\
 * Person :: Users of the app
\******************************************************************************/
CREATE TABLE person
(
	id SERIAL PRIMARY KEY,
	name varchar(80) NOT NULL UNIQUE,
	password varchar(80) NOT NULL,
	is_admin bool DEFAULT false,
	account_balance real DEFAULT 0,
	streak int DEFAULT 0
);

/**********************************************************\
 * Chore :: Chores to be assigned to people. A group of tasks
\**********************************************************/
CREATE TABLE chore
(
	id SERIAL PRIMARY KEY,
	name varchar(100) NOT NULL UNIQUE
);

/**********************************************************\
 * Task :: The parts of a chore.
\**********************************************************/
CREATE TABLE task
(
	id SERIAL PRIMARY KEY,
	description text NOT NULL UNIQUE
);

/**********************************************************\
 * Assignment :: An assigned chore
\**********************************************************/
CREATE TABLE assignment
(
	id SERIAL PRIMARY KEY,
	person_id int references person(id) NOT NULL,
	chore_id int references chore(id) NOT NULL,
	assigned date DEFAULT (NOW() AT TIME ZONE 'MDT'),
	unassigned date
);

/**********************************************************\
 * Task_Chore :: conects tasks to chores
\**********************************************************/
CREATE TABLE chore_task
(
	id SERIAL PRIMARY KEY,
	task_id int references task(id) NOT NULL,
	chore_id int references chore(id) NOT NULL,
	task_minute_estimate real NOT NULL,
	time_estimate_is_fixed bool DEFAULT false,
	linked date DEFAULT (NOW() AT TIME ZONE 'MDT'),
	unlinked date
);

/**********************************************************\
 * Accomplishment :: When a task was completed
\**********************************************************/
CREATE TABLE accomplishment
(
	id SERIAL PRIMARY KEY,
	assignment_id int references assignment(id) NOT NULL,
	task_id int references task(id) NOT NULL,
	accomplished date DEFAULT (NOW() AT TIME ZONE 'MDT'),
	choredough real
);

/**********************************************************\
 * Transaction :: The transfer of Choredough
\**********************************************************/
CREATE TABLE transaction
(
	id SERIAL PRIMARY KEY,
	amount real NOT NULL,
	new_balance real, /* set by a trigger */
	transaction_date date DEFAULT (NOW() AT TIME ZONE 'MDT'),
	created_date timestamp DEFAULT (NOW() AT TIME ZONE 'MDT'),
	description text NOT NULL,
	transaction_type transactionType DEFAULT 'dough',
	person_id int references person(id) NOT NULL,
	chore_id int references assignment(id)
);

/*************************************************************\
 * chores assigned to a person right now
\*************************************************************/
CREATE OR REPLACE VIEW current_chores_per_person AS
SELECT chore_id, name, person_id
FROM assignment a
	INNER JOIN chore c ON a.chore_id = c.id
WHERE 1=1
	AND a.assigned <= (NOW() AT TIME ZONE 'MDT')
	AND (a.unassigned IS NULL OR (NOW() AT TIME ZONE 'MDT') < unassigned)
;

/**************************************************************\
 * the number of tasks done per person, per chore, by day
\**************************************************************/
CREATE OR REPLACE VIEW tasks_done_per_person_per_chore_by_day AS
SELECT count(1) task_done_count, accomplished, person_id, chore_id
FROM assignment a
	INNER JOIN accomplishment ac ON (a.id = ac.assignment_id)
WHERE 1=1
GROUP BY accomplished, person_id, chore_id
;

/**************************************************************\
 * the number of tasks assigned per person per chore right now
\**************************************************************/
CREATE OR REPLACE VIEW current_task_per_chore_per_person AS
SELECT count(1) as task_count, person_id, tc.chore_id
FROM assignment a
	INNER JOIN chore_task tc ON ( 1=1
		AND a.chore_id = tc.chore_id
		AND a.assigned <= tc.linked
		AND (a.unassigned IS NULL OR tc.linked < a.unassigned)
		AND (tc.unlinked IS NULL OR tc.unlinked <= a.unassigned)
	)
WHERE 1=1
	AND a.assigned <= (NOW() AT TIME ZONE 'MDT')
	AND (a.unassigned IS NULL OR (NOW() AT TIME ZONE 'MDT') < a.unassigned)
GROUP BY person_id, tc.chore_id
;

/**************************************************************\
 * list the chores that are assigned and done right now
\**************************************************************/
-- (so that means that the number of tasks assigned right now and the number of tasks done right now
--  are the same (per person, per chore))
CREATE OR REPLACE VIEW chores_done_by_person AS
SELECT ctpcpp.chore_id, name, ctpcpp.person_id
FROM current_chores_per_person ccpp
	JOIN current_task_per_chore_per_person ctpcpp
		ON (ccpp.person_id = ctpcpp.person_id AND ccpp.chore_id = ctpcpp.chore_id)
	JOIN tasks_done_per_person_per_chore_by_day tdpppcbd ON (1=1
		AND ccpp.person_id = tdpppcbd.person_id
		AND tdpppcbd.chore_id = ccpp.chore_id
		AND ctpcpp.task_count = tdpppcbd.task_done_count
	)
WHERE 1=1
;

/**************************************************************\
 * list the chores that are assigned and not done right now
\**************************************************************/
-- (so that means that the chores are assigned and
-- not in the assigned and done right now table)
CREATE OR REPLACE VIEW chores_not_done_by_person AS
SELECT cdbp.chore_id, cdbp.name, cdbp.person_id
	FROM current_chores_per_person ccpp
		LEFT OUTER JOIN chores_done_by_person cdbp
			ON (ccpp.chore_id = cdbp.chore_id AND ccpp.person_id = cdbp.person_id)
	WHERE 1=1
		AND cdbp.chore_id IS NULL
;

/******************************************************************************\
 * # TRIGGER # INSERT Transaction
\******************************************************************************/
CREATE FUNCTION insert_transaction() RETURNS trigger AS $insert_transaction$
BEGIN
	UPDATE person SET account_balance = account_balance + NEW.amount WHERE id=NEW.person_id;
	UPDATE transaction SET new_balance = (SELECT account_balance FROM person WHERE id = NEW.person_id)
	WHERE id=NEW.id;
	RETURN NEW;
END;
$insert_transaction$ LANGUAGE plpgsql;
-- Create the Trigger
CREATE TRIGGER insert_transaction AFTER INSERT ON transaction
FOR EACH ROW EXECUTE PROCEDURE insert_transaction();

/******************************************************************************\
 * # TRIGGER # Make an accomplishment (complete a task)
\******************************************************************************/
CREATE FUNCTION make_an_accomplishment() RETURNS trigger AS $make_an_accomplishment$
DECLARE
amount real;
time_estimate real;
chore int;
BEGIN
	-- if the associated task has a fixed time estimate set default choredough amount
	chore := (SELECT chore_id FROM assignment WHERE id=NEW.assignment_id);
	IF (SELECT time_estimate_is_fixed
		FROM chore_task WHERE task_id = NEW.task_id AND chore_id=chore)
	THEN
		time_estimate := (SELECT task_minute_estimate FROM chore_task WHERE task_id = NEW.task_id);
		UPDATE accomplishment SET choredough=time_estimate WHERE id=NEW.id;
	END IF;
	-- if all the tasks are done make a transaction after inserting
	IF NOT EXISTS(SELECT count(1)
		FROM assignment a
			LEFT OUTER JOIN accomplishment ac ON a.id = ac.assignment_id
		WHERE 1=1
			AND a.id=NEW.assignment_id
			AND ac.id IS NULL
			AND ac.accomplished=NEW.accomplished)
	THEN
		amount := (SELECT sum(choredough) FROM accomplishment ac
			INNER JOIN assignment a ON a.id=ac.assignment_id);
		INSERT INTO transaction (amount, person_id, chore_id, new_balance, description)
			VALUES (
				amount,
				(SELECT person_id FROM assignment WHERE assignment.id=NEW.assignment_id),
				(SELECT chore_id FROM assignment WHERE assignment.id=NEW.assignment_id),
				(SELECT account_balance FROM person WHERE person.id=(
					SELECT person_id FROM assignment WHERE assignment.id=NEW.assignment_id)),
				(SELECT name FROM chore WHERE id=(
					SELECT chore_id FROM assignment WHERE assignment.id=NEW.assignment_id))
			);
	END IF;
	-- if all the chore are done add to the streak
	--  TODO finish this
	--  IF NOT EXISTS SELECT count(1)
	--    FROM person p
	--      LEFT OUTER JOIN assignment a ON p.id = a.person_id
	--    WHERE 1=1
	--      AND a.assignment_id=New.assignment_id
	--      AND ac.id IS NULL
	--  IF NOT EXISTS(SELECT id FROM assignment WHERE person_id=NEW.person_id AND chore_completed=false)
	--  THEN UPDATE person SET streak = streak + 1 WHERE id=NEW.person_id;
	--  END IF;
RETURN NEW;
END;
$make_an_accomplishment$ LANGUAGE plpgsql;
-- Create the Trigger
CREATE TRIGGER make_an_accomplishment AFTER INSERT ON accomplishment
FOR EACH ROW EXECUTE PROCEDURE make_an_accomplishment();

/******************************************************************************\
 * # TRIGGER # Delete an accomplishment (uncomplete a task)
\******************************************************************************/
CREATE FUNCTION delete_an_accomplishment() RETURNS trigger AS $delete_an_accomplishment$
DECLARE
amount real;
BEGIN
	--  if all the tasks are done make a negative transaction before deleting
	IF NOT EXISTS(SELECT count(1)
		FROM assignment a
			LEFT OUTER JOIN accomplishment ac ON a.id = ac.assignment_id
		WHERE 1=1
			AND a.id=NEW.assignment_id
			AND ac.id IS NULL
			AND ac.accomplished=NEW.accomplished)
	THEN
		amount := (SELECT sum(choredough) FROM accomplishment ac
			INNER JOIN assignment a ON a.id=ac.assignment_id);
		INSERT INTO transaction (amount, person_id, chore_id, new_balance, description)
			VALUES (
				-amount,
				(SELECT person_id FROM assignment WHERE assignment.id=NEW.assignment_id),
				(SELECT chore_id FROM assignment WHERE assignment.id=NEW.assignment_id),
				(SELECT account_balance FROM person WHERE person.id=(
					SELECT person_id FROM assignment WHERE assignment.id=NEW.assignment_id)),
				(SELECT name FROM chore WHERE id=(
					SELECT chore_id FROM assignment WHERE assignment.id=NEW.assignment_id))
			);
	END IF;
RETURN NEW;
END;
$delete_an_accomplishment$ LANGUAGE plpgsql;
CREATE TRIGGER delete_an_accomplishment BEFORE DELETE ON accomplishment
FOR EACH ROW EXECUTE PROCEDURE delete_an_accomplishment();

INSERT INTO person (name, is_admin, password)
	VALUES ('Ammon', false, '$2y$10$hGjd2jiaH3v0tFTzWETZnOMdKrMCRHgTyXd.oj.c0Ta3Fw6HsRh7G'),
	('Joshua', false, '$2y$10$kFll2Rrp1/ZD4gxz4G17tOb1yIGutxLm./o1X.ztZt9DfrnofDHuq'),
	('Mattie', false, '$2y$10$zBTTW2eyc/l55Xg3/.ElIuGJD3oUBFn0Iq3QAeWmvEvKx4xG.e/h.'),
	('Russell', true, '$2y$10$MBGWbw9gbNqKmxnq85lbSOCoRsZ.HexSmaUFx42cm7YG/7jWt.O0.'),
	('Margie', true, '$2y$10$XvDa7KDL/w0aLcbWh5tKJelLi3zvb1UNv98/nrChoPhXXv3RvdwZW');

INSERT INTO chore (name)
	VALUES ('Bathroom – Downstairs'),
	('Bathroom – Upstairs'),
	('Batman - Downstairs'),
	('Batman – Upstairs'),
	('Bed'),
	('Bedroom'),
	('Bread'),
	('Car wipe down & trash'),
	('Critters'),
	('Dishes – Breakfast'),
	('Dishes – Dinner'),
	('Dust'),
	('Fingermarks – walls'),
	('Fires'),
	('Fix Breakfast'),
	('Fix Dinner'),
	('Fix Lunches'),
	('Garbages'),
	('Get Self Up'),
	('Laundry – 1 batch'),
	('Mop dining room, kitchen'),
	('Mudroom & Bathroom'),
	('Shovel Snow'),
	('Vacuum – Car'),
	('Vacuum Downstairs'),
	('Vacuum Upstairs'),
	('Windows'),
	('Wood'),
	('Special Assignment');

INSERT INTO task (description)
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
	('shovel 1 minute'),
	('Bed'),
	('Car wipe down & trash'),
	('Critters'),
	('Fix Breakfast'),
	('Fix Dinner'),
	('Fix Lunch'),
	('Get Self Up'),
	('Windows'),
	('Bring IN Wood'),
	('Work hard on project for Mom or Dad');

INSERT INTO transaction (amount, transaction_date, description, transaction_type, person_id)
	VALUES (12.25, '2018-02-10'::timestamp, 'Paid for 12/21 – 2/9', 'jurnaled',
		(Select id FROM person WHERE name='Mattie')),
	(4.00, '2018-02-10'::timestamp, 'Consecutive days FROM 2/1 – 2/9', 'bonus',
		(Select id FROM person WHERE name='Mattie')),
	(7.83, '2018-02-10'::timestamp, 'Paid for 12/21 – 2/9','jurnaled',
		(Select id FROM person WHERE name='Joshua')),
	(2.50, '2018-02-10'::timestamp, 'Consecutive days FROM 2/1 – 2/9', 'bonus',
		(Select id FROM person WHERE name='Joshua')),
	(16.50, '2018-02-10'::timestamp, 'Paid for 12/21 – 2/9','jurnaled',
		(Select id FROM person WHERE name='Ammon')),
	(2.00, '2018-02-10'::timestamp, 'Consecutive days FROM 2/1 – 2/9', 'bonus',
		(Select id FROM person WHERE name='Ammon')),
	(-12.99, '2018-02-10'::timestamp, 'Purchased bow saw at Ace', 'purchase',
		(Select id FROM person WHERE name='Ammon'));

INSERT INTO assignment (person_id, chore_id)
	VALUES (1,15), (1, 10), (1, 22), (1, 9), (1, 5), (1, 6), (1, 19),
	(2, 1), (2, 3), (2, 7), (2, 25), (2, 5), (2, 6), (2, 19),
	(3, 2), (3, 14), (3, 28), (3, 5), (3, 6), (3, 19);

INSERT INTO chore_task (chore_id, task_id, task_minute_estimate, time_estimate_is_fixed)
	VALUES (1, 1, 1, true), (1, 2, 1, true), (1, 3, 1, true),
	(1, 4, .5, true), (1, 5, 1, true), (1, 6, .5, true),
	(2, 1, 1, true), (2, 2, 1, true), (2, 3, 1, true),
	(2, 4, .5, true), (2, 5, 1, true), (2, 6, .5, true),
	(3, 7, 5, true),
	(4, 7, 5, true),
	(5, 32, 0, true),
	(6, 8, 0, true),
	(7, 11, 30, true),
	(8, 33, 10, true),
	(9, 34, 15, true),
	(10, 12, 2, true), (10, 13, 2, true), (10, 14, 1, true), (10, 15, 2, true),
	(10, 16, 3, true), (10, 17, 2, true), (10, 18, 2, true), (10, 19, 1, true),
	(11, 12, 2, true), (11, 13, 2, true), (11, 14, 3, true), (11, 15, 2, true),
	(11, 16, 4, true), (11, 17, 3, true), (11, 18, 3, true), (11, 19, 1, true),
	(12, 20, 15, true),
	(13, 21, 2, true),
	(14, 22, 5, true),
	(15, 35, 15, true),
	(16, 36, 30, true),
	(17, 37, 15, true),
	(18, 23, 5, true),
	(19, 38, 0, true),
	(20, 24, 2, true), (20, 25, 6, true), (20, 26, 2, true),
	(21, 5, 5, true),
	(22, 27, 1, true), (22, 28, 2, true), (22, 29, 1, true), (22, 30, 1, true),
	(23, 31, 1, false),
	(24, 9, 15, true),
	(25, 9, 15, true),
	(26, 9, 15, true),
	(27, 39, 3, true),
	(28, 40, 3, false),
	(29, 41, 1, false);

INSERT INTO accomplishment (assignment_id, task_id, accomplished)
	VALUES (1, 1, '2018-10-17'::date);

UPDATE person SET streak=2 WHERE name='Ammon';
