<?php
  
  // TODO: Change navigation bar whether user is student or teacher.
  // Teacher should have more content, such as Classes and Contact.

  echo '
    <nav class="navbar">
      <ul>
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><a href="generator.php">Generator</a></li>
        <div class="dropdown">
          <li><a href="javascript:void(0);">Classes &#9660;</a></li>
          <div class="dropdownContent">
            <a href="class.php?classID=161361723">1st Period</a>
            <a href="class.php?classID=837105723">2nd Period</a>
            <a href="class.php?classID=982761236">3rd Period</a>
            <a href="class.php?classID=419602151">4th Period</a>
          </div>
        </div>
        <li><a href="contact.php">Contact</a></li>
      </ul>
      <ul>
        <div class="dropdown">
          <li><a href="javascript:void(0);">Hello, '.$_SESSION['id'].' &#9660;</a></li>
          <div class="dropdownContent">
            <a href="notifications.php">Notifications</a>
            <a href="settings.php">Settings</a>
            <a href="../php/logout.php">Logout</a>
          </div>
        </div>
      </ul>
    </nav>
  ';

?>