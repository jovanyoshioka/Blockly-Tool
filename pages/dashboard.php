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
      if (isset($_SESSION['id']))
      {
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
                <img src="../assets/logo.png" />
                <h1>Welcome!</h1>
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
                <img src="../assets/logo.png" />
                <h1>Welcome!</h1>
                <p>
                  &#9679; To get started, use the "Create a Class" option under "Classes <i class="fas fa-caret-down"></i>" on the navigation bar.<br />
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
      } else
      {
        // Guest Dashboard: Default Mazes

        // Get guest's mazes, i.e., default mazes by the Code a Story team (UploaderID = 0), stored in variable $mazes.
        include('../php/getGuestMazes.php');

        echo '
          <!-- Header -->
          <header class="banner">
            <h1>Dashboard</h1>
            <h2>Guest</h2>
          </header>
          <div class="wrapper guest">
            <img src="../assets/logo.png" />
            <p class="description">
              <span>Welcome!</span><br />
              Code a Story combines coding with literary sequencing and comprehension to offer a challenging, 
              yet fun way to advance both computer science and English skills.
            </p>
          </div>
          <div class="container">
            <p>
              <span>Get started!</span><br />
              Select a story below, follow its plot, then traverse the maze using block-based code! Reach the goal, and avoid barriers. Beware of fake goals. Don\'t have the book? Choose to play with cutscenes!
            </p>
            '.$mazes.'
        ';
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