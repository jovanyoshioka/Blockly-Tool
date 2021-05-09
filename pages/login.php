<?php

  session_start();

  // Login user if ID present in URL.
  // Although not very secure, this allows for easy, automatic login for students.
  if (isset($_GET["id"]))
  {
    $_SESSION['id'] = $_GET["id"];
  }

  // Redirect to dashboard if user is logged in, either by URL or form.
  if (isset($_SESSION['id']))
  {
    header('Location: dashboard.php');
    exit;
  }

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="login">
    <div class="wrapper">
      <h1>Code a Story</h1>
      <form action="../php/login.php" method="POST">
        <input type="text" id="loginID" name="loginID" placeholder="Your ID"><br>
        <input class="orangeBtn" type="submit" value="Login">
      </form>
    </div>
  </body>
</html>