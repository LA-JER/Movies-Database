<?php
// fetch_data.php

// Replace these variables with your database connection details
$host = "cosc-257-node12.cs.amherst.edu";
$dbname = "postgres";
$user = "postgres";
$password = "movieDB";
$tableName = "movies";

// Establish a connection to the database
$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");

// Check if the connection is successful
if (!$conn) {
    die("Connection failed");
}

// Query to fetch data from the table
$query = "SELECT * FROM $tableName";
$result = pg_query($conn, $query);

// Check if the query was successful
if (!$result) {
    die("Query failed " . pg_last_error($conn));
}

// Fetch data from the result set
$movies = array();
while ($row = pg_fetch_assoc($result)) {
    $movies[] = $row;
}

// Close the database connection
pg_close($conn);

// Output data as JSON
header('Content-Type: application/json');
echo json_encode($movies);
?>

