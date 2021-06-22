<?php

  session_start();

  include('sqlConnect.php');

  // Retrieve array of found students.
  $students = $_POST['students'];

  // Set base of SQL query.
  // VALUES will be made up of all students instead of INSERTing each student individually.
  // This method eliminates the need to access the database over several INSERT statements.
  $query = '
    INSERT INTO
      students (ClassID, FName, LName)
    VALUES 
  ';

  // Parameters for bind_param.
  $types  = '';
  $vals = array();

  // Iteratively add VALUES to SQL query and define parameters' types/values for bind_param.
  foreach ($students as $i=>$student)
  {
    // Add VALUES to SQL query.
    if ($i > 0) $query .= ',';
    $query .= '(?,?,?)';

    // Add parameters' types.
    $types .= 'iss';
    // Add parameters' values (ClassID, FName, LName).
    array_push($vals, $_SESSION['classID'], $student['fName'], $student['lName']);
  }

  // Add students to database.
  $sql = $conn->prepare($query);
  $sql->bind_param($types, ...$vals);
  $sql->execute();

  $conn->close();

  // Return success (true) or fail (false) based on insertion.
  echo json_encode(array(
    "success" => $sql->affected_rows > 0 ? true : false
  ));
  
  exit;
?>