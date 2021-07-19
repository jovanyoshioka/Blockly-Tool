<?php

  session_start();

  include("sqlConnect.php");

  // Retrieve ID of selected maze.
  $studentID = $_POST['studentID'];
  $mazeID    = $_POST['mazeID'];

  // Verify teacher, student, and validity of maze, i.e. if it has associated levels.
  // Note: mazes are stored in stories with Published = 2; they are copies of published stories.
  // Note: $studentID = 0 should be validated as it gets cumulative progress.
  $sql = $conn->prepare("
    SELECT
      ID
    FROM
      stories
    WHERE
      stories.ID=? AND stories.Published=2 AND stories.UploaderID=? AND
      EXISTS (
        SELECT
          levels.ID
        FROM
          levels
        WHERE
          levels.StoryID = stories.ID
      ) AND
      EXISTS (
        SELECT
          students.ID
        FROM
          students
        WHERE
          (students.ID=? AND students.ClassID=?) OR ?=0
      )
  ");
  $sql->bind_param("iiiii", $mazeID, $_SESSION['id'], $studentID, $_SESSION['classID'], $studentID);
  $sql->execute();
  $result = $sql->get_result();

  if ($result->num_rows == 0)
  {
    // Invalid maze/student selected, throw error and stop process.
    $msg = "Information is invalid.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Valid maze/student selected, retrieve progress data.
  $progress = array();
  if ($studentID == 0)
  {
    // Get cumulative progression data.
    $progress = include("getCmltvProgress.php");
  } else
  {
    // Get total number of levels and student's progression data.
    // Note: no need to validate as teacher/student/maze already validated.
    $sql = $conn->prepare("
      SELECT
        COUNT(DISTINCT levels.ID) AS Total,
        progress.CurrLevel
      FROM
        levels
      LEFT JOIN
        progress
      ON
        progress.StoryID = levels.StoryID AND progress.StudentID=?
      WHERE
        levels.StoryID=? AND levels.LvlNum > 0
    ");
    $sql->bind_param("ii", $studentID, $mazeID);
    $sql->execute();
    $result = $sql->get_result();

    if ($row = $result->fetch_assoc())
    {
      // If student's current level could not be found (may not exist as maze may not be assigned), set as no progression.
      $currLevel   = isset($row['CurrLevel']) ? $row['CurrLevel'] : 1;
      $totalLevels = $row['Total'];
      // Format: [0] => cumulative percentage, [1...n] => individual level progress (for displayProgress(x);).
      $progress[0] = (($currLevel - 1) / $totalLevels) * 100;
      for ($i = 1; $i <= $totalLevels; $i++)
      {
        // Student has either completed (2.0) or not completed (0.0) level.
        $progress[$i] = $i < $currLevel ? 2.0 : 0.0;
      }
    }
  }

  // Return student (or cumulative) progression data.
  echo json_encode(array(
    "success"  => true,
    "progress" => $progress
  ));
  $conn->close();
  exit;

?>