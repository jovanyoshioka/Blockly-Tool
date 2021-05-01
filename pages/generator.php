<?php
  session_start();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="generator">
    <?php include('../php/navbar.php'); ?>

    <div class="modeBtnWrapper">
      <button class="modeBtn">
        <img src="../assets/green_eggs_and_ham/background.jpg" />
        <div class="tint"></div>
        <h1>Choose a story</h1>
      </button>
      <button class="modeBtn">
        <img src="../assets/the_very_hungry_caterpillar/background.jpg" />
        <div class="tint"></div>
        <h1>Make your own story</h1>
      </button>
    </div>
  </body>
</html>