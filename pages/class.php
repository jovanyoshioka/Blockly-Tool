<?php
  session_start();

  // Used for authorizing  user and highlighting link on navigation bar.
  $currPage = "class";

  // Verify user is logged in and authorized.
  include('../php/verifyAuthorization.php');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="class">
    <?php include('../php/navbar.php'); ?>

    <header class="banner">
      <h1><?php echo isset($_GET['name']) ? $_GET['name'] : 'Class '.$_SESSION['classID']; ?></h1>
      <h2>Class ID: <?php echo $_SESSION['classID']; ?></h2>
      <div class="tooltip">
        <button
          onclick="copyText(this.querySelector('.tooltipText'), 'codeastory.utk.edu/pages/login.php?classID=<?php echo $_SESSION['classID']; ?>')"
          onmouseout="changeTooltipText(this.querySelector('.tooltipText'), 'Copy Student Login Link')"
        >
          <span class="tooltipText">Copy Student Login Link</span>
          &#128203;
        </button>
      </div>
    </header>

    <div class="mazesContainer">
      <!-- Story Information -->
      <section id="storyInfo">
        <select onchange="">
          <option value="" disabled selected>Select a story</option>
          <option value="1">The Very Hungry Caterpillar</option>
          <option value="2 (id of story)">Green Eggs and Ham</option>
        </select>
        <h1>The Very Hungry Caterpillar</h1>
        <h2>By Eric Carle</h2>
        <p>Status: <span>Assigned</span></p>
        <button class="orangeBtn">Unassign</button>
      </section>

      <!-- Student Selection -->
      <section id="studentSelect">
        <h1>Cumulative</h1>
        <div>
          <!-- Data from getStudents(); -->
        </div>
        <input
          type="text" placeholder="Search a student..."
          onkeyup="searchElements(this.value, this.previousElementSibling)"
        />
      </section>

      <!-- Progress Analytics -->
      <section id="analytics">
        <h2>Levels Progression</h2>
        <div class="ringContainer">
          <svg id="progressRing">
            <circle
              stroke="#FFFFFF" stroke-width="30" fill="transparent"
              r="100" cx="50%" cy="50%"
            />
            <circle
              class="filler"
              stroke="#FF8200" stroke-width="30" fill="transparent"
              r="100" cx="50%" cy="50%"
            />
            <text
              x="50%" y="50%"
              dominant-baseline="middle" text-anchor="middle"
            >
              0% <!-- Default 0%; Data from initProgressRing(a,b); -->
            </text>
          </svg>
        </div>
        <div class="levelsContainer">
          <div class="level">1</div>
          <div class="level">2</div>
          <div class="level">3</div>
          <div class="level">4</div>
          <div class="level">5</div>
          <div class="level">6</div>
          <div class="level">7</div>
          <div class="level">8</div>
        </div>
      </section>
    </div>

    <div class="studentsContainer">
      <h1>Manage Students</h1>
      <div>
        <input
          type="text" placeholder="Search a student..."
          onkeyup="
            searchTable(
              this.value,
              document.querySelector('div.studentsContainer table'),
              [true,true,false]
            )
          "
        />
        <button class="orangeBtn right" onclick="openModal('addModal')">Add Student(s)</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!-- Data from getStudents(); -->
        </tbody>
      </table>
    </div>

    <!-- Modal for adding student(s) -->
    <div id="addModal" class="modal studentModal">
      <header>
        <h1>Add Student(s)</h1>
        <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
      </header>
      <div class="body">
        <h2>Copy and paste a list of your students:</h2>
        <h3>Example: <span>To add John Smith and James Johnson, enter: "Smith, John/Johnson, James"</span></h3>
        <textarea onkeyup="parseStudents(this.value)"></textarea>
        <h2>Students Found:</h2>
        <div class="foundContainer">
          No students found. <!-- Default "No students found."; Data from parseStudents(x); -->
        </div>
      </div>
      <footer>
        <button class="orangeBtn right" onclick="addStudents()">Add</button>
      </footer>
    </div>

    <!-- Modal for editing a student's information -->
    <div id="editModal" class="modal studentModal">
      <header>
        <h1>Edit Student</h1>
        <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
      </header>
      <form id="editStudentForm" action="#" method="POST">
        <div class="body">
          <p class="msg"></p>
          <div> 
            <!-- Input Values from displayEditStudent(a,b,c,d); -->
            <input type="hidden" id="id" name="id" />
            <label for="fName">First Name</label><br />
            <input type="text" id="fName" name="fName" required /><br />
            <label for="lName">Last Name</label><br />
            <input type="text" id="lName" name="lName" required /><br />
            <label for="birthday">Birthday</label><br />
            <input type="date" id="birthday" name="birthday" />
          </div>
        </div>
        <footer>
          <input type="submit" class="orangeBtn right" value="Save" />
        </footer>
      </form>
    </div>

    <!-- Modal for deleting a student -->
    <div id="delModal" class="modal studentModal">
      <header>
        <h1>Delete Student</h1>
        <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
      </header>
      <div class="body">
        <h2>
          <!-- Message from displayDelStudent(a,b); -->
        </h2>
      </div>
      <footer>
        <button class="orangeBtn left" onclick="closeModal(document.querySelector('.modal.show'))">Cancel</button>
        <!-- onclick from displayDelStudent(a,b); -->
        <button class="orangeBtn right">Confirm</button>
      </footer>
    </div>

    <!-- Dark background tint for modal (one instance needed for all modals) -->
    <div class="modalBackground" onclick="closeModal(document.querySelector('.modal.show'))"></div>

    <script>
      $(document).ready(function() {

        getStudents();

        // Handle edit student form submission.
        $("form#editStudentForm").submit(function(e) { editStudent(e, this); });
        
        // TEMPORARY
        initProgressRing('progressRing', 65);
        setProgressColors(
          [2.0, 1.7, 1.5, 1.0, 0.8, 0.6, 0.3, 0.0]
        );
      });
    </script>
  </body>
</html>