<?php

  include("sqlConnect.php");

  // Note: This file does not actually register any accounts. This is for security purposes.
  // Any user can call the getRegisterData.php API, which means any user could register a teacher account.
  // Instead, simply use this script to check if the passed register data is valid (i.e., email not 
  // already used) and to retrieve a randomly generated temporary password. Then, manually go into
  // the database and create a new teacher row with the valid register data.

  // Get tentative email to check if not already used.
  $email = $_POST["email"];
  if ($email == null) {
    $msg = 'Registration data invalid. Missing "email".';
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  // Verify provided email not already in use.
  $sql = $conn->prepare("SELECT ID FROM teachers WHERE Email=?");
  $sql->bind_param("s",$email);
  $sql->execute();
  if ($sql->get_result()->num_rows > 0)
  {
    $msg = 'Registration data invalid! Email already in use.';
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    $conn->close();
    exit;
  }

  $conn->close();

  // Generate random password. Provides $password and $encryptedPassword.
  include('genRandomPassword.php');

  $msg = 'Registration data valid! Manually create a teacher account in the database with the below information:';
  echo json_encode(array(
    "success"   => true,
    "msg"       => $msg,
    "email"     => $email,
    "password"  => $password,
    "encrypted" => $encryptedPassword
  ));

?>