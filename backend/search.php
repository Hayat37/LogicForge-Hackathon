<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "db.php";

$keyword = isset($_GET['q']) ? "%" . $_GET['q'] . "%" : "%";
$type = isset($_GET['type']) ? $_GET['type'] : null;

if ($type) {
    $stmt = $conn->prepare("
        SELECT skills.*, users.name as posted_by 
        FROM skills 
        JOIN users ON skills.user_id = users.id
        WHERE (skills.title LIKE ? OR skills.description LIKE ?)
        AND skills.type = ?
        ORDER BY skills.created_at DESC
    ");
    $stmt->bind_param("sss", $keyword, $keyword, $type);
} else {
    $stmt = $conn->prepare("
        SELECT skills.*, users.name as posted_by 
        FROM skills 
        JOIN users ON skills.user_id = users.id
        WHERE skills.title LIKE ? OR skills.description LIKE ?
        ORDER BY skills.created_at DESC
    ");
    $stmt->bind_param("ss", $keyword, $keyword);
}

$stmt->execute();
$result = $stmt->get_result();
$skills = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(["success" => true, "results" => $skills]);
?>