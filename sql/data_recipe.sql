USE tfg;

-- Insertar datos en la tabla USERS
INSERT INTO USERS (name, surname, email, username) VALUES 
('John', 'Doe', 'john.doe@example.com', 'johndoe'),
('Jane', 'Smith', 'jane.smith@example.com', 'janesmith'),
('Alice', 'Johnson', 'alice.johnson@example.com', 'alicejohnson'),
('Bob', 'Brown', 'bob.brown@example.com', 'bobbrown'),
('Charlie', 'Davis', 'charlie.davis@example.com', 'charliedavis');

-- Insertar datos en la tabla USERS_CONTACT
INSERT INTO USERS_CONTACT (user_id, address, tel) VALUES 
(1, '123 Main St, Anytown, USA', '555-1234'),
(2, '456 Oak St, Othertown, USA', '555-5678'),
(3, '789 Pine St, Sometown, USA', '555-8765'),
(4, '321 Maple St, Anycity, USA', '555-4321'),
(5, '654 Elm St, Yourtown, USA', '555-6789');

-- Insertar datos en la tabla USERS_SECURITY
INSERT INTO USERS_SECURITY (user_id, pwd, admin, confirmed, token) VALUES 
(1, 'password1', TRUE, TRUE, 'token1'),
(2, 'password2', FALSE, TRUE, 'token2'),
(3, 'password3', FALSE, FALSE, 'token3'),
(4, 'password4', FALSE, TRUE, 'token4'),
(5, 'password5', TRUE, FALSE, 'token5');

-- Insertar datos en la tabla USERS_PROFILES
INSERT INTO USERS_PROFILES (user_id, photo, gender, birth_date, diet_type, food_allergies, height, weight, activity, estimated_calories, goal) VALUES 
(1, 'photo1.jpg', 'M', '1980-01-01', 'vegetarian', '', 175.50, 70.50, 2, 2500, 0),
(2, 'photo2.jpg', 'F', '1990-02-02', 'vegan', '', 165.00, 60.00, 3, 2000, 1),
(3, 'photo3.jpg', 'F', '1985-03-03', 'omnivore', '', 170.00, 65.00, 1, 2200, 2),
(4, 'photo4.jpg', 'M', '1995-04-04', 'pescetarian', '', 180.00, 75.00, 3, 2700, 0),
(5, 'photo5.jpg', 'M', '2000-05-05', 'vegetarian', '', 160.00, 55.00, 1, 1800, 1);
