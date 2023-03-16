<?php

  include("sqlConnect.php");

  // Retrieve guest mazes, i.e., the default mazes created by the Code a Story team (UploaderID = 0).
  // Only get valid mazes, i.e., those with associated levels, at least one difficulty, published (Published = 1).
  $sql = $conn->prepare("
    SELECT DISTINCT
      stories.ID,
      stories.Title,
      stories.Author,
      stories.Cover,
      GROUP_CONCAT(DISTINCT mazes.Difficulty) as Difficulties
    FROM
      stories
        LEFT JOIN
          mazes
        ON mazes.StoryID = stories.ID
    WHERE
      stories.UploaderID=0 AND stories.Published=1 AND mazes.Difficulty IS NOT NULL AND
      EXISTS (
        SELECT
          ID
        FROM
          levels
        WHERE
          levels.StoryID = stories.ID
      )
    GROUP BY ID
  ");
  $sql->execute();
  $results = $sql->get_result();

  $conn->close();

  // Format retrieved data into maze cards.
  $mazes = '';
  while ($row = $results->fetch_assoc())
  {
    // Create select options for difficulties.
    $difficultiesKeys = array(
      "0" => "Easy",
      "1" => "Medium",
      "2" => "Hard"
    );
    $difficultiesArray = explode(",", $row["Difficulties"]);
    sort($difficultiesArray); // Sort so that order is Easy -> Medium -> Hard
    $difficulties = '';
    foreach ($difficultiesArray as $difficulty)
    {
      $difficulties .= '<option value="'.$difficulty.'">'.$difficultiesKeys[$difficulty].'</option>';
    }

    $mazes .= '
      <div class="maze">
        <!-- Story cover, title, author -->
        <div class="info">
          <figure>
            <img src="'.$row["Cover"].'" />
            <!-- Blurred background since cover images may not perfectly fit card -->
            <img src="'.$row["Cover"].'" class="blur" />
          </figure>
          <div class="textWrapper">
            <div class="text">
              <h1>'.$row["Title"].'</h1>
              <h2>'.$row["Author"].'</h2>
            </div>
            <div class="tintedBackground"></div>
          </div>
        </div>
        <!-- Selections for yes/no cutscenes and difficulty, and play button -->
        <div class="controls">
          <!-- ID to determine which checkbox/select elements to reference when play button clicked -->
          <input type="checkbox" name="cutscenes'.$row["ID"].'" id="cutscenes'.$row["ID"].'" />
          <label for="cutscene-0">Cutscenes</label>
          <button class="orangeBtn" onclick="playMaze('.$row['ID'].', \''.$row['Title'].'\', \''.$row['Author'].'\')">
            <i class="fas fa-play"></i>
          </button>
          <select name="difficulty'.$row["ID"].'" id="difficulty'.$row["ID"].'">
            '.$difficulties.'
          </select>
        </div>
      </div>
    ';
  }
  
  if ($mazes == '')
  {
    // No mazes found, so change message to reflect such.
    $mazes = '
      <h4>No mazes found. Please try again later.</h4>
    ';
  }

?>