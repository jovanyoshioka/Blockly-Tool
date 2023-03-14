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

  // Every account type has a Universal Notification (one instance only for each page).
  echo '
    <!-- Universal Notification (one instance only for each page) -->
    <div class="notification" onclick="hideNotification()">
      <p>
        <!-- Corresponding icon to notification type is displayed -->
        <span class="success">
          <i class="fas fa-check"></i>
        </span>
        <span class="fail">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
        <span class="msg">
          <!-- Message from showNotification(a,b); -->
        </span>
        <span>
          <i class="fas fa-times"></i>
        </span>
      </p>
    </div>
  ';

  // Output correct navigation bar based on user's account type, i.e. student (0), teacher (1), admin (2), or guest (session not set).
  if (isset($_SESSION['id']))
  {
    switch ($_SESSION['type'])
    {
      case 0:
        // Student Navigation Bar: App, Dashboard, Logout
        echo '
          <nav class="navbar">
            <ul>
              <li><a href="dashboard.php" class="'.$pages["dashboard"].'">Dashboard</a></li>
            </ul>
            <ul>
              <div class="dropdown">
                <li><a href="javascript:void(0);">Hello, '.$_SESSION['fName'].' <i class="fas fa-caret-down"></i></a></li>
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
        // Teacher/Admin Navigation Bar: App, Dashboard, Generator, Classes, Contact, Logout
        // Note: Difference between Teacher and Admin accounts is what the pages display.
        
        // Get class links, stored in variable $classLinks.
        include('getClassesNav.php');

        echo '
          <!-- Navigation Bar -->
          <nav class="navbar">
            <ul>
              <li><a href="dashboard.php" class="'.$pages["dashboard"].'">Dashboard</a></li>
              <li><a href="generator.php" class="'.$pages["generator"].'">Generator</a></li>
              <div class="dropdown">
                <li><a href="javascript:void(0);" class="'.$pages["class"].'">Classes <i class="fas fa-caret-down"></i></a></li>
                <div class="dropdownContent">
                  '.$classLinks.'
                  <a onclick="openModal(&apos;createClassModal&apos;)" href="#">Create a Class</a>
                </div>
              </div>
              <li><a href="contact.php" class="'.$pages["contact"].'">Contact</a></li>
            </ul>
            <ul>
              <div class="dropdown">
                <li><a href="javascript:void(0);">Hello, '.$_SESSION['fName'].' <i class="fas fa-caret-down"></i></a></li>
                <div class="dropdownContent">
                  <a href="../php/logout.php">Logout</a>
                </div>
              </div>
            </ul>
          </nav>

          <!-- Dark background tint for modals (one instance needed for all modals) -->
          <div class="modalBackground" onclick="closeModal(document.querySelector(&apos;.modal.show&apos;))"></div>

          <!-- Modal for "Create a class" navigation bar button -->
          <div id="createClassModal" class="modal formModal">
            <header>
              <h1>Create a Class</h1>
              <button onclick="closeModal(this.parentElement.parentElement)">
                <i class="fas fa-times"></i>
              </button>
            </header>
            <form id="createClassForm" action="#" method="POST">
              <div class="body">
                <p class="msg"></p>
                <div> 
                  <label for="name">Class Name</label><br />
                  <input type="text" id="name" name="name" required /><br />
                </div>
              </div>
              <footer>
                <input type="submit" class="orangeBtn right" value="Create" />
              </footer>
            </form>
          </div>

          <script type="text/javascript">
            $(document).ready(function() {
              // Handle "Create a Class" form submission.
              $("form#createClassForm").submit(function(e) { createClass(e, this); });
            });
          </script>
        ';
        break;
      default:
        // Invalid type, so clear session and redirect to login page, i.e. logout.
        header('Location: ../php/logout.php');
    }
  } else
  {
    // Guest Navigation Bar: Dashboard, Contact, Logout
    echo '
      <nav class="navbar">
        <ul>
          <li><a href="dashboard.php" class="'.$pages["dashboard"].'">Dashboard</a></li>
          <li><a href="contact.php" class="'.$pages["contact"].'">Contact</a></li>
        </ul>
        <ul>
          <li><a href="login.php">Login <i class="fas fa-sign-in-alt"></i></a></li>
        </ul>
      </nav>
    ';
  }
  
?>