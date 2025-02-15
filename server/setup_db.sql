DROP TABLE IF EXISTS forums; -- TESTING
CREATE TABLE IF NOT EXISTS forums (
	id         TEXT(16)  NOT NULL PRIMARY KEY,
	name       TEXT(128) NOT NULL,
	created_at DATE      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO forums (id, name) VALUES ('lol',       'cool forum'); -- TESTING
INSERT INTO forums (id, name) VALUES ('forum2',    'second forum'); -- TESTING
INSERT INTO forums (id, name) VALUES ('forum3',    'cake recipes'); -- TESTING
INSERT INTO forums (id, name) VALUES ('the-forum', 'THE FORUM'); -- TESTING

-- .mode table

-- SELECT * FROM forums;
