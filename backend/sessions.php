<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "db.php";

$method = $_SERVER['REQUEST_METHOD'];


// =======================
// POST: Create session
// =======================
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['requester_id']) || empty($data['skill_id'])) {
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $requester_id = $data['requester_id'];
    $skill_id = $data['skill_id'];
    $message = $data['message'] ?? "";

    // Get skill owner
    $check = $conn->prepare("SELECT user_id FROM skills WHERE id = ?");
    $check->bind_param("i", $skill_id);
    $check->execute();
    $skill = $check->get_result()->fetch_assoc();

    if (!$skill) {
        echo json_encode(["error" => "Skill not found"]);
        exit;
    }

    // Prevent self request
    if ($skill['user_id'] == $requester_id) {
        echo json_encode(["error" => "You cannot request your own skill"]);
        exit;
    }

    // Prevent duplicates
    $dupCheck = $conn->prepare("
        SELECT id FROM sessions 
        WHERE requester_id = ? AND skill_id = ?
    ");
    $dupCheck->bind_param("ii", $requester_id, $skill_id);
    $dupCheck->execute();
    $dupCheck->store_result();

    if ($dupCheck->num_rows > 0) {
        echo json_encode(["error" => "You already requested this session"]);
        exit;
    }

    // Insert session
    $stmt = $conn->prepare("
        INSERT INTO sessions (requester_id, skill_id, message)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param("iis", $requester_id, $skill_id, $message);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Session requested successfully"
        ]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}


// =======================
// GET: Fetch sessions
// =======================
elseif ($method === 'GET') {

    $user_id = $_GET['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(["error" => "User ID required"]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT 
            sessions.id,
            sessions.status,
            sessions.message,
            sessions.created_at,
            skills.title AS skill_title,
            skills.type AS skill_type,
            users.id AS requester_id,
            users.name AS requester_name
        FROM sessions
        JOIN skills ON sessions.skill_id = skills.id
        JOIN users ON sessions.requester_id = users.id
        WHERE skills.user_id = ? OR sessions.requester_id = ?
        ORDER BY sessions.created_at DESC
    ");

    $stmt->bind_param("ii", $user_id, $user_id);
    $stmt->execute();

    $sessions = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "sessions" => $sessions
    ]);
}


// =======================
// PUT: Accept / Decline
// =======================
elseif ($method === 'PUT') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['session_id']) || empty($data['status'])) {
        echo json_encode(["error" => "Missing fields"]);
        exit;
    }

    $allowed = ['accepted', 'declined'];

    if (!in_array($data['status'], $allowed)) {
        echo json_encode(["error" => "Invalid status"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE sessions 
        SET status = ? 
        WHERE id = ?
    ");

    $stmt->bind_param("si", $data['status'], $data['session_id']);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Session " . $data['status']
        ]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}
?>