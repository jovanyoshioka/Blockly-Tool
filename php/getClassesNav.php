<?php

  include('sqlConnect.php');

  // Get all of teacher's classes.
  $sql = $conn->prepare("
    SELECT
      ClassID,
      Name
    FROM
      classes
    WHERE
      TeacherID=?
  ");
  $sql->bind_param("i", $_SESSION['id']);
  $sql->execute();
  $results = $sql->get_result();

  $conn->close();

  // Format retrieved class IDs and names into navigation bar links.
  // Note: navbar.php grabs these links via the above variable $classLinks.
  // Echoing $classLinks from this file to return causes an error as navbar.php already uses echo.
  $classLinks = '';
  while ($row = $results->fetch_assoc())
  {
    $classLinks .= '
      <a href="class.php?id='.$row['ClassID'].'&name='.$row['Name'].'">'.$row['Name'].'</a>
    ';
  }

?>