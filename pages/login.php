<?php

  session_start();

  // Redirect to dashboard if user is already logged in and does not have to set password.
  if (
    isset($_SESSION['id']) &&
    (
      ($_SESSION['type'] == 0) || 
      ($_SESSION['type'] == 1 && !$_SESSION['tempPwd'])
    )
  )
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
      <img src="../assets/logo.png" />
      <div class="forms">
        <!-- For user to select method of login, either as student or teacher -->
        <div id="loginSelector">
          <h2>Login as...</h2>
          <button onclick="switchFormTabs('loginSelector', 'studentForm')" class="orangeBtn">Student</button>
          <button onclick="switchFormTabs('loginSelector', 'teacherForm')" class="orangeBtn">Teacher</button>
          <button onclick="loginGuest()" class="orangeBtn">Guest</button>
        </div>

        <!-- Login as student form -->
        <form id="studentForm" action="#" method="POST">
          <p class="msg"></p>
          <fieldset>
            <legend>Name</legend>
            <input type="text" id="fName" name="fName" placeholder="First Name" required /><br />
            <input type="text" id="lName" name="lName" placeholder="Last Name" required /><br />
          </fieldset>  
          <label for="birthday">Birthday</label>
          <input type="date" id="birthday" name="birthday" required /><br />
          <!-- Automatically fill ClassID if in URL -->
          <label for="classID">Class ID</label>
          <input type="text" id="classID" name="classID" placeholder="XXXXXX" value="<?php echo isset($_GET["classID"]) ? $_GET["classID"] : '' ?>" required /><br />
          <input class="orangeBtn" type="submit" value="Login" />
        </form>

        <!-- Login as teacher form -->
        <!-- Note: Web app admins use this form as well -->
        <form id="teacherForm" action="#" method="POST">
          <p class="msg"></p>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="example@domain.com" required /><br />
          <label for="pwd">Password</label>
          <input type="password" id="pwd" name="pwd" required /><br />
          <input class="orangeBtn" type="submit" value="Login" />
        </form>
        
        <!-- Set password form (teacher) -->
        <form id="pwdForm" action="#" method="POST">
          <p class="msg success">You successfully logged in using a temporary password! Please set a new password now.</p>
          <label for="newPwd">New Password</label>
          <input type="password" id="newPwd" name="newPwd" required /><br />
          <label for="rePwd">Retype New Password</label>
          <input type="password" id="rePwd" name="rePwd" required /><br />
          <a href="../php/logout.php">
            <input class="orangeBtn" type="button" value="Logout" />
          </a>
          <input class="orangeBtn" type="submit" value="Save" />
        </form>
      </div>
    </div>

    <?php
      if (isset($_SESSION['id']) && $_SESSION['type'] == 1 && $_SESSION['tempPwd'])
      {
        // Only display password form if teacher used temporary password to log in to current session.
        echo '
          <script type="text/javascript">
            document.getElementById("loginSelector").style.transition = "none";
            document.getElementById("pwdForm").style.transition   = "none";
            switchFormTabs("loginSelector","pwdForm");
          </script>
        ';
      } else if (isset($_GET['classID']))
      {
        // Only display student login if "classID" present in URL.
        echo '
          <script type="text/javascript">
            document.getElementById("loginSelector").style.transition = "none";
            document.getElementById("studentForm").style.transition   = "none";
            switchFormTabs("loginSelector","studentForm");
          </script>
        ';
      }
    ?>

    <script type="text/javascript">
      $(document).ready(function() {
      
        // Handle student login form submission.
        $("form#studentForm").submit(function(e) { loginUser(e, this, 0); });

        // Handle teacher login form submission.
        $("form#teacherForm").submit(function(e) { loginUser(e, this, 1); });

        // Handle password change form submission.
        $("form#pwdForm").submit(function(e) { setPassword(e, this); });

      });
    </script>
  </body>
</html>