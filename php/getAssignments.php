<?php

  include("sqlConnect.php");

  // Retrieve assignments for class along with student's progress on each one.
  // Get total number of levels to decide how many levels indicators to instantiate.
  $sql = $conn->prepare("
    SELECT
      assignments.StoryID,
      stories.Title,
      stories.Author,
      progress.CurrLevel,
      (
      	SELECT
          COUNT(levels.ID)
        FROM
          levels
        WHERE
          levels.StoryID = assignments.StoryID AND levels.LvlNum > 0
      ) AS Total
    FROM
      assignments
    INNER JOIN
      stories
    ON
      stories.ID = assignments.StoryID
    INNER JOIN
      progress
    ON
      progress.StoryID = assignments.StoryID AND progress.StudentID=?
    WHERE
      assignments.ClassID=? AND assignments = 1
  ");
  $sql->bind_param("ii", $_SESSION['id'], $_SESSION['classID']);
  $sql->execute();
  $results = $sql->get_result();

  // Format retrieved info into assignment cards for displaying.
  $assignments = '';
  while ($row = $results->fetch_assoc())
  {
    $assignments .= '
      <div class="assignment">
        <a href="app.php?id='.$row['StoryID'].'">
          <button class="orangeBtn">Go</button>
        </a>
        <h2>'.$row['Title'].'<br />By '.$row['Author'].'</h2>
        <div class="levels">
    ';

    // Instantiate levels indicators with student's progress.
    for ($i = 1; $i <= $row['Total']; $i++)
    {
      $completion = ($row['CurrLevel'] > $i) ? 'complete' : '';
      $assignments .= '
        <div class="levelIndicator '.$completion.'">
          '.$i.'
        </div>
      ';
    }

    $assignments .= '
        </div>
      </div>
    ';
  }

  if ($assignments == '')
  {
    // No assignments found, so change message to reflect such.
    $assignments = '
      <h4>No assignments found.</h4>
    ';
  }

?>