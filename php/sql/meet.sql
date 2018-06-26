CREATE TABLE Participant
(
	id SERIAL PRIMARY KEY,
	firtName varchar(80) NOT NULL,
	lastName varchar(80) NOT NULL,
	runnerNumber int NOT NULL,
	teamId int NOT NULL
);

CREATE TABLE Activity
(
	id SERIAL PRIMARY KEY,
	name varchar(80) NOT NULL,
	winner varchar(161) NOT NULL,
	"date-time" timestamp NOT NULL,
	location varchar(100) NOT NULL
);

CREATE TABLE Team
(
	id SERIAL PRIMARY KEY,
	name varchar(80) NOT NULL
);

CREATE TABLE ActivityTeam
(
	id SERIAL PRIMARY KEY,
	teamId int,
	activityId int
);
