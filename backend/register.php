<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include "db.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Use POST request only"]);
    exit;
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

// DEBUG (temporary)
file_put_contents("debug.txt", $json);

if (!$data) {
    echo json_encode([
        "error" => "No JSON received",
        "raw" => $json
    ]);
    exit;
}

$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

if ($name == "" || $email == "" || $password == "") {
    echo json_encode([
        "error" => "Missing fields",
        "debug" => $data
    ]);
    exit;
}

$sql = "INSERT INTO users (name, email, password)
        VALUES ('$name', '$email', '$password')";

if ($conn->query($sql)) {
    echo json_encode(["message" => "User registered successfully"]);
} else {
    echo json_encode(["error" => $conn->error]);
}
?>