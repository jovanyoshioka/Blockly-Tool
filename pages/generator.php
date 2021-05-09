<?php
  session_start();
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
    <div id="previewModal" class="modal">
      <header>
        <h1>Story Preview</h1>
        <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
      </header>
      <section>
        <h1>Story Images/Instructions</h1>
      </section>
    </div>
    <!-- Modal for editing a story -->
    <div id="editModal" class="modal">
      <header>
        <h1>Story Editor</h1>
        <button onclick="closeModal(this.parentElement.parentElement)">&#x2716;</button>
      </header>
      <section>
        <h1>Story Editing Form</h1>
      </section>
    </div>
    <!-- Dark background tint for modal -->
    <div class="modalBackground" onclick="closeModal(document.querySelector('.modal.show'))"></div>

    <!-- Choose a story form -->
    <section id="chooseAStoryForm" class="formContainer">
      <!-- Header -->
      <h1>Maze Generator</h1>
      <h2>Choose a story</h2>
      <form action="" method="POST">
        <!-- Pre-existing stories searchable table -->
        <input type="search" class="hideWhenSelected" placeholder="Search" />
        <table id="stories">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Uploader</th>
            <th></th>
          </tr>
          <?php include('../php/getStories.php'); ?>
        </table>
        <!-- Table navigation -->
        <div>
          <!-- For multiple "pages" -->
          <div class="hideWhenSelected">
            <input type="button" class="orangeBtn" value="&#10094; Previous" />
            <p>
              <a href="">1</a> 
              <a href="">2</a> 
              <a href="">3</a> 
              . . . 
              <a href="">5</a>
            </p>
            <input type="button" class="orangeBtn" value="Next &#10095;" />
          </div>
          <!-- For unselecting a story -->
          <div class="showWhenSelected">
            <input type="button" onclick="unselectStory()" class="orangeBtn" value="&#10094; Back" />
          </div>
        </div>
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
          <input type="button" onclick="generateMaze(this)" class="orangeBtn" value="Generate" />
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
      <h1>Maze Generator</h1>
      <h2>Make your own story</h2>
    </section>

    <script src="../js/generator.js"></script>
  </body>
</html>