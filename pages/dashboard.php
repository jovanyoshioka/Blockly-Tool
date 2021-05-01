<?php 
  session_start();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="dashboard">
    <?php include('../php/navbar.php'); ?>
    <?php
      if (isset($_GET['classID']))
      {
        // TODO: Verify user is teacher of class.
        echo '<h1>Displaying information for class '.$_GET['classID'].'</h1>';
      } else
      {
        echo '<h1>If teacher, show classes.</h1>';
        echo '<hr />';
        echo '<h1>If student, show assigned mazes to complete (something like the following): </h1>';
        echo '<h2>The Very Hungry Caterpillar, Levels 1-3: <a href="app.php">Go</a></h2>';
      }
    ?>
  </body>
</html>