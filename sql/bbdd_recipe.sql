USE tfg;

CREATE TABLE USERS(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  surname VARCHAR(50),
  email VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE USERS_CONTACT(
  user_id INT NOT NULL,
  address VARCHAR(255),
  tel VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE TABLE USERS_SECURITY(
  user_id INT NOT NULL,
  pwd VARCHAR(255) NOT NULL,
  admin BOOLEAN DEFAULT FALSE,
  confirmed BOOLEAN DEFAULT FALSE,
  token VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE TABLE USERS_PROFILES(
  user_id INT NOT NULL,
  photo VARCHAR(255),
  gender CHAR(1) CHECK (gender IN ('M', 'F')), -- M=Male, F=Female
  birth_date DATE,
  diet_type VARCHAR(50) CHECK (diet_type IN ('omnivore','pescetarian', 'vegetarian', 'vegan')),
  food_allergies VARCHAR(255),
  height DECIMAL(5,2), -- e.g., 175.50 cm
  weight DECIMAL(5,2), -- e.g., 70.50 kg
  activity INT(1) CHECK (activity IN (0, 1, 2, 3)),
  estimated_calories INT,
  goal INT(1) CHECK (goal IN (0, 1, 2)), -- Añadido el campo de objetivos aquí
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);
