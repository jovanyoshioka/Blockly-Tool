<?php

  session_start();

  include("sqlConnect.php");

  // Retrieve user's verified current level and supposed next level.
  $currLevel = $_SESSION['currLevel'];
  $nextLevel = $_POST['nextLevel'];

  // Verify supposed next level is correct next level.
  if ($nextLevel != ($currLevel + 1))
  {
    // Check failed, notify user.
    $msg = "Next level invalid.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Update user's current level in database.
  $sql = $conn->prepare("
    UPDATE
      progress
    SET
      CurrLevel=?
    WHERE
      StudentID=? AND StoryID=?
  ");
  $sql->bind_param("iii", $nextLevel, $_SESSION['id'], $_SESSION['mazeID']);
  $sql->execute();

  $conn->close();

  if ($sql->affected_rows == 0)
  {
    // Notify user of failure to update database.
    $msg = "Database update failed.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    exit;
  }

  // Update session and return success.
  $_SESSION['currLevel']++;
  echo json_encode(array(
    "success" => true
  ));

  exit;

?>