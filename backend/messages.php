<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "your_database_name");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user1 = $_GET['user1'];
    $user2 = $_GET['user2'];
    
    $query = "SELECT * FROM messages 
              WHERE (sender_id = $user1 AND receiver_id = $user2) 
              OR (sender_id = $user2 AND receiver_id = $user1) 
              ORDER BY created_at ASC";
    
    $result = $conn->query($query);
    $msgs = [];
    while($row = $result->fetch_assoc()) { $msgs[] = $row; }
    echo json_encode(["success" => true, "messages" => $msgs]);

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $sender = $data['sender_id'];
    $receiver = $data['receiver_id'];
    $text = mysqli_real_escape_string($conn, $data['message']);
    
    $query = "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($sender, $receiver, '$text')";
    if($conn->query($query)) {
        echo json_encode(["success" => true]);
    }
}
?>