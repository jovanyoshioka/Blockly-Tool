<?php

  // Verify user is logged in.
  // For teachers, also verify password does not need to be set before accessing web app.
  if (
    (!isset($_SESSION['id'])) ||
    (isset($_SESSION['tempPwd']) && $_SESSION['tempPwd'])
  )
  {
    // User not logged in, redirect to login.
    header('Location: login.php');
    exit;
  }

  // Verify user is authorized to be on the current page.
  // Note: no verification is done for web app admins as they should have access to everything.
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
    ($_SESSION['type'] == 0 && !in_array($currPage, $studentPages)) ||
    ($_SESSION['type'] == 1 && !in_array($currPage, $teacherPages))
  )
  {
    // Student/Teacher not permitted on current page, so redirect to dashboard.
    header('Location: dashboard.php?notify=You are not authorized to access that page!&notifyType=2');
    exit;
  }

  // If class page, verify user is teacher of the class.
  if ($currPage == "class" && isset($_GET['id']))
  {
    $classID = $_GET['id'];
    
    // Consult database to determine if user is teacher of the class.
    include('sqlConnect.php');

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
      $_SESSION['classID'] = $classID;
    } else
    {
      // User is not teacher of the class, redirect to dashboard.
      header('Location: dashboard.php?notify=You are not authorized to access that class!&notifyType=2');
      exit;
    }
  } else if ($currPage == "class")
  {
    // Class ID not specified in URL, redirect to dashboard.
    header('Location: dashboard.php');
    exit;
  }
  
?>