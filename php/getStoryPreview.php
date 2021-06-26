<?php

  include('sqlConnect.php');

  $storyID = $_POST["storyID"];

  // Get specified story's character, boundary, goal, background, and cutscene images & instructions.
  $sql = $conn->prepare("
    SELECT
      levels.LvlNum,
      levels.CharImg,
      levels.BoundImg,
      levels.GoalImg,
      levels.BckgrndImg,
      levels.Instructions,
      GROUP_CONCAT(cutscenes.Img ORDER BY cutscenes.CutscnNum) AS CutscnImgs
    FROM
      levels
        LEFT JOIN
          cutscenes
        ON cutscenes.StoryID = levels.StoryID AND cutscenes.LvlNum = levels.LvlNum
    WHERE
      levels.StoryID = ?
    GROUP BY
      levels.LvlNum
  ");
  $sql->bind_param("i", $storyID);
  $sql->execute();
  $results = $sql->get_result();

  $levels = '';
  while ($row = $results->fetch_assoc())
  {
    // Create new level section, add "Introduction" or "Level n" header text.
    $levels .= '
      <section>
        <h1>'.($row['LvlNum'] == 0 ? 'Introduction' : 'Level '.$row['LvlNum']).'</h1>
        <div class="wrapper">
    ';

    // Add character, boundary, goal, and background images to level's section.
    $imgs = array(
      "Character"    => $row['CharImg'],
      "Boundary"     => $row['BoundImg'],
      "Goal"         => $row['GoalImg'],
      "Background"   => $row['BckgrndImg'],
    );
    // Parse cutscene images (separated by a comma) into array to be added to level's section.
    // Note: Cutscenes are already ordered from first to last in SQL query.
    $cutscn = explode(',', $row['CutscnImgs']);
    for ($i = 0; $i < count($cutscn); $i++)
    {
      $imgs["Cutscene #".($i+1)] = $cutscn[$i];
    }
    // Compile content into level section string.
    foreach ($imgs as $key => $val)
    {
      if ($val != NULL)
      {
        $levels .= '
          <div>
            <h2>'.$key.'</h2>
            <img src="'.$val.'" />
          </div>
        ';
      }
    }

    // Add instructions to level's section.
    if ($row['Instructions'] != NULL)
    {
      $levels .= '
        <div>
          <h2>Instructions</h2>
          <p>'.$row['Instructions'].'</p>
        </div>
      ';
    }

    // Close level section.
    $levels .= '
        </div>
      </section>
    ';
  }

  // If SELECT query yielded no results, add message instead of blank preview modal. 
  if ($levels == NULL)
  {
    echo '<h2>Story data could not be found!</h2>';
  }

  echo $levels;

  $conn->close();

?>