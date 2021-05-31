<?php

  // Note: This file should be included in another php file, so sqlConnect should already be included.
  // Student ID and Class ID should be defined as $id and $classID file where this is included.

  // Verify student is in current class. 
  // This may not be the case if user "Inspect Element" hidden "id" input.
  $sql = $conn->prepare("
    SELECT
      ID
    FROM
      students
    WHERE
      ID=? AND ClassID=?
  ");
  $sql->bind_param("ii", $id, $classID);
  $sql->execute();
  $result = $sql->get_result();

  // Return true if student is in class, false if not.
  // If specified student ID and class ID do not yield any results, student is not in class.
  return $result->num_rows > 0 ? true : false;

?>