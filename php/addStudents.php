<?php

  session_start();

  include('sqlConnect.php');

  // Retrieve array of found students.
  $students = $_POST['students'];

  // Verify user is still logged in.
  // This may not be the case if user logged out in another tab/window.
  if (!isset($_SESSION['classID']))
  {
    $conn->close();
    // Return fail (false).
    $msg = "You are no longer logged in.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    exit;
  }

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

  // Determine if students were successfully added.
  if ($sql->affected_rows == 0)
  {
    // Insertion was unsuccessful, return fail (false).
    $msg = "Unsuccessful database insertion.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Insertion was succssful.

  // Update progress table, i.e. add entries for added students for
  // each maze previously/currently assigned (existent in table).
  $update = array("type" => 0);
  if (!include("updateProgress.php"))
  {
    // An error occured while updating the progress table.
    $msg = "Student(s) was successfully added, but initialization failed.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Student addition and progress update were both successful, return success.
  echo json_encode(array(
    "success" => true
  ));
  
  $conn->close();
  exit;
  
?>