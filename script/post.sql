CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title varchar(255) NOT NULL,
  description varchar(15000) NOT NULL,
  img varchar(1000) DEFAULT NULL,
  date timestamp DEFAULT NULL,
  uid int NOT NULL,
  cat varchar(45) DEFAULT NULL,
  FOREIGN KEY (uid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
