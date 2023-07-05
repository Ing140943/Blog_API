CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  img varchar(700) DEFAULT NULL
);
