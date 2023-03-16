<?php

  // Verify guest is authorized to be on the current page.
  $guestPages = array(
    "dashboard",
    "app",
    "contact"
  );

  // Verify user is logged in.
  // For guests (i.e., 'id' not set), allowed to access $guestPages.
  // For teachers, also verify password does not need to be set before accessing web app.
  if (
    (!isset($_SESSION['id']) && !in_array($currPage, $guestPages))
    || (isset($_SESSION['tempPwd']) && $_SESSION['tempPwd'])
  )
  {
    // User not logged in, redirect to login.
    header('Location: login.php');
    exit;
  }

  // Verify user is authorized to be on the current page.
  // Note: no verification is done for web app admins as they should have access to everything.
  // Note: verification already done for guest, above.
  $studentPages = array(
    "dashboard",
    "app"
  );
  $teacherPages = array(
    "dashboard",
    "generator",
    "class",
    "contact",
    "app"
  );
  if (
    isset($_SESSION['id'])
    && (
      ($_SESSION['type'] == 0 && !in_array($currPage, $studentPages)) ||
      ($_SESSION['type'] == 1 && !in_array($currPage, $teacherPages))
    )
  )
  {
    // Student/Teacher not permitted on current page, so redirect to dashboard.
    header('Location: dashboard.php?notify=You are not authorized to access that page!&notifyType=2');
    exit;
  }

  // If class page, verify user is teacher of the class.
  if ($currPage == "class" && isset($_GET['id']))
  {
    // Get class id and name from URL, set by navigation bar link.
    $classID   = $_GET['id'];
    $className = $_GET['name'];
    
    // Consult database to determine if user is teacher of the class specified in URL.
    include("sqlConnect.php");

    $sql = $conn->prepare("
      SELECT
        ID
      FROM
        classes
      WHERE
        ClassID=? AND TeacherID=?
    ");
    $sql->bind_param("ii", $classID, $_SESSION['id']);
    $sql->execute();
    $result = $sql->get_result();

    $conn->close();

    if ($result->num_rows > 0)
    {
      // User is teacher of class, update session.
      $_SESSION['classID']   = $classID;
      $_SESSION['className'] = $className;
    } else
    {
      // User is not teacher of the class, redirect to dashboard.
      header('Location: dashboard.php?notify=You are not authorized to access that class!&notifyType=2');
      exit;
    }
  } else if ($currPage == "class")
  {
    // Class ID not specified in URL, redirect to dashboard.
    header('Location: dashboard.php?notify=Class could not be found!&notifyType=2');
    exit;
  }

  // For app page...
  if ($currPage == "app" && isset($_GET['id']) && isset($_SESSION['id']))
  {
    // Verify student user is assigned to complete the maze specified in URL.
    $mazeID = $_GET['id'];

    // Consult database to determine if student user is assigned and has not yet completed this maze.
    include("sqlConnect.php");

    // In addition to authorization, get user's current level and total number of levels for maze as well.
    // Note: Using HAVING clause for COUNT(x), require SELECT progress.CurrLevel for HAVING clause.
    $sql = $conn->prepare("
      SELECT
        progress.CurrLevel,
        COUNT(levels.LvlNum) AS Total
      FROM
        progress
      INNER JOIN
        levels
      ON
        levels.StoryID = progress.StoryID AND levels.LvlNum > 0
      INNER JOIN
        assignments
      ON
        assignments.StoryID = progress.StoryID AND assignments.Assigned = 1
      WHERE
        progress.StudentID=? AND progress.StoryID=?
      HAVING
        COUNT(levels.LvlNum) >= progress.CurrLevel
    ");
    $sql->bind_param("ii", $_SESSION['id'], $mazeID);
    $sql->execute();
    $result = $sql->get_result();

    if ($row = $result->fetch_assoc())
    {
      // Student user is assigned and has not yet completed this maze, update session.
      $_SESSION['mazeID'] = $mazeID;
      $_SESSION['currLevel'] = $row['CurrLevel'];
      $_SESSION['totalLvls'] = $row['Total'];
    } else
    {
      // Student user is not assigned or has already completed this maze, redirect to dashboard.
      header('Location: dashboard.php?notify=You are not authorized to access that maze!&notifyType=2');
      exit;
    }
  } else if ($currPage == "app" && isset($_GET['id']) && isset($_GET['difficulty']) && isset($_GET['cutscenes']))
  {
    // If guest (!isset($_SESSION['id'])), verify requested maze (with selected difficulty/cutscenes options) is a valid 
    //   default maze (i.e., UploaderID=0 and Published=1).
    $mazeID = $_GET['id'];
    $difficulty = $_GET['difficulty'];
    $cutscenes = $_GET['cutscenes'];

    // Consult database to determine if guest user is requesting a valid maze.
    include("sqlConnect.php");

    // In addition to authorization, get total number of levels for maze as well.
    // Note: only check if cutscenes exist if the cutscenes option was selected.
    $query = '
      SELECT
        COUNT(DISTINCT mazes.LvlNum) AS Total
      FROM
        mazes
      INNER JOIN
        stories
      ON
        stories.ID = mazes.StoryID AND stories.Published=1 AND stories.UploaderID=0
    ';
    if ($cutscenes)
    {
      $query .= '
        INNER JOIN
          cutscenes
        ON
          cutscenes.StoryID = mazes.StoryID
      ';
    }
    $query .= '
      WHERE
        mazes.StoryID=? AND mazes.Difficulty=?
    ';
    $sql = $conn->prepare($query);
    $sql->bind_param("ii", $mazeID, $difficulty);
    $sql->execute();
    $result = $sql->get_result();

    // Determine if guest user is requesting a valid maze.
    //   If so, proceed to app interface.
    $row = $result->fetch_assoc();
    if (!$row || $row['Total'] <= 0)
    {
      // Guest user requesting an invalid maze, redirect to dashboard.
      header('Location: dashboard.php?notify=You are not authorized to access that maze!&notifyType=2');
      exit;
    }
  } else if ($currPage == "app")
  {
    // Maze ID not specified in URL, redirect to dashboard.
    header('Location: dashboard.php?notify=Maze could not be found!&notifyType=2');
    exit;
  }
  
?>