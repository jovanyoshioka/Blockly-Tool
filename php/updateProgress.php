<?php

  // Note: This file should be included in another php file, so sqlConnect should already be included.
  // Type of update (add(0)/delete(1) student, assign(2)/delete(3) maze)
  // and ID defined as $update = array("id" => x, "type" => 0/1/2/3).

  $sql = NULL;
  switch ($update['type'])
  {
    case 0:
      // Update for student addition.
      // Add entries for added students for each maze previously/currently assigned (existent in table).
      $sql = $conn->prepare("
        INSERT INTO
          progress (StudentID, StoryID)
        SELECT
          students.ID,
          assignments.StoryID
        FROM
          students,
          assignments
        WHERE
          students.ClassID=? AND assignments.ClassID = students.ClassID
          AND NOT EXISTS (
            SELECT
              progress.ID
            FROM
              progress
            WHERE
              progress.StudentID = students.ID AND progress.StoryID = assignments.StoryID
          )
      ");
      $sql->bind_param("i", $_SESSION['classID']);
      break;
    case 1:
      // Update for student deletion.
      // Delete all entries of deleted student.
      $sql = $conn->prepare("
        DELETE FROM
          progress
        WHERE
          StudentID=?
      ");
      $sql->bind_param("i", $update['id']);
      break;
    case 2:
      // Update for first time maze assignment.
      // Add entries for each student in class for current maze.
      $sql = $conn->prepare("
        INSERT INTO
          progress (StudentID, StoryID)
        SELECT
          students.ID,
          ?
        FROM
          students
        WHERE
          students.ClassID=?
      ");
      $sql->bind_param("ii", $update['id'], $_SESSION['classID']);
      break;
    case 3:
      // Update for maze deletion.
      // Delete all entries of deleted maze.
      $sql = $conn->prepare("
        DELETE FROM
          progress
        WHERE
          StoryID=?
      ");
      $sql->bind_param("i", $update['id']);
      break;
    default:
      // Invalid update['type'], return false (fail).
      return false;
  }

  // Run initialized query.
  $sql->execute();

  // All queries above may not affect any rows, even on successful executions.
  // Thus, return success (true) if script gets to this point.
  return true;

?>