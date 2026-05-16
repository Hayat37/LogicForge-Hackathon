<?php
$host = 'sql207.byethost6.com';
$db   = 'b6_41934164_skillswap'; // your actual full db name
$user = 'b6_41934164';
$pass = 'G2e:CGJ$i42F6k^';

$conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>