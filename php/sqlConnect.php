<?php

  // Connection information.
  $DB_NAME = "codeastory";
  $DB_USER = "root";
  $DB_PASSWORD = "";
  $DB_HOST = "localhost";
  $DB_CHARSET = "utf8";

  // Create connection to database.
  $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);

  // Check connection.
  if ($conn->connect_error)
  {
    die("Connection failed: " . $conn->connect_error);
  }

?>