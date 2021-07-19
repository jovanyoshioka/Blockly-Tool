<?php

  include('sqlConnect.php');

  $storyID = $_POST["storyID"];

  // Get specified story's character, boundary, goal, background, and cutscene images & instructions.
  // Note: Second SELECT statement retrieves Introduction and Conclusion cutscene images.
  //   Purposefully after getting levels to order correctly when appending to return array.
  // Note: Introduction => LvlNum = 0, Conclusion => LvlNum = NumLvls+1
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
      levels.StoryID=?
    GROUP BY
      levels.LvlNum

    UNION ALL

    SELECT
      cutscenes.LvlNum,
      NULL, NULL, NULL, NULL, NULL,
      GROUP_CONCAT(cutscenes.Img ORDER BY cutscenes.CutscnNum) AS CutscnImgs
    FROM
      cutscenes
    WHERE
      cutscenes.StoryID=?
      AND (
        cutscenes.LvlNum = 0
        OR cutscenes.LvlNum = (
          SELECT
            COUNT(*)
          FROM
            levels
          WHERE
            levels.StoryID = cutscenes.StoryID
        ) + 1
      )
    GROUP BY
      cutscenes.LvlNum
  ");
  $sql->bind_param("ii", $storyID, $storyID);
  $sql->execute();
  $results = $sql->get_result();

  $prevLvlNum = 0;
  $levels = array();
  while ($row = $results->fetch_assoc())
  {
    $level = '';
    $isIntro = false;
    $isConclude = false;

    // Determine if current row is Introduction or Conclusion entry.
    // Note: prevLvlNum will eventually yield highest level number, i.e. the Conclusion row.
    if ($row['LvlNum'] == 0)
      $isIntro = true;
    else if ($row['LvlNum'] > $prevLvlNum && $row['CharImg'] == NULL)
      $isConclude = true;

    $prevLvlNum = $row['LvlNum'];

    // Create new level section, add "Introduction", "Level n", or "Conclusion" header text.
    $level .= '
      <section>
        <h1>
          '.(
            $isIntro    ? 'Introduction' : (
            $isConclude ? 'Conclusion'   
                        : 'Level '.$row['LvlNum'] )
          ).'
        </h1>
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
        $level .= '
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
      $level .= '
        <div>
          <h2>Instructions</h2>
          <p>'.$row['Instructions'].'</p>
        </div>
      ';
    }

    // Close level section.
    $level .= '
        </div>
      </section>
    ';

    // Append to levels to be displayed.
    // Note: Introduction should be first element, Conclusion should be last element.
    // Note: Levels are ordered from least to greatest via SQL query.
    if ($isIntro) array_unshift($levels, $level);
    else array_push($levels, $level);
  }

  // If SELECT query yielded no results, add message instead of blank preview modal. 
  if (empty($levels))
  {
    echo '<h2>Story data could not be found!</h2>';
  }

  echo implode("", $levels);

  $conn->close();

?>