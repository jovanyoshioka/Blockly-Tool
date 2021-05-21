<?php

  session_start();

  $_SESSION['id'] = $_POST['loginID'];
  $_SESSION['type'] = 2;

  header('Location: ../pages/dashboard.php');
  exit;

?>