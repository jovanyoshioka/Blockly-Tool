<?php

  session_start();

  include("sqlConnect.php");

  /**
   * Verifies if information was successfully inserted into database. PHP script exited if not.
   * @param int    $rowsAffected number of rows affected by query, used to determine success.
   * @param string $type descriptor of current process to insert into generic fail message.
   * @param int    $mazeID ID of inserted maze; if maze insertion failed, pass as 0.
   * @param mysqli $conn for undoing entries and closing SQL connection if failure.
   */ 
  function verifySuccess($rowsAffected, $type, $mazeID, $conn)
  {
    if ($rowsAffected == 0)
    {
      // Process was unsuccessful.

      // Delete all possibly added data, i.e. stories, levels, mazes, cutscenes table entries with $mazeID.
      $sql = $conn->prepare("
        DELETE
          levels, mazes, cutscenes, stories
        FROM stories
        LEFT JOIN levels    ON levels.StoryID    = stories.ID
        LEFT JOIN mazes     ON mazes.StoryID     = stories.ID
        LEFT JOIN cutscenes ON cutscenes.StoryID = stories.ID
        WHERE
          stories.ID=?
      ");
      $sql->bind_param("i", $mazeID);
      $sql->execute();

      // Cancel generation process.
      $msg = 'Database '. $type .' failed.';
      echo json_encode(array(
        "success" => false,
        "msg"     => $msg
      ));
      $conn->close();
      exit;
    }
  }

  // Verify valid generation parameters were entered.
  if (
    !(isset($_POST['storyID']) && $_POST['storyID'] > 0) // Verify storyID.
    || !(isset($_POST['doDecoys'])) // Verify doDecoys.
    || !(isset($_POST['doCutscenes'])) // Verify doCutscenes.
    || !(isset($_POST['difficulty']) && $_POST['difficulty'] >= 0 && $_POST['difficulty'] <= 2) // Verify difficulty.
  )
  {
    // One of the above checks failed, cancel generation process.
    $msg = "Invalid generation parameters.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Retrieve user's valid selected generation parameters.
  // Convert $doDecoys boolean to 0 or 1 for SQL bind_param.
  $storyID       = $_POST['storyID'];
  $doDecoys      = $_POST['doDecoys'] === 'true' ? 1 : 0;
  $doCutscenes   = $_POST['doCutscenes'] === 'true' ? true : false;
  $difficulty    = $_POST['difficulty'];

  // Create copy of selected story as user's maze table entry.
  // Replace UploaderID => current teacher's ID, Published => 2 (signifying copy/maze table entry).
  $sql = $conn->prepare("
    INSERT INTO
      stories (Title, Author, Published, UploaderID)
    SELECT
      Title,
      Author,
      2,
      ?
    FROM
      stories
    WHERE
      ID=? AND Published = 1
  ");
  $sql->bind_param("ii", $_SESSION['id'], $storyID);
  $sql->execute();

  $mazeID = $sql->insert_id;

  // Verify maze insertion was successful, i.e. valid mazeID was returned.
  // Note: Checking Published=1 in case user "Inspect Element" storyID input and changes to invalid story.
  verifySuccess($sql->affected_rows, "maze insertion", $mazeID, $conn);

  // Duplicate levels from copied selected story, inserting newly generated mazeID.
  $sql = $conn->prepare("
    INSERT INTO
      levels (StoryID, LvlNum, CharImg, BoundImg, GoalImg, BckgrndImg, Instructions)
    SELECT
      ?,
      LvlNum,
      CharImg,
      BoundImg,
      GoalImg,
      BckgrndImg,
      Instructions
    FROM
      levels
    WHERE
      StoryID=?
  ");
  $sql->bind_param("ii", $mazeID, $storyID);
  $sql->execute();

  // Verify levels duplication was successful, i.e. rows were inserted.
  verifySuccess($sql->affected_rows, "levels duplication", $mazeID, $conn);

  // Duplicate mazes from copied selected story with specified difficulty, inserting newly generated mazeID.
  // Note: Difficulty, Easy => 0, Medium => 1, Hard => 2.
  // Note: DecoyImgs/DecoyCoords only duplicated if enabled in generation parameters ($doDecoys).
  $sql = $conn->prepare("
    INSERT INTO
      mazes (StoryID, LvlNum, CharCoord, BoundCoords, GoalCoord, DecoyImgs, DecoyCoords)
    SELECT
      ?,
      LvlNum,
      CharCoord,
      BoundCoords,
      GoalCoord,
      CASE
        WHEN ? = 1 THEN DecoyImgs
        ELSE NULL
      END,
      CASE
        WHEN ? = 1 THEN DecoyCoords
        ELSE NULL
      END
    FROM
      mazes
    WHERE
      StoryID=? AND Difficulty=?
  ");
  $sql->bind_param("iiiii", $mazeID, $doDecoys, $doDecoys, $storyID, $difficulty);
  $sql->execute();

  // Verify mazes duplication was successful, i.e. rows were inserted.
  verifySuccess($sql->affected_rows, "mazes duplication", $mazeID, $conn);

  // Duplicate cutscenes from copied selected story, inserting newly generated mazeID.
  // Note: This is done only if enabled in generation parameters ($doCutscenes).
  if ($doCutscenes === true)
  {
    $sql = $conn->prepare("
      INSERT INTO
        cutscenes (StoryID, LvlNum, CutscnNum, Img)
      SELECT
        ?,
        LvlNum,
        CutscnNum,
        Img
      FROM
        cutscenes
      WHERE
        StoryID=?
    ");
    $sql->bind_param("ii", $mazeID, $storyID);
    $sql->execute();

    // Verify cutscenes duplication was successful, i.e. rows were inserted.
    verifySuccess($sql->affected_rows, "cutscenes duplication", $mazeID, $conn);
  }

  $conn->close();

  // Maze has been successfully generated and saved.
  echo json_encode(array(
    "success" => true
  ));
  exit;
?>