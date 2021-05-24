<?php

  session_start();

  // Redirect to dashboard if user is already logged in.
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
        <form id="teacherForm" action="../php/login.php" method="POST">
          <p class="msg"></p>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="example@domain.com" /><br />
          <label for="pwd">Password</label>
          <input type="password" id="pwd" name="pwd" /><br />
          <input class="orangeBtn" type="button" value="Login" onclick="switchFormTabs('teacherForm', 'pwdForm')" />
        </form>
        
        <!-- Set password form (teacher) -->
        <form id="pwdForm" method="POST">
          <p class="msg success">You successfully logged in using a temporary password! Please set your password now.</p>
          <label for="newPwd">New Password</label>
          <input type="password" id="newPwd" name="newPwd" /><br />
          <label for="rePwd">Retype New Password</label>
          <input type="password" id="rePwd" name="rePwd" /><br />
          <input class="orangeBtn" type="submit" value="Save" />
        </form>
      </div>
    </div>

    <?php
      // Only display student login if "classID" present in URL.
      if (isset($_GET['classID']))
      {
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
        $("form#pwdForm").submit(setPassword());

      });
    </script>
  </body>
</html>