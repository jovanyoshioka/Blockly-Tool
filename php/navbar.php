<?php

  // Highlight current page on navigation bar.
  $pages = array(
    "dashboard" => "",
    "generator" => "",
    "class"     => "",
    "contact"   => ""
  );
  // $currPage is set in active page's file, but if not, initialize as empty by default.
  $currPage = isset($currPage) ? $currPage : "";
  // Set current page's corresponding item in array as "active" to highlight.
  $pages[$currPage] = "active";

  // Output correct navigation bar based on user's account type, i.e. student (0), teacher (1), or admin (2).
  switch ($_SESSION['type'])
  {
    case 0:
      // Student Navigation Bar: Dashboard, Logout
      echo '
        <nav class="navbar">
          <ul>
            <li><a href="dashboard.php" class="'.$pages["dashboard"].'">Dashboard</a></li>
          </ul>
          <ul>
            <div class="dropdown">
              <li><a href="javascript:void(0);">Hello, '.$_SESSION['id'].' &#9660;</a></li>
              <div class="dropdownContent">
                <a href="../php/logout.php">Logout</a>
              </div>
            </div>
          </ul>
        </nav>
      ';
      break;
    case 1:
    case 2:
      // Teacher/Admin Navigation Bar: Dashboard, Generator, Classes, Contact, Logout
      // Note: Difference between Teacher and Admin accounts is what the pages display.
      echo '
        <nav class="navbar">
          <ul>
            <li><a href="dashboard.php" class="'.$pages["dashboard"].'">Dashboard</a></li>
            <li><a href="generator.php" class="'.$pages["generator"].'">Generator</a></li>
            <div class="dropdown">
              <li><a href="javascript:void(0);" class="'.$pages["class"].'">Classes &#9660;</a></li>
              <div class="dropdownContent">
                <a href="class.php?classID=161361723">1st Period</a>
                <a href="class.php?classID=837105723">2nd Period</a>
                <a href="class.php?classID=982761236">3rd Period</a>
                <a href="class.php?classID=419602151">4th Period</a>
              </div>
            </div>
            <li><a href="contact.php" class="'.$pages["contact"].'">Contact</a></li>
          </ul>
          <ul>
            <div class="dropdown">
              <li><a href="javascript:void(0);">Hello, '.$_SESSION['id'].' &#9660;</a></li>
              <div class="dropdownContent">
                <a href="../php/logout.php">Logout</a>
              </div>
            </div>
          </ul>
        </nav>
      ';
      break;
    default:
      // Invalid type, so clear session and redirect to login page, i.e. logout.
      header('Location: ../php/logout.php');
  }
  
?>