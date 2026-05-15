<?php
$host = "localhost";
$user = "skillswap_user";
$password = "skills123";
$dbname = "skillswap";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode([
        "error" => "Connection failed: " . $conn->connect_error
    ]));
}
?>