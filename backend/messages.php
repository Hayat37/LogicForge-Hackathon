<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include "db.php";

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];


// =======================
// SEND MESSAGE (POST)
// =======================
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (
        empty($data['sender_id']) ||
        empty($data['receiver_id']) ||
        empty($data['message'])
    ) {
        echo json_encode(["error" => "Missing fields"]);
        exit;
    }

    $stmt = $conn->prepare("
        INSERT INTO messages (sender_id, receiver_id, message)
        VALUES (?, ?, ?)
    ");

    $stmt->bind_param(
        "iis",
        $data['sender_id'],
        $data['receiver_id'],
        $data['message']
    );

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Message sent"
        ]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}


// =======================
// GET CHAT (GET)
// =======================
elseif ($method === 'GET') {

    $user1 = $_GET['user1'] ?? null;
    $user2 = $_GET['user2'] ?? null;

    if (!$user1 || !$user2) {
        echo json_encode(["error" => "Missing users"]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT * FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
    ");

    $stmt->bind_param("iiii", $user1, $user2, $user2, $user1);
    $stmt->execute();

    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "messages" => $result
    ]);
}

?>