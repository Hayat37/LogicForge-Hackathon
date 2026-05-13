<?php
$host = "localhost";
$user = "skillswap_user";
$password = "1234";
$dbname = "skillswap";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>