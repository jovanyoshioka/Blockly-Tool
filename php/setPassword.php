<?php

  session_start();

  // Verify user already authenticated and must set password.
  // May not be the case if user "Inspect Element" from the student/teacher form.
  if (!isset($_SESSION['id']))
  {
    // User not yet authenticated. Notify user.
    $msg = "You are not logged in.";
    echo json_encode(array(
      "success"=>false,
      "msg"=>$msg
    ));
    exit;
  } else if (!isset($_SESSION['tempPwd']) || !$_SESSION['tempPwd'])
  {
    // User is not authorized to set a new password. Notify user.
    $msg = "A new password is currently not authorized.";
    echo json_encode(array(
      "success"=>false,
      "msg"=>$msg
    ));
    exit;
  }

  include('sqlConnect.php');

  // Retrieve entered password to save.
  // Note: Retype already verified in JavaScript, so only need one.
  $pwd = $_POST["newPwd"];

  // Encrypt password.
  $encryptedPwd = password_hash($pwd, PASSWORD_BCRYPT, ["cost" => 10]);

  // Save user's new encrypted password. Flag as not a temporary password.
  $sql = $conn->prepare("
    UPDATE
      teachers
    SET
      Password=?, TempPwd=0
    WHERE
      ID=?
  ");
  $sql->bind_param("si", $encryptedPwd, $_SESSION['id']);
  $sql->execute();

  $conn->close();

  // Flag that user is no longer required to set password before accessing web app.
  $_SESSION['tempPwd'] = false;

  // Notify user of success. Redirect occurs in JavaScript since PHP header()
  // must be called before any actual output is sent (thus it does not work here).
  $msg = "Redirecting you momentarily.";
  echo json_encode(array(
    "success"=>true,
    "msg"=>$msg
  ));
  exit;

?>