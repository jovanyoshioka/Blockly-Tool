<?php

  session_start();

  include('sqlConnect.php');

  // Retrieve entered student and class IDs.
  $id = $_POST['id'];
  $classID = $_SESSION['classID'];

  // Verify student is in current class. 
  if (!include('verifyStudent.php'))
  {
    // Student is not in current class, throw error and stop delete process.
    $msg = "Student is not in this class.";
    echo json_encode(array(
      "success"=>false,
      "msg"=>$msg
    ));
    $conn->close();
    exit;
  }

  // Delete student from class in database.
  $sql = $conn->prepare("
    DELETE FROM
      students
    WHERE
      ID=?
  ");
  $sql->bind_param("i", $id);
  $sql->execute();

  $conn->close();

  // Return success (true) or fail (false) based on deletion.
  echo json_encode(array(
    "success" => $sql->affected_rows > 0 ? true : false
  ));

  exit;

?>