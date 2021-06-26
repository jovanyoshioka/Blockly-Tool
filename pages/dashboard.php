<?php 
  session_start();
  
  // Used for authorizing user and highlighting link on navigation bar.
  $currPage = "dashboard";

  // Verify user is logged in and authorized.
  include('../php/verifyAuthorization.php');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="dashboard">
    <?php include('../php/navbar.php'); ?>
    <?php
      switch ($_SESSION['type'])
      {
        case 0:
          // Student Dashboard: Assignments

          // Get student's assignments and progression, stored in variable $assignments.
          include('../php/getAssignments.php');

          echo '
            <!-- Header -->
            <header class="banner">
              <h1>Dashboard</h1>
              <h2>'.$_SESSION['fName'].' '.$_SESSION['lName'].'</h2>
            </header>
            <div class="wrapper">
              <h1>Code a Story</h1>
              <h3>Your Assignments</h3>
              <div class="assignments">
                '.$assignments.'
              </div>
            </div>
          ';
          break;
        case 1:
          // Teacher Dashboard: Instructions to Get Started
          // Eventually: Classes, Mazes, Stories

          echo '
            <!-- Header -->
            <header class="banner">
              <h1>Dashboard</h1>
              <h2>'.$_SESSION['fName'].' '.$_SESSION['lName'].'</h2>
            </header>
            <div class="wrapper">
              <h1>Code a Story</h1>
              <p>
                &#9679; To get started, use the "Create a Class" option under "Classes &#9660;" on the navigation bar.<br />
                &#9679; After creating your class, add your students through the "Manage Students" interface.<br />
                &#9679; Once your students are added, use the 
                <a href="generator.php">Generator</a>
                to create mazes.<br />
                &#9679; Assign the mazes to your students via the "Maze Analytics" interface within your class.<br />

                &#9679; As your students solve the assigned mazes, you can view their progress through the "Maze Analytics" interface as well.<br />
              </p>
              <h2>If you have any questions, please reach out to us!</h2>
            </div>
          ';
          break;
        case 2:
          // Admin Dashboard: Manage Teachers, ALL Stories

          echo '
            <h1>Admin Dashboard **Work in progress**</h1>
            <h1>Display interface to add/view/change email/reset password/delete teachers.</h1>
            <h1>Eventually: Display ALL stories and have the ability to delete if needed.</h1>
          ';
          break;
      }
    ?>

    <?php
      // Show any redirect notifications present in URL.
      if (isset($_GET['notify']) && isset($_GET['notifyType']))
      {
        echo '
          <script type="text/javascript">
            showNotification("'.$_GET['notify'].'", '.$_GET['notifyType'].');
          </script>
        ';
      }
    ?>
  </body>
</html>