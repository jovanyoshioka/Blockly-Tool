<?php

  session_start();

  include("sqlConnect.php");

  // Retrieve ID of selected maze.
  $mazeID = $_POST['id'];

  // Get selected maze's information after verifying teacher and validity of maze, i.e. if it has associated levels.
  // Note: LvlNum = 0 is for introductory cutscenes, so do not include this in validation.
  // Note: mazes are stored in stories with Published = 2; they are copies of published stories.
  $sql = $conn->prepare("
    SELECT DISTINCT
      stories.Name,
      stories.Title,
      stories.Author,
      CASE
        WHEN stories.ID = assignments.StoryID THEN 1
        ELSE 0
      END AS Assigned
    FROM
      stories
    LEFT JOIN
      assignments
    ON
      stories.ID = assignments.StoryID AND assignments.ClassID=? AND assignments.Assigned = 1
    WHERE
      stories.ID=? AND stories.Published=2 AND stories.UploaderID=? AND
      EXISTS (
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
  $result = $sql->get_result();

  $mazeInfo = array();
  if ($result->num_rows > 0)
  {
    // Valid maze selected, store information.
    $row = $result->fetch_assoc();

    $mazeInfo = array(
      "name"     => $row['Name'],
      "title"    => $row['Title'],
      "author"   => $row['Author'],
      "assigned" => $row['Assigned'] == 1 ? true : false
    );
  } else
  {
    // Invalid maze selected, throw error and stop process.
    $msg = "Maze is invalid.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Get maze's cumulative progress as default.
  $mazeProgress = include("getCmltvProgress.php");

  $conn->close();

  // Successful process.
  echo json_encode(array(
    "success"      => true,
    "mazeInfo"     => $mazeInfo,
    "mazeProgress" => $mazeProgress
  ));
  
  exit;

?>