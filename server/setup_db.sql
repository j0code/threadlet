DROP TABLE IF EXISTS forums; -- TESTING
CREATE TABLE IF NOT EXISTS forums (
	id         TEXT(16) NOT NULL PRIMARY KEY,
	name       TEXT(64) NOT NULL,
	created_at DATE     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS posts; -- TESTING
CREATE TABLE IF NOT EXISTS posts (
	id          TEXT(16)   NOT NULL PRIMARY KEY,
	forum_id    TEXT(16)   NOT NULL REFERENCES forums(id),
	name        TEXT(128)  NOT NULL,
	description TEXT(4096) NOT NULL,
	created_at  DATE       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO forums (id, name) VALUES ('lol',       'cool forum'); -- TESTING
INSERT INTO forums (id, name) VALUES ('forum2',    'second forum'); -- TESTING
INSERT INTO forums (id, name) VALUES ('forum3',    'cake recipes'); -- TESTING
INSERT INTO forums (id, name) VALUES ('the-forum', 'THE FORUM'); -- TESTING

-- .mode table

-- SELECT * FROM forums;
