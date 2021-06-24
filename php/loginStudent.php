<?php

  session_start();

  // Verify user not already logged in. This may be possible if user must set a new password,
  // which is on the same login page, and "Inspect Element" the student/teacher form.
  if (isset($_SESSION['id']))
  {
    // Notify user of situation.
    $msg = "You are already logged in.";
    echo json_encode(array(
      "success" => false,
      "msg"     => $msg
    ));
    exit;
  }

  include('sqlConnect.php');

  // Retrieve entered login information.
  $fName    = $_POST["fName"];
  $lName    = $_POST["lName"];
  $birthday = $_POST["birthday"];
  $classID  = $_POST["classID"];

  // Get user data associated with entered name and class ID.
  // Also determine if exact credentials match, i.e. name, classID, AND birthday.
  $sql = $conn->prepare("
    SELECT
      *,
      CASE
        WHEN EXISTS (
          SELECT
            ID
          FROM
            students
          WHERE
            ClassID=? AND FName=? AND LName=? AND Birthday=?
        ) THEN TRUE
        ELSE FALSE
      END AS Found
    FROM
      students
    WHERE
      ClassID=? AND FName=? AND LName=?
  ");
  $sql->bind_param("isssiss", $classID, $fName, $lName, $birthday, $classID, $fName, $lName);
  $sql->execute();
  $results = $sql->get_result();

  // Although unlikely, it is possible two students have the same names in one class,
  // thus need to loop through results.
  while ($row = $results->fetch_assoc())
  {
    // If no exact match was found (with birthday), but user data still returned, 
    // this means student is authenticated for specified class, but has not yet registered
    // a birthday, i.e. this is their first time logging in.
    // Register user-entered birthday using first row w/ unset birthday.
    if ($row['Found'] == 0 && $row['Birthday'] === NULL)
    {
      $sql = $conn->prepare("
        UPDATE
          students
        SET
          Birthday=?
        WHERE
          ID=?
      ");
      $sql->bind_param("si", $birthday, $row['ID']);
      $sql->execute();
    }

    // If user data is an exact match to entered credentials, or recently registered
    // as above, authenticate user.
    if (
      ($row['Found'] == 1 && $row['Birthday'] == $birthday) ||
      ($row['Found'] == 0 && $row['Birthday'] === NULL)
    )
    {
      $conn->close();

      // Update session, officially authenticating user.
      $_SESSION['id']      = $row['ID'];
      $_SESSION['classID'] = $row['ClassID'];
      $_SESSION['fName']   = $row['FName'];
      $_SESSION['lName']   = $row['LName'];
      $_SESSION['type']    = 0; // Student

      // Notify user of success. Redirect occurs in JavaScript since PHP header()
      // must be called before any actual output is sent (thus it does not work here).
      $msg = "Redirecting you momentarily.";
      echo json_encode(array(
        "success" => true,
        "msg"     => $msg
      ));
      exit;
    }
  }

  // This should only be reached if authentication failed.
  $conn->close();
  
  // Notify user of failure.
  $msg = "Please verify your credentials and try again.";
  echo json_encode(array(
    "success" => false,
    "msg"     => $msg
  ));
  exit;

?>