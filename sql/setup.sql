-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;


CREATE TABLE github_users (
    github_username TEXT NOT NULL PRIMARY KEY,
    github_photo_url TEXT NOT NULL
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    username TEXT REFERENCES github_users(github_username)
);

CREATE TABLE quotes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL
);