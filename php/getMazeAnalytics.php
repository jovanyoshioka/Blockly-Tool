<?php

  session_start();

  include("sqlConnect.php");

  // Retrieve ID of selected maze.
  $mazeID = $_POST['id'];

  // Get selected maze's information.
  // Note: mazes are stored in stories with Published = 2; they are copies of published stories.
  $sql = $conn->prepare("
    SELECT
      stories.Title,
      stories.Author,
      CASE
        WHEN assignments.StoryID = stories.ID THEN 1
        ELSE 0
      END AS Assigned
    FROM
      stories
    LEFT JOIN
      assignments
    ON
      stories.ID = assignments.StoryID AND ClassID=?
    WHERE
      stories.ID=? AND stories.Published=2 AND stories.UploaderID=?
  ");
  $sql->bind_param("iii", $_SESSION['classID'], $mazeID, $_SESSION['id']);
  $sql->execute();
  $result = $sql->get_result();

  $mazeInfo = array();
  if ($result->num_rows > 0)
  {
    $row = $result->fetch_assoc();

    $mazeInfo = array(
      "title"    => $row['Title'],
      "author"   => $row['Author'],
      "assigned" => $row['Assigned'] == 1 ? true : false
    );
  } else
  {
    // Invalid maze selected, throw error and stop process.
    $msg = "Maze does not exist.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  $conn->close();

  // Successful process.
  echo json_encode(array(
    "success"  => true,
    "mazeInfo" => $mazeInfo
  ));
  
  exit;

?>