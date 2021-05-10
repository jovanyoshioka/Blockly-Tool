<?php

  include("sqlConnect.php");

  // Get registration information from URL.
  $email = $_GET["email"];
  $fName = $_GET["fname"];
  $lName = $_GET["lname"];
  $password = $_GET["pwd"];
  $type = $_GET["type"];
  $school = $_GET["school"];

  // Verify all information required was provided.
  if ($email == null || $fName == null || $lName == null || $password == null || $type == null || $school == null)
  {
    echo 'Registration unsuccessful! Need all info: email, fname, lname, pwd, type, school.';

    $conn->close();
    exit;
  }

  // Verify provided email not already in use.
  $sql = $conn->prepare("SELECT ID FROM users WHERE Email=?");
  $sql->bind_param("s",$email);
  $sql->execute();
  if ($sql->get_result()->num_rows > 0)
  {
    echo 'Registration unsuccessful! Email already in use.';

    $conn->close();
    exit;
  }

  // Encrypt password.
  $encryptedPwd = password_hash($password, PASSWORD_BCRYPT, ["cost" => 10]);

  // Add user to database.
  $sql = $conn->prepare("INSERT INTO users (Email,FName,LName,Password,Type,School) VALUES (?,?,?,?,?,?);");
  $sql->bind_param("ssssis",$email,$fName,$lName,$encryptedPwd,$type,$school);
  $success = $sql->execute();
  // Verify insertion was successful.
  if ($success)
  {
    echo 'Registration successful! ' . $fName . ' ' . $lName . ' has been added!';
  } else
  {
    echo 'Registration unsuccessful! An insertion error occured.';
  }

  exit;
  $conn->close();

?>