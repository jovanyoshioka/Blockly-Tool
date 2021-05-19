<?php

  // TEMPORARY
  echo '
    <section>
      <h1>Level 2</h1>
      <div class="wrapper">
        <div>
          <h2>Character</h2>
          <input type="url" name="char1" placeholder="Enter Image URL" />
          <input type="button" class="orangeBtn pencil" value="&#9998;" />
          <input type="button" class="orangeBtn arrow" value="&#8634;" />
          <label for="charAllToggle1">Apply to all levels:</label>
          <input type="checkbox" id="charAllToggle1" />
          <img src="../assets/the_very_hungry_caterpillar/character.png" />
        </div>
        <div>
          <h2>Boundary</h2>
          <input type="url" name="bound1" placeholder="Enter Image URL" />
          <input type="button" class="orangeBtn pencil" value="&#9998;" />
          <input type="button" class="orangeBtn arrow" value="&#8634;" />
          <label for="boundAllToggle1">Apply to all levels:</label>
          <input type="checkbox" id="boundAllToggle1" />
          <img src="../assets/the_very_hungry_caterpillar/boundary.png" />
        </div>
        <div>
          <h2>Goal</h2>
          <input type="url" name="goal1" placeholder="Enter Image URL" />
          <input type="button" class="orangeBtn pencil" value="&#9998;" />
          <input type="button" class="orangeBtn arrow" value="&#8634;" />
          <img class="goal" src="../assets/the_very_hungry_caterpillar/goal_1.png" />
        </div>
        <div>
          <h2>Background</h2>
          <input type="url" name="bckgrnd1" placeholder="Enter Image URL" />
          <input type="button" class="orangeBtn pencil" value="&#9998;" />
          <input type="button" class="orangeBtn arrow" value="&#8634;" />
          <label for="bckgrndToggle1">Apply to all levels:</label>
          <input type="checkbox" id="bckgrndToggle1" />
          <img src="../assets/the_very_hungry_caterpillar/background.jpg" />
        </div>
        <div>
          <h2>Instructions</h2>
          <textarea name="instr1">Use the code block to navigate through the maze. Reach the goal, avoid the boundaries! What did the caterpillar eat on Monday?</textarea>
          <label for="instrDefaultToggle1">Use default:</label>
          <input type="checkbox" id="instrDefaultToggle1" />
          <input type="button" class="orangeBtn arrow" value="&#8634;" />
        </div>
        <div>
          <h2>Cutscene #1 <input type="button" class="orangeBtn" value="&#8722;" /></h2>
          <input type="url" name="cutscn1-1" placeholder="Enter Image URL" />
          <input type="button" class="orangeBtn pencil" value="&#9998;" />
          <input type="button" class="orangeBtn arrow" value="&#8634;" />
          <img src="../assets/the_very_hungry_caterpillar/page_1_1.jpg" />
        </div>
        <div>
          <h2>Add Cutscene</h2>
          <input type="button" class="orangeBtn" value="&#43;" />
        </div>
      </div>
    </section>
  ';

?>