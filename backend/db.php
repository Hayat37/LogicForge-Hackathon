<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "skillswap";

$conn = new mysqli("sql200.infinityfree.com", "if0_41929215", "xmgAoyhTbd", "if0_41929215_XXX ");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>