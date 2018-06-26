CREATE TABLE users
(
	id SERIAL PRIMARY KEY,
	firtName varchar(80) NOT NULL,
	lastName varchar(80)
);

CREATE TABLE notes
(
	id SERIAL PRIMARY KEY,
	contents text NOT NULL,
	title varchar(100) NOT NULL
);

CREATE TABLE conferences
(
	id SERIAL PRIMARY KEY,
	isApril bool NOT NULL,
	year int NOT NULL
);

CREATE TABLE talks
(
	id SERIAL PRIMARY KEY,
	title varchar(100) NOT NULL
);

CREATE TABLE speaker
(
	id SERIAL PRIMARY KEY,
	firtName varchar(80) NOT NULL,
	lastName varchar(80) NOT NULL
);
