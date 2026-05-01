CREATE DATABASE educa_quiz_db;
USE educa_quiz_db;

CREATE SCHEMA IF NOT EXISTS quiz_platform;
USE quiz_platform;

CREATE TABLE avatars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  image_url VARCHAR(255)
);

CREATE TABLE colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  hex_value VARCHAR(20)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar_id INT NOT NULL,
  color_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT fk_user_avatar
FOREIGN KEY (avatar_id) REFERENCES avatars(id);

ALTER TABLE users
ADD CONSTRAINT fk_user_color
FOREIGN KEY (color_id) REFERENCES colors(id);

CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  questions JSON NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  total_score INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO avatars (name, image_url) VALUES
('Avatar Ninja', '/avatars/avatar1.png'),
('Avatar Robô', '/avatars/avatar2.png'),
('Avatar Cavaleiro', '/avatars/avatar3.png');

INSERT INTO colors (name, hex_value) VALUES
('Vermelho', '#FF5733'),
('Azul', '#3498DB'),
('Verde', '#2ECC71');