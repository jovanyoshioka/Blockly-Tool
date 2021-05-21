<?php

  // Verify user is logged in.
  if (!isset($_SESSION['id']))
  {
    // User not logged in, redirect to login.
    header('Location: login.php');
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
    header('Location: dashboard.php');
  }
  
?>