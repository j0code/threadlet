DROP TABLE IF EXISTS messages; -- TESTING
DROP TABLE IF EXISTS sessions; -- TESTING
DROP TABLE IF EXISTS posts; -- TESTING
DROP TABLE IF EXISTS forums; -- TESTING
DROP TABLE IF EXISTS users; -- TESTING

CREATE TABLE IF NOT EXISTS users (
	id          TEXT(20)   NOT NULL PRIMARY KEY, -- snowflake
	created_at  DATE       NOT NULL DEFAULT CURRENT_TIMESTAMP -- joined date
);

CREATE TABLE IF NOT EXISTS forums (
	id         TEXT(16) NOT NULL PRIMARY KEY,
	owner_id   TEXT(20) NOT NULL REFERENCES users(id), -- snowflake
	name       TEXT(64) NOT NULL,
	created_at DATE     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
	id          TEXT(16)    NOT NULL PRIMARY KEY,
	forum_id    TEXT(16)    NOT NULL REFERENCES forums(id),
	poster_id   TEXT(20)    NOT NULL REFERENCES users(id), -- snowflake
	name        TEXT(128)   NOT NULL,
	description TEXT(16384) NOT NULL,
	edited_at   DATE        NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_at  DATE        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
	id          TEXT(16)   NOT NULL PRIMARY KEY,
	user_id     TEXT(20)   NOT NULL REFERENCES users(id), -- snowflake 
	token       TEXT(30)   NOT NULL UNIQUE, -- Bearer token
	expires_at  DATE       NOT NULL DEFAULT (datetime('now', '+2 hours')),
	created_at  DATE       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
	id         TEXT(16)   NOT NULL PRIMARY KEY,
	post_id    TEXT(16)   NOT NULL REFERENCES posts(id),
	author_id  TEXT(20)   NOT NULL REFERENCES users(id), -- snowflake
	content    TEXT(4096) NOT NULL,
	edited_at  DATE       NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_at DATE       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
	id         TEXT(16) NOT NULL PRIMARY KEY,
	forum_id   TEXT(16) NOT NULL REFERENCES forums(id),
	emoji      TEXT(16) NOT NULL, -- either emoji char or custom emoji id
	name       TEXT(20) NOT NULL,
	edited_at  DATE     NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_at DATE     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_tags (
	tag_id     TEXT(16) NOT NULL REFERENCES tags(id),
	post_id    TEXT(16) NOT NULL REFERENCES forums(id),
	edited_at  DATE     NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_at DATE     NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT PK_post_tags PRIMARY KEY (tag_id, post_id)
);

--INSERT INTO users  (id) VALUES (''); -- TESTING
--INSERT INTO forums (id, owner_id, name) VALUES ('lol',       '', 'cool forum'); -- TESTING
--INSERT INTO forums (id, owner_id, name) VALUES ('forum2',    '', 'second forum'); -- TESTING
--INSERT INTO forums (id, owner_id, name) VALUES ('forum3',    '', 'cake recipes'); -- TESTING
--INSERT INTO forums (id, owner_id, name) VALUES ('the-forum', '', 'THE FORUM'); -- TESTING

-- .mode box

-- SELECT * FROM forums;
