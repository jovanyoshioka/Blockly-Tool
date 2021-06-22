<?php

  session_start();

  include("sqlConnect.php");

  // Retrieve entered class name.
  $className = $_POST['name'];

  // Generate random class ID not already existent.
  $classID = 0;
  while (true)
  {
    // Get randomized ID.
    $classID = mt_rand(100000, 999999);

    // Check if already existent in database.
    $sql = $conn->prepare("
      SELECT
        ID
      FROM
        classes
      WHERE
        ClassID=?
    ");
    $sql->bind_param("i", $classID);
    $sql->execute();
    $result = $sql->get_result();

    // Proceed with class creation if class ID not already existent.
    if ($result->num_rows == 0) break;
  }

  // Create class in database.
  $sql = $conn->prepare("
    INSERT INTO
      classes (ClassID, Name, TeacherID)
    VALUES
      (?, ?, ?)
  ");
  $sql->bind_param("isi", $classID, $className, $_SESSION['id']);
  $sql->execute();

  $conn->close();

  if ($sql->affected_rows > 0)
  {
    // Class was successfully created.
    echo json_encode(array(
      "success"   => true,
      "classID"   => $classID,
      "className" => $className
    ));
  } else
  {
    // Class was not successfully created.
    echo json_encode(array(
      "success" => false
    ));
  }

  exit;

?>