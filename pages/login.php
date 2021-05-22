<?php

  session_start();

  // Login user if ID present in URL.
  // Although not very secure, this allows for easy, automatic login for students.
  if (isset($_GET['id']))
  {
    $_SESSION['id'] = $_GET['id'];
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
      <div class="forms">
        <!-- For user to select method of login, either as student or teacher -->
        <div id="loginSelector">
          <h2>Login as...</h2>
          <button onclick="switchFormTabs('loginSelector', 'studentForm')" class="orangeBtn">Student</button>
          <button onclick="switchFormTabs('loginSelector', 'teacherForm')" class="orangeBtn">Teacher</button>
        </div>
        <!-- Login as student form -->
        <form id="studentForm" action="../php/login.php?type=0" method="POST">
          <input type="text" id="loginID" name="loginID" placeholder="Your ID"><br>
          <input class="orangeBtn" type="submit" value="Login">
        </form>
        <!-- Login as teacher form -->
        <!-- Note: Web app admins use this form as well -->
        <form id="teacherForm" action="../php/login.php" method="POST">
          <input type="text" id="loginID" name="loginID" placeholder="Your ID"><br>
          <input class="orangeBtn" type="submit" value="Login">
        </form>
      </div>
    </div>

    <script>
      
    </script>
  </body>
</html>