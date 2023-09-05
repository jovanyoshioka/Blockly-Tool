<?php

  // Generate a random temporary password for teacher account registration and password reset.
  // The encrypted version will be stored in the database, and the unencrypted will be given to the teacher.
  // Note: Upon the teacher's first login with this temporary password, they will be prompted to create
  //   a new password. This way, the Code a Story team does not know the teacher's password.

  function generateRandomPassword() {
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $password = '';
    for ($i = 0; $i < 8; $i++) {
        $password .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $password;
  }

  $password = generateRandomPassword();
  $encryptedPassword = password_hash($password, PASSWORD_BCRYPT, ["cost" => 10]);

  // Return unencrypted and encrypted passwords if called from the API (i.e., manually called to reset password).
  // Otherwise, this is included in another PHP script that will just use the $password and $encryptedPassword variables (i.e., 
  //   getRegisterData.php to validate registration data).
  if (isset($_GET['api']) && $_GET['api'] == 1) {
    $msg = 'Store the encrypted password in the database and provide the unencrypted password to the teacher:';
    echo json_encode(array(
        "success"   => true,
        "msg"       => $msg,
        "password"  => $password,
        "encrypted" => $encryptedPassword
    ));
  }

?>