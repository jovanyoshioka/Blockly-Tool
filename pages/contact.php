<?php 
  session_start();

  // Used for authorizing user and highlighting link on navigation bar.
  $currPage = "contact";

  // Verify user is logged in and authorized.
  include('../php/verifyAuthorization.php');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="contact">
    <?php include('../php/navbar.php'); ?>

    <!-- Header -->
    <header class="banner">
      <h1>Contact Us</h1>
      <h2>Code a Story Team</h2>
    </header>
    
    <div class="wrapper">
      <h1>
        If you have any questions or concerns, <br />please reach out to us.
      </h1>
      <h1>
        Dr. Amir Sadovnik: <a href="mailto:asadovnik@utk.edu">asadovnik@utk.edu</a><br />
        Jovan Yoshioka: <a href="mailto:jyoshiok@vols.utk.edu">jyoshiok@vols.utk.edu</a>
      </h1>
    </div>
  </body>
</html>