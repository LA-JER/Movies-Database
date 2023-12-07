<?php
// fetch_sql_command.php

// Establish a connection to the database (Replace with your database credentials)
$host = "cosc-257-node12.cs.amherst.edu";
$user = "postgres";
$pass = "movieDB";
$db = "postgres";

$pdo = new PDO("pgsql:host=$host;dbname=$db;user=$user;password=$pass");

// Check if the 'query' parameter is provided
if (isset($_GET['query'])) {
    $query = $_GET['query'];

        // Prepare and execute the SQL query
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        // Fetch data as an associative array
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Output data as JSON
        header('Content-Type: application/json');
        echo json_encode($data);
    
} else {
    // 'query' parameter not provided
    echo "Query parameter is missing";
}
?>
