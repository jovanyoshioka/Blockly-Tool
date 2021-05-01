<?php

  session_start();

  $_SESSION['id'] = $_POST['loginID'];

  header('Location: ../pages/dashboard.php');
  exit;

?>