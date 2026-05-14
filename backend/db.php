<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "skillswap";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>