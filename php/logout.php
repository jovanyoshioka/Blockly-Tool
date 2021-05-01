<?php

  session_start();

  // Clear session variables.
  $_SESSION = array();
  session_destroy();

  // Redirect to login page.
  header("Location: ../pages/login.php");
  exit();

?>