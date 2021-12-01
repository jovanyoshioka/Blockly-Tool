<?php

  session_start();

  include('sqlConnect.php');

  // Retrieve passed maze ID.
  $mazeID = $_POST['id'];

  // Delete all data associated with maze: copy of story, levels, mazes, and cutscenes; maze assignments and progress.
  // Verify user is permitted to delete maze by comparing uploader/user ids.
  $sql = $conn->prepare("
    DELETE
        assignments, cutscenes, levels, mazes, progress, stories
    FROM stories
    LEFT JOIN assignments ON assignments.StoryID = stories.ID
    LEFT JOIN cutscenes   ON cutscenes.StoryID   = stories.ID
    LEFT JOIN levels      ON levels.StoryID      = stories.ID
    LEFT JOIN mazes       ON mazes.StoryID       = stories.ID
    LEFT JOIN progress    ON progress.StoryID    = stories.ID
    WHERE
        stories.ID=? AND stories.UploaderID=?
  ");
  $sql->bind_param("ii", $mazeID, $_SESSION['id']);
  $sql->execute();

  $conn->close();

  // Determine if maze was successfully deleted.
  if ($sql->affected_rows > 0)
  {
    // Deletion was succssful, return URL for refresh-based notification.
    // Note: Reloading for default "Maze Analytics" display.
    $url = "class.php?id=".$_SESSION['classID']."&name=".$_SESSION['className']."&notify=Maze was successfully deleted from your account!&notifyType=1";
    echo json_encode(array(
        "success" => true,
        "msg"     => $url
    ));
  } else
  {
    // Deletion was unsuccessful, return fail (false).
    $msg = "Unsuccessful database deletion.";
    echo json_encode(array(
    "success" => false,
    "msg"     => $msg
    ));
  }

  exit;

?>