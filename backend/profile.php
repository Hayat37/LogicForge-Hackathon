<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "db.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

    if (!$user_id) {
        echo json_encode(["error" => "User ID required"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, name, email, bio, created_at FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        echo json_encode(["error" => "User not found"]);
        exit;
    }

    $stmt2 = $conn->prepare("SELECT id, title, type, description, created_at FROM skills WHERE user_id = ? ORDER BY created_at DESC");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $skills = $stmt2->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "user" => $user,
        "skills" => $skills
    ]);

} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['user_id']) || !isset($data['bio'])) {
        echo json_encode(["error" => "Missing fields"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE users SET bio = ? WHERE id = ?");
    $stmt->bind_param("si", $data['bio'], $data['user_id']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Profile updated"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}
?>