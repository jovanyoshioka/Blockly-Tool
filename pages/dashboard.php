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
          echo '
            <h1>Student Dashboard **Work in progress**</h1>
            <h1>Show assigned mazes to complete (something like the following): </h1>
            <h2>The Very Hungry Caterpillar, Levels 1-3: <a href="app.php">Go</a></h2>
          ';
          break;
        case 1:
          echo '
            <h1>Teacher Dashboard **Work in progress**</h1>
            <h1>Show classes (something like the following):</h1>
            <h2>1st Period: <a href="class.php?classID=161361723">Go</a></h2>
            <h2>2nd Period: <a href="class.php?classID=837105723">Go</a></h2>
            <h2>3rd Period: <a href="class.php?classID=982761236">Go</a>
            <h2>4th Period: <a href="class.php?classID=419602151">Go</a>
            <h1>Show generated mazes. Allow view/delete.</h1>
            <h1>Show user\'s uploaded stories. Allow view/edit/publish or unpublish/delete.</h1>
            <!-- Modal for creating a new class -->
            <div id="createClassModal" class="modal createClassModal">
              <header>
                <h1>Create a Class</h1>
                <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
              </header>
              <div class="body">
                
              </div>
              <footer>
                <button class="orangeBtn right">Save</button>
              </footer>
            </div>
            <!-- Dark background tint for modal (one instance needed for all modals) -->
            <div class="modalBackground" onclick="closeModal(document.querySelector(\'.modal.show\'))"></div>
          ';
          break;
        case 2:
          include('../php/adminDashboard.php');
          break;
      }
    ?>
  </body>
</html>