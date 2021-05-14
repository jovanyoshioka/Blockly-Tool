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
      echo '<h1>**Work in progress**</h1>';

      echo '<hr />';

      echo '<h1>If teacher, show classes (something like the following):</h1>';
      echo '<h2>1st Period: <a href="class.php?classID=161361723">Go</a></h2>';
      echo '<h2>2nd Period: <a href="class.php?classID=837105723">Go</a></h2>';
      echo '<h2>3rd Period: <a href="class.php?classID=982761236">Go</a>';
      echo '<h2>4th Period: <a href="class.php?classID=419602151">Go</a>';
      echo '<h1>Show generated mazes. Allow view/delete.</h1>';
      echo '<h1>Show user\'s uploaded stories. Allow view/edit/publish or unpublish/delete.</h1>';
      
    
      echo '<hr />';

      echo '<h1>If student, show assigned mazes to complete (something like the following): </h1>';
      echo '<h2>The Very Hungry Caterpillar, Levels 1-3: <a href="app.php">Go</a></h2>';
      echo '<h1>Note: Student\'s navigation bar will not include Generator, Classes, and Contact; these are only available for teacher accounts.</h1>';
    ?>
  </body>
</html>