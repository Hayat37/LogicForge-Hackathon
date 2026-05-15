<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
include "db.php";
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $result = $conn->query("
        SELECT skills.*, users.name as posted_by, users.bio as posted_by_bio
        FROM skills 
        JOIN users ON skills.user_id = users.id
        ORDER BY skills.created_at DESC
    ");
    $skills = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["success" => true, "skills" => $skills]);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $data["user_id"] ?? "";
    $title = $data["title"] ?? "";
    $type = $data["type"] ?? "";
    $description = $data["description"] ?? "";
    if ($user_id == "" || $title == "" || $type == "") {
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }
    $stmt = $conn->prepare("INSERT INTO skills (user_id, title, type, description) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $user_id, $title, $type, $description);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Skill posted successfully"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM skills WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $data['skill_id'], $data['user_id']);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Skill deleted"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}
?>