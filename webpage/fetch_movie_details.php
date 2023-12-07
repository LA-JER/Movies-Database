<?php

// Database connection details
$host = "cosc-257-node12.cs.amherst.edu";
$dbname = "postgres";
$user = "postgres";
$password = "movieDB";
$tableName = "movies";


try {
    // Establish a connection to the database
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);

    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the movieID from the request parameters
    $movieid = $_GET['movieid'];

    // Fetch movie details
    $stmtMovie = $pdo->prepare('SELECT * FROM movies WHERE movieid = :movieid');
    $stmtMovie->bindParam(':movieid', $movieid);
    $stmtMovie->execute();
    $movieDetails = $stmtMovie->fetch(PDO::FETCH_ASSOC);

    // Fetch cast members who participated in the movie
    $stmtCast = $pdo->prepare('
        SELECT mc.*
        FROM movie_cast mc
        JOIN participates p ON mc.castid = p.castid
        WHERE p.movieid = :movieid
    ');
    $stmtCast->bindParam(':movieid', $movieid);
    $stmtCast->execute();
    $castMembers = $stmtCast->fetchAll(PDO::FETCH_ASSOC);

    // Combine movie details and cast members into a single array
    $result = [
        'movieDetails' => $movieDetails,
        'castMembers' => $castMembers,
    ];

    // Return the result as JSON
    header('Content-Type: application/json');
    echo json_encode($result);
} catch (PDOException $e) {
    // Handle database errors
    echo "Error: " . $e->getMessage();
}
?>
