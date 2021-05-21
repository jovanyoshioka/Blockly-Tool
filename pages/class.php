<?php
  session_start();

  // Used for authorizing  user and highlighting link on navigation bar.
  $currPage = "class";

  // Verify user is logged in and authorized.
  include('../php/verifyAuthorization.php');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="class">
    <?php include('../php/navbar.php'); ?>
    <?php
      echo '<h1>**Work in progress**</h1>';
      echo '<hr />';
      if (isset($_GET['classID']))
      {
        // TODO: Verify user is teacher of class.
        echo '<h1>Displaying information for class '.$_GET['classID'].'</h1>';
        echo '<h2>Show mazes assigned, and students\' progression.</h2>';
        echo '<h2>Show students in class. Allow add/edit/remove.</h2>';
        echo '<h2>Stretch feature: allow teacher to view students\' code for a specific maze level.</h2>';
      }
    ?>
  </body>
</html>