<?php

  include("sqlConnect.php");

  // Retrieve teacher's mazes, stored as copied stories with Published = 2, from database.
  // Only get valid mazes, i.e. those with associated levels.
  // Note: LvlNum = 0 is for introductory cutscenes, so do not include this in validation.
  $sql = $conn->prepare("
    SELECT DISTINCT
      stories.ID,
      stories.Title,
      CASE
        WHEN mazes.Difficulty = 0 THEN '[Easy]'
        WHEN mazes.Difficulty = 1 THEN '[Medium]'
        ELSE '[Hard]'
      END AS Difficulty
    FROM
      stories
    INNER JOIN
      mazes
    ON
      mazes.StoryID = stories.ID
    WHERE
      stories.UploaderID=? AND stories.Published=2 AND
      EXISTS (
        SELECT
          ID
        FROM
          levels
        WHERE
          levels.StoryID = stories.ID AND levels.LvlNum > 0
      )
  ");
  $sql->bind_param("i", $_SESSION['id']);
  $sql->execute();
  $results = $sql->get_result();

  // Format retrieved data into dropdown options.
  while ($row = $results->fetch_assoc())
  {
    echo '
      <option value="'.$row['ID'].'">'.$row['Title'].' '.$row['Difficulty'].'</option>
    ';
  }

  $conn->close();

?>