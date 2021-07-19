<?php

  include("sqlConnect.php");

  // Retrieve teacher's mazes, stored as copied stories with Published = 2, from database.
  // Only get valid mazes, i.e. those with associated levels.
  $sql = $conn->prepare("
    SELECT DISTINCT
      stories.ID,
      stories.Name
    FROM
      stories
    WHERE
      stories.UploaderID=? AND stories.Published=2 AND
      EXISTS (
        SELECT
          ID
        FROM
          levels
        WHERE
          levels.StoryID = stories.ID
      )
  ");
  $sql->bind_param("i", $_SESSION['id']);
  $sql->execute();
  $results = $sql->get_result();

  // Format retrieved data into dropdown options.
  while ($row = $results->fetch_assoc())
  {
    echo '
      <option value="'.$row['ID'].'">'.$row['Name'].'</option>
    ';
  }

  $conn->close();

?>