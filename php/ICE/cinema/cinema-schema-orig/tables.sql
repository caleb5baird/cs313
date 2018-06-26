CREATE TABLE ratings
(
	id SERIAL PRIMARY KEY,
	code VARCHAR(10) UNIQUE NOT NULL,
	name VARCHAR(100)
);

CREATE TABLE movies
(
	id SERIAL PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	year SMALLINT,
	rating_id INT REFERENCES ratings(id)
);

INSERT INTO ratings(code, name)
	VALUES ('G', 'General Audiences'),
		('PG', 'Parental Guidence Suggested'),
		('PG-13', 'Parents Strongly Cautioned'),
		('R', 'Restricted'),
		('NR', 'Not Rated')
;

INSERT INTO movies(title, year, rating_id)
	VALUES ('The Incredibles 2', 2018,
			(SELECT id FROM ratings WHERE code='PG')),
		('Star Wars: A New Hope', 1977,
			(SELECT id FROM ratings WHERE code='PG')),
		('Star Wars: Empire Strikes Back', NULL,
			(SELECT id FROM ratings WHERE code='NR')),
		('Logan', 2017,
			(SELECT id FROM ratings WHERE code='R')),
		('Finding Nemo', 2003,
			(SELECT id FROM ratings WHERE code='G'))
;

SELECT
