<?php

  // Note: This file should be included in another php file, so sqlConnect should already be included.
  // Maze ID should be defined as $mazeID where this is included.
  // Teacher and validity of maze should already be verified where this is included.

  // Retrieve total number of levels and students' current levels.
  // Current levels effectively tells what levels are complete, in progress, and not complete.
  // Note: LvlNum = 0 is for introductory cutscenes, so do not include this in COUNT.
  $sql = $conn->prepare("
    SELECT
      COUNT(DISTINCT levels.ID) AS Total,
      GROUP_CONCAT(DISTINCT progress.CurrLevel) AS Progress
    FROM
      levels
    LEFT JOIN
      progress
    ON
      progress.StoryID = levels.StoryID
    WHERE
      levels.StoryID=? AND levels.LvlNum > 0
  ");
  $sql->bind_param("i", $mazeID);
  $sql->execute();
  $row = $sql->get_result()->fetch_assoc();

  // Extract retrieved information.
  $totalLevels      = $row['Total'];
  $currLevelsString = $row['Progress'];

  // Initialize array to record students' levels progression.
  // Note: [0] => cumulative percentage, [1...n] => individual level progress.
  $progress = array_fill(0, $totalLevels+1, 0);

  if (!isset($currLevelsString))
  {
    // No student progression data found, maze may not have been assigned yet.
    // Return no progression as default.
    return $progress;
  }

  // Student progression data found, calculate cumulative data.
  
  // Convert string of students' current levels to array for future operations.
  $currLevels = explode(",", $currLevelsString);
  // Extract number of students based on number of "current levels" retrieved.
  $numStudents = count($currLevels);
  // Records total number of levels completed by all students.
  $totalLvlsComplete = 0;

  // Contribute each student's progression to cumulative data.
  foreach ($currLevels as $currLevel)
  {
    // Get number of levels completed by current student.
    $numLvlsCompleted = $currLevel - 1;

    if ($numLvlsCompleted > 0)
    {
      // Add to total completed by all students counter.
      $totalLvlsComplete += $numLvlsCompleted;

      // Increment completion counter for each level completed by this student.
      for ($i = $numLvlsCompleted; $i > 0; $i--)
      {
        $progress[$i]++;
      }
    }
  }

  // Calculate cumulative percentage of levels completed,
  // i.e. average of all students' individual progress percentages.
  $progress[0] = ($totalLvlsComplete / ($totalLevels * $numStudents)) * 100;
  // Calculate progress value for setLvlIndicators() to set indicators' colors.
  // Note: Range is 0.0 (none have completed) to 2.0 (all have completed) for setLvlIndicators().
  for ($i = 1; $i <= $totalLevels; $i++)
  {
    $progress[$i] = ($progress[$i] / $numStudents) * 2;
  }
  
  // Return students' cumulative progression data.
  return $progress;

?>