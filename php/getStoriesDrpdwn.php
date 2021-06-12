<?php

  include("sqlConnect.php");

  // Retrieve teachers' mazes, stored as copied stories with Published = 2, from database.
  $sql = $conn->prepare("
    SELECT
      ID,
      Title
    FROM
      stories
    WHERE
      UploaderID=? AND Published=2
  ");
  $sql->bind_param("i", $_SESSION['id']);
  $sql->execute();
  $results = $sql->get_result();

  while ($row = $results->fetch_assoc())
  {
    echo '
      <option value="'.$row['ID'].'">'.$row['Title'].'</option>
    ';
  }

  $conn->close();

?>