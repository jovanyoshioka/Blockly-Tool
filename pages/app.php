<?php
  session_start();

  // Used for authorizing user and highlighting link on navigation bar.
  $currPage = "app";

  // Verify user is logged in and authorized.
  // Note: guests will be allowed access to default mazes (i.e., UploaderID=0).
  include('../php/verifyAuthorization.php');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body id="app">
    <?php include('../php/navbar.php'); ?>

    <!-- Import blockly libraries -->
    <script src="../js/blockly/blockly_compressed.js"></script> <!-- Core -->
    <script src="../js/blockly/javascript_compressed.js"></script> <!-- Translates block to JS -->
    <script src="../js/blockly/blocks_compressed.js"></script> <!-- Block sets -->
    <script src="../js/blockly/msg/js/en.js"></script> <!-- Language -->

    <!-- Custom blocks -->
    <script src="../js/customBlocks.js"></script>

    <!-- Instructions, Story Canvas, and Run/Reset container -->
    <div id="simContainer">
      <header>
        <div class="levelsContainer">
          <!-- Default contents; levels should be filled with JavaScript. -->
          <div class="levelIndicator">0</div>
        </div>
        <!-- Run/Reset Buttons -->
        <div id="btns">
          <button id="reset" class="orangeBtn" onclick="resetSim()">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button id="run" class="orangeBtn" onclick="runCode()">
            <i class="fas fa-play"></i>
          </button>
        </div>
      </header>
      <!-- Character and other elements canvas -->
      <!-- Note: Separate because applying transformations to character; can not do this with one canvas. -->
      <div id="canvasWrapper">
        <canvas id="charCanvas"></canvas>
        <canvas id="storyCanvas"></canvas>
      </div>
    </div>
    <!-- Blockly workspace: container holding toolbox and block code -->
    <div id="wsContainer">
      <div id="textContainer">
        <h1>
          <?php
            if (isset($_GET['title']) && isset($_GET['author']))
              echo $_GET['title'].' - By '.$_GET['author'];
            else
              echo 'An error occurred when fetching Title and Author.';
          ?>
        </h1>
        <h2>Instructions:</h2>
        <p id="instructions"><!-- Data from initCurrLvl(); --></p>
      </div>
      <!-- Blockly Coding Space -->
      <div id="workspace">
        <h1 id="capacity"><!-- Data from initCapTxt(x); --></h1>
        <div id="modes">
          <button class="orangeBtn" onclick="setMode(false)" disabled>Text</button>
          <button class="orangeBtn" onclick="setMode(true)">Image</button>
        </div>
      </div>
      <xml id="textToolbox">
        <category name="Movement" colour="180">
          <block type="movement_move_forward"></block>
          <block type="movement_turn_left"></block>
          <block type="movement_turn_right"></block>
        </category>
        <category name="Loops" colour="%{BKY_LOOPS_HUE}">
          <block type="controls_repeat_ext"></block>
        </category>
        <category name="Numbers" colour="%{BKY_MATH_HUE}">
          <block type="math_number"></block>
        </category>
      </xml>
      <xml id="imgToolbox">
        <category name="Movement" colour="180">
          <block type="movement_move_forward_img"></block>
          <block type="movement_turn_left_img"></block>
          <block type="movement_turn_right_img"></block>
        </category>
        <category name="Loops" colour="%{BKY_LOOPS_HUE}">
          <block type="controls_repeat_ext_img"></block>
        </category>
        <category name="Numbers" colour="%{BKY_MATH_HUE}">
          <block type="math_number_1"></block>
          <block type="math_number_2"></block>
          <block type="math_number_3"></block>
          <block type="math_number_4"></block>
          <block type="math_number_5"></block>
          <block type="math_number_6"></block>
          <block type="math_number_7"></block>
          <block type="math_number_8"></block>
          <block type="math_number_9"></block>
        </category>
      </xml>
    </div>

    <!-- Cutscene -->
    <div id="cutsceneWrapper">
      <!-- Black Background -->
      <div id="cutsceneScreen"></div>
      <!-- Cutscene Images -->
      <img id="cutsceneImgA" class="cutsceneImg" />
      <img id="cutsceneImgB" class="cutsceneImg" />
      <!-- Proceed/Loading Buttons -->
      <button id="cutsceneBtn" disabled>
        <i class="fas fa-arrow-right"></i>
        <img src="../assets/loading.gif" />
      </button>
    </div>

    <!-- Alert Modal -->
    <div id="alertModal" class="modal">
      <div class="body">
        <h1><!-- Data from displayAppAlert(x); --></h1>
        <img /> <!-- "src" from displayAppAlert(x); -->
      </div>
      <!-- Level Completed Options -->
      <footer class="levelComplete">
        <a href="dashboard.php">
          <button class="orangeBtn left">Go to Dashboard</button>
        </a>
        <button
          class="orangeBtn right"
          onclick="
            closeModal(this.parentElement.parentElement);
            goNextLvl()
          "
        >
          Next Level
        </button>
      </footer>
      <!-- Story Completed Options -->
      <footer class="storyComplete">
        <a href="dashboard.php">
          <button class="orangeBtn">Go to Dashboard</button>
        </a>
      </footer>
      <!-- Level Failed Options -->
      <footer class="levelFail">
        <button class="orangeBtn" onclick="closeModal(this.parentElement.parentElement)">Continue</button>
      </footer>
    </div>

    <!-- Dark background tint for modals (one instance needed for all modals) -->
    <!-- Note: App modals require user action, so do not allow minimization via background. -->
    <div class="modalBackground"></div>

    <!-- Allows for controlled execution of block code -->
    <script src="../js/interpreter/acorn_interpreter.js"></script>
    <!-- JS-Interpreter API to handle external actions -->
    <script src="../js/interpreterAPI.js"></script>
    <!-- Using blockly library -->
    <script src="../js/blockly.js"></script>
    <!-- Handles stories' cutscenes -->
    <script src="../js/story.js"></script>
    <!-- Controls canvas initialization and manipulation -->
    <script src="../js/canvas.js"></script>

    <script type="text/javascript">
      window.addEventListener('load', function () {
        // Load story when app page loaded.
        <?php echo 'loadStory('.$_SESSION['currLevel'].', '.$_SESSION['totalLvls'].');'; ?>
      });
    </script>
  </body>
</html>
