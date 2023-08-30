<?php

  session_start();

  include('sqlConnect.php');

  // Retrieve entered student information.
  $id       = $_POST['id'];
  $fName    = $_POST['fName'];
  $lName    = $_POST['lName'];
  // Password may be empty if student has not yet logged in, or teacher wishes to reset it.
  $pwd = empty($_POST['pwd']) ? NULL : $_POST['pwd'];
  
  $classID = $_SESSION['classID'];

  // Verify student is in current class. 
  if (!include('verifyStudent.php'))
  {
    // Student is not in current class, throw error and stop edit process.
    $msg = "Student is not in this class.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Edit student information in database.
  $sql = $conn->prepare("
    UPDATE
      students
    SET
      FName=?, LName=?, Password=?
    WHERE
      ID=?
  ");
  $sql->bind_param("sssi", $fName, $lName, $pwd, $id);
  $sql->execute();

  $conn->close();

  // Return success (true) or fail (false) based on update.
  echo json_encode(array(
    "success" => $sql->affected_rows > 0 ? true : false,
    "msg"     => $sql->affected_rows > 0 ? "" : "Database update failed."
  ));

  exit;

?>