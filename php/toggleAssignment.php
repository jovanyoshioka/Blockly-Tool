<?php

  session_start();

  include("sqlConnect.php");

  // Retrieve ID of maze to toggle.
  $mazeID = $_POST['id'];

  // Attempt to toggle maze assignment in database (Assigned: 0 <=> 1).
  $sql = $conn->prepare("
    UPDATE
      assignments
    SET
      Assigned = IF (Assigned = 0, 1, 0)
    WHERE
      StoryID=? AND ClassID=?
  ");
  $sql->bind_param("ii", $mazeID, $_SESSION['classID']);
  $sql->execute();

  if ($sql->affected_rows > 0)
  {
    // Maze has already been assigned once (table entry exists), so toggle was successful.
    $msg = "Maze assignment was successfully changed!";
    echo json_encode(array(
      "success" => true,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Maze has never been assigned (table entry does not exist), or maze is invalid.
  
  // Attempt to assign maze for first time (table insertion). If fail, maze invalid.
  $sql = $conn->prepare("
    INSERT INTO
      assignments (StoryID, ClassID)
    SELECT
      stories.ID, ?
    FROM
      stories
    WHERE
      stories.ID=? AND stories.Published = 2 AND stories.UploaderID=?
      AND EXISTS (
        SELECT
          levels.ID
        FROM
          levels
        WHERE
          levels.StoryID = stories.ID AND levels.LvlNum > 0
      )
  ");
  $sql->bind_param("iii", $_SESSION['classID'], $mazeID, $_SESSION['id']);
  $sql->execute();

  if ($sql->affected_rows == 0)
  {
    // Assignment insertion unsuccessful, input maze invalid.
    // This may be caused if user manually changes select option's ID via Inspect Element.
    $msg = "Maze is invalid.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Maze was successfully assigned for the first time (inserted into table).

  // Update progress table, i.e. add entries for each student in class for current maze.
  $update = array("id" => $mazeID, "type" => 2);
  if (!include("updateProgress.php"))
  {
    // An error occured while updating the progress table.
    $msg = "Maze assignment was successfully changed, but initialization failed!";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Maze assignment and progress update were both successful, return success.
  $msg = "Maze assignment was successfully changed!";
  echo json_encode(array(
    "success" => true,
    "msg"     => $msg
  ));

  $conn->close();
  exit;
  
?>