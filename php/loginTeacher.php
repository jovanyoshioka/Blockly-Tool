<?php

  session_start();

  // Verify user not already logged in. This may be possible if user must set a new password,
  // which is on the same login page, and "Inspect Element" the student/teacher form.
  if (isset($_SESSION['id']))
  {
    // Notify user of situation.
    $msg = "You are already logged in.";
    echo json_encode(array("success"=>false,"msg"=>$msg));
    exit;
  }

  include('sqlConnect.php');

  // Retrieve entered login information.
  $email = $_POST["email"];
  $pwd   = $_POST["pwd"];

  // Get teacher user(s) with matching email.
  $sql = $conn->prepare("
    SELECT
      *
    FROM
      teachers
    WHERE
      Email=?
  ");
  $sql->bind_param("s", $email);
  $sql->execute();
  $result = $sql->get_result();

  $conn->close();

  if ($result->num_rows > 0)
  {
    // Match found, verify password matches.
    $row = $result->fetch_assoc();

    if (password_verify($pwd, $row['Password']) == 1)
    {
      // Passwords match, so user authenticated; update session.
      $_SESSION['id']      = $row['ID'];
      $_SESSION['email']   = $row['Email'];
      $_SESSION['fName']   = $row['FName'];
      $_SESSION['lName']   = $row['LName'];
      $_SESSION['school']  = $row['School'];
      $_SESSION['tempPwd'] = $row['TempPwd'] == 1 ? true : false;
      $_SESSION['type']    = $row['IsAdmin'] == 1 ? 2 : 1; // Admin Type = 2, Teacher Type = 1

      // Notify user of success.
      // If temporary password, display password form. Otherwise, redirect to dashboard.
      $msg = !$_SESSION['tempPwd'] ? "Redirecting you momentarily." : "";
      echo json_encode(array("success"=>true,"msg"=>$msg));
      exit;
    }
  }

  // This should only be reached if authentication failed.
  $msg = "Please verify your credentials and try again.";
  echo json_encode(array("success"=>false,"msg"=>$msg));
  exit;

?>