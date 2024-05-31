<?php
session_start();
header('Content-Type: application/json');

// Conectar a la base de datos
$conn = new mysqli('localhost', 'root', 'root', 'tfg');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener los datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);
$formId = $data['formId'];

$response = ['success' => false, 'message' => '', 'errorField' => ''];

switch ($formId) {
    case 'account_form':
        $email = $data['email'];
        $username = $data['username'];
        $password = $data['password'];

        // Validar unicidad del email y username
        $email_check = $conn->prepare("SELECT * FROM USERS WHERE email = ?");
        $email_check->bind_param("s", $email);
        $email_check->execute();
        $email_check_result = $email_check->get_result();

        $username_check = $conn->prepare("SELECT * FROM USERS WHERE username = ?");
        $username_check->bind_param("s", $username);
        $username_check->execute();
        $username_check_result = $username_check->get_result();

        if ($email_check_result->num_rows > 0) {
            $response['message'] = 'Email already exists';
            $response['errorField'] = 'email';
            echo json_encode($response);
            exit();
        }

        if ($username_check_result->num_rows > 0) {
            $response['message'] = 'Username already exists';
            $response['errorField'] = 'username';
            echo json_encode($response);
            exit();
        }

        // Iniciar transacción
        $conn->begin_transaction();
        try {
            // Insertar el nuevo usuario en la tabla USERS
            $insert_user = $conn->prepare("INSERT INTO USERS (email, username) VALUES (?, ?)");
            $insert_user->bind_param("ss", $email, $username);
            $insert_user->execute();

            // Obtener el ID del usuario recién insertado
            $user_id = $conn->insert_id;

            // Insertar la contraseña en la tabla USERS_SECURITY
            $password_hashed = password_hash($password, PASSWORD_BCRYPT);
            $insert_security = $conn->prepare("INSERT INTO USERS_SECURITY (user_id, pwd) VALUES (?, ?)");
            $insert_security->bind_param("is", $user_id, $password_hashed);
            $insert_security->execute();

            // Guardar el ID del usuario en la sesión
            $_SESSION['user_id'] = $user_id;

            // Confirmar la transacción
            $conn->commit();

            $response['success'] = true;
            $response['message'] = 'User created successfully';
        } catch (Exception $e) {
            // Revertir la transacción si hay un error
            $conn->rollback();
            $response['message'] = 'Error creating user';
        }

        break;

    case 'profile_form':
        // Obtener el ID del usuario de la sesión
        if (!isset($_SESSION['user_id'])) {
            $response['message'] = 'User not logged in';
            echo json_encode($response);
            exit();
        }

        $user_id = $_SESSION['user_id'];
        $name = $data['name'];
        $surname = $data['surname'];
        $birthdate = $data['birthdate'];
        $gender = $data['gender'];

        // Actualizar los datos del perfil del usuario en la tabla USERS_PROFILES
        $update_profile = $conn->prepare("INSERT INTO USERS_PROFILES (user_id, birth_date, gender) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE birth_date = VALUES(birth_date), gender = VALUES(gender)");
        $update_profile->bind_param("iss", $user_id, $birthdate, $gender);

        // Actualizar los datos del usuario en la tabla USERS
        $update_user = $conn->prepare("UPDATE USERS SET name = ?, surname = ? WHERE id = ?");
        $update_user->bind_param("ssi", $name, $surname, $user_id);

        if ($update_profile->execute() && $update_user->execute()) {
            $response['success'] = true;
            $response['message'] = 'Profile updated successfully';
        } else {
            $response['message'] = 'Error updating profile';
        }

        break;

    case 'diet_form':
        if (!isset($_SESSION['user_id'])) {
            $response['message'] = 'User not logged in';
            echo json_encode($response);
            exit();
        }
        $user_id = $_SESSION['user_id'];
        $diet = $data['diet'];
        $allergies = implode(',', $data['allergies']);
        $goal = $data['goal'];

        // Actualizar los datos de la dieta del usuario en la tabla USERS_PROFILES
        $update_diet = $conn->prepare("UPDATE USERS_PROFILES SET diet_type = ?, food_allergies = ?, goal = ? WHERE user_id = ?");
        $update_diet->bind_param("ssii", $diet, $allergies, $goal, $user_id);

        if ($update_diet->execute()) {
            $response['success'] = true;
            $response['message'] = 'Diet information updated successfully';
        } else {
            $response['message'] = 'Error updating diet information';
        }
        break;

    case 'calories_form':
        if (!isset($_SESSION['user_id'])) {
            $response['message'] = 'User not logged in';
            echo json_encode($response);
            exit();
        }

        $user_id = $_SESSION['user_id'];
        $height = floatval($data['height']);
        $weight = floatval($data['weight']);
        $activity = intval($data['activity']);
        $estimated_calories = intval($data['estimated_calories']);

        $stmt = $conn->prepare("UPDATE USERS_PROFILES SET height = ?, weight = ?, activity = ?, estimated_calories = ? WHERE user_id = ?");
        $stmt->bind_param("ddiii", $height, $weight, $activity, $estimated_calories, $user_id);
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['message'] = 'Error updating calories information';
        }
        
        break;
    case 'get_user_info':
        if (!isset($_SESSION['user_id'])) {
            $response['message'] = 'User not logged in';
            echo json_encode($response);
            exit();
        }
        $user_id = $_SESSION['user_id'];

        $sql = "SELECT birth_date, gender FROM USERS_PROFILES WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user_info = $result->fetch_assoc();

        if ($user_info) {
            $birth_date = new DateTime($user_info['birth_date']);
            $today = new DateTime();
            $age = $today->diff($birth_date)->y;
            $gender = $user_info['gender'];

            $response['success'] = true;
            $response['age'] = $age;
            $response['gender'] = $gender;
        } else {
            $response['message'] = 'User information not found';
        }

        break;

    default:
        $response['message'] = 'Invalid form ID';
        break;
}

echo json_encode($response);
$conn->close();
