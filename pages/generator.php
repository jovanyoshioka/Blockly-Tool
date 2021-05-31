<?php
  session_start();

  // Used for authorizing user and highlighting link on navigation bar.
  $currPage = "generator";

  // Verify user is logged in and authorized.
  include('../php/verifyAuthorization.php');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="generator">
    <?php include('../php/navbar.php'); ?>

    <!-- Mode selection buttons -->
    <button id="chooseAStory" class="modeBtn" onclick="selectMode(this)">
      <img src="../assets/chooseAStory.jpg" />
      <div class="tint"></div>
      <h1>Choose a story</h1>
    </button>
    <button id="makeYourOwn" class="modeBtn" onclick="selectMode(this)">
      <img src="../assets/makeYourOwn.jpg" />
      <div class="tint"></div>
      <h1>Make your own story</h1>
    </button>

    <!-- Modal for previewing story images -->
    <div id="previewModal" class="modal storyModal">
      <header>
        <h1><!-- Data from previewStory(x); --></h1>
        <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
      </header>
      <div class="body">
        <!-- Data from previewStory(x); -->
      </div>
    </div>

    <!-- Modal for editing a story -->
    <div id="editModal" class="modal storyModal">
      <header>
        <h1>The Very Hungry Caterpillar Editor</h1>
        <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
      </header>
      <div class="body">
        <form action="" method="POST">
          <!-- TEMPORARY -->
          <?php include('../php/getStoryEditor.php'); ?>
        </form>
      </div>
      <footer>
        <button class="orangeBtn left">&#10094; Level 1</button>
        <p>Level 2 of 5</p>
        <button class="orangeBtn right">Level 3 &#10095;</button>
      </footer>
    </div>

    <!-- Dark background tint for modal (one instance needed for all modals) -->
    <div class="modalBackground" onclick="closeModal(document.querySelector('.modal.show'))"></div>

    <!-- Choose a story form -->
    <section id="chooseAStoryForm" class="formContainer">
      <!-- Header -->
      <header class="banner">
        <h1>Maze Generator</h1>
        <h2>Choose a story</h2>
      </header>
      <form action="" method="POST">
        <!-- Search bar for table of stories -->
        <!-- Note: search bar input is not type="search" due to inability to reliably control "X" click, search event not yet universally supported -->
        <input type="text" onkeydown="handleSearch(event,this)" onkeyup="handleSearch(event,this)" class="hideWhenSelected search" placeholder="Search..." />
        <input type="button" onclick="displayStories(1,this.previousElementSibling.value)" class="hideWhenSelected orangeBtn" value="Search" />
        <!-- Table of pre-existing published stories -->
        <table id="stories">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Uploader</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- Data from displayStories(x); -->
          </tbody>
        </table>
        <!-- Table navigation -->
        <div>
          <!-- For multiple "pages" -->
          <div id="tableNav" class="hideWhenSelected">
            <!-- Data from displayStories(x); -->
          </div>
          <!-- For unselecting a story -->
          <div class="showWhenSelected">
            <input type="button" onclick="unselectStory()" class="orangeBtn back" value="&#10094; Back" />
          </div>
        </div>
        <!-- Enable/disable decoy goals -->
        <label for="decoyToggle">Include Decoy Goals: </label>
        <input type="checkbox" name="decoyToggle" id="decoyToggle" />
        <br>
        <!-- Enable/disable cutscenes -->
        <label for="cutsceneToggle">Include Cutscenes: </label>
        <input type="checkbox" name="cutsceneToggle" id="cutsceneToggle" />
        <br>
        <!-- Maze difficulty selector -->
        <label for="difficulty">Difficulty: </label>
        <select name="difficulty" id="difficulty">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <br>
        <!-- Container for buttons that perform actions, i.e. generate, preview, and save maze -->
        <div class="actions">
          <!-- Initial option -->
          <input type="button" onclick="generateMaze(this.form)" class="orangeBtn" value="Generate" />
          <!-- Options after generated once -->
          <input type="button" class="orangeBtn" value="Preview" />
          <input type="button" class="orangeBtn" value="Regenerate" />
          <input type="submit" class="orangeBtn" value="Save and Exit" />
        </div>
      </form>
    </section>

    <!-- Make your own form -->
    <section id="makeYourOwnForm" class="formContainer">
      <!-- Header -->
      <header class="banner">
        <h1>Maze Generator</h1>
        <h2>Make your own story</h2>
      </header>
      <h2>**Work in progress**</h2>
    </section>

    <script src="../js/generator.js"></script>

    <script type="text/javascript">
      $(document).ready(function() {
        
        // Displays first "page" of table/table nav.
        // Note: "Default" stories take precedence, newest stories display first.
        displayStories(1);

        // Disable submitting form via enter due to users' inclination to press enter in search bar.
        $("form").on('keydown', function (event) {
          if (event.keyCode === 13) {
            event.preventDefault();
          }
        });
        
      });
    </script>
  </body>
</html>