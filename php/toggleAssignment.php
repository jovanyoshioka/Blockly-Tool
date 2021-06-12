<?php

  session_start();

  include("sqlConnect.php");

  // Retrieve ID of maze to toggle.
  $mazeID = $_POST['id'];

  // Attempt to unassign maze (i.e. delete from table), and check for success.
  // This is to distinguish if maze is assigned with less queries than selecting to distinguish.
  // Note: A maze is assigned if it exists in the table, not assigned if does not exist.
  $sql = $conn->prepare("
    DELETE FROM
      assignments
    WHERE
      StoryID=? AND ClassID=?
  ");
  $sql->bind_param("ii", $mazeID, $_SESSION['classID']);
  $sql->execute();

  if ($sql->affected_rows > 0)
  {
    // Maze previously assigned, and successfully unassigned maze.
    $msg = "Maze was successfully unassigned!";
    echo json_encode(array(
      "success"  => true,
      "msg"      => $msg,
      "assigned" => false
    ));
    $conn->close();
    exit;
  }

  // Maze is either currently unassigned or does not exist. Attempt to assign.
  // Verify teacher is uploader of specified maze ID.
  $sql = $conn->prepare("
    INSERT INTO
      assignments (StoryID, ClassID)
    SELECT
      ?, ?
    FROM
      stories
    WHERE
      ID=? AND Published=2 AND UploaderID=?
  ");
  $sql->bind_param("iiii", $mazeID, $_SESSION['classID'], $mazeID, $_SESSION['id']);
  $sql->execute();

  $conn->close();

  // Check success of query to determine if maze was successfully assigned or does not exist.
  if ($sql->affected_rows > 0)
  {
    // Maze previously unassigned, and successfully assigned maze.
    $msg = "Maze was successfully assigned!";
    echo json_encode(array(
      "success"  => true,
      "msg"      => $msg,
      "assigned" => true
    ));
  } else
  {
    // Maze does not exist or user is not uploader.
    // This may be caused if user manually changes select option's ID via Inspect Element.
    $msg = "Maze does not exist.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
  }

  exit;

?>