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
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Delete student from class.
  $sql = $conn->prepare("
    DELETE FROM
      students
    WHERE
      ID=?
  ");
  $sql->bind_param("i", $id);
  $sql->execute();

  // Determine if student was successfully deleted.
  if ($sql->affected_rows == 0)
  {
    // Deletion was unsuccessful, return fail (false).
    $msg = "Unsuccessful database deletion.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Deletion was succssful.

  // Update progress table, i.e. delete all entries of deleted student.
  $update = array("id" => $id, "type" => 1);
  if (!include("updateProgress.php"))
  {
    // An error occurred while updating the progress table.
    $msg = "Student was successfully deleted, but cleansing failed.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Student deletion and progress update were both successful, return success.
  echo json_encode(array(
    "success" => true
  ));

  $conn->close();
  exit;

?>