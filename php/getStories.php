<?php

  include("sqlConnect.php");

  // Determine page offset of stories table.
  $storiesPerPage = 5;
  $page = $_POST["page"];
  $offset = ($page - 1) * $storiesPerPage;

  // Get term to search by.
  $search = $_POST["search"];
  // Double all single apostrophes to prevent errors in SQL LIKE statement queries.
  $search = str_replace("'", "''", $search);

  // Get specified page's stories and corresponding uploaders from database.
  // Note: "Default" stories take precedence, newest stories display first.
  // Automatically formatting Uploader as "Default" or "FName LName, School"
  // If Title, Author, or Uploader exist anywhere within search term, get story.
  // If no search term present, gets all published stories.
  $sql = $conn->prepare("
    SELECT DISTINCT
      stories.ID,
      stories.Title,
      stories.Author,
      CASE
        WHEN stories.UploaderID = 0 THEN 'Default'
        ELSE CONCAT(teachers.FName, ' ', teachers.LName, ', ', teachers.School)
      END AS Uploader
    FROM
      stories,
      teachers
    WHERE
      stories.Published = 1 AND
      (stories.UploaderID = 0 OR stories.UploaderID = teachers.ID) AND
      (
        stories.Title LIKE '%$search%' OR 
        stories.Author LIKE '%$search%' OR 
        CASE
          WHEN stories.UploaderID = 0 THEN 'Default'
          ELSE CONCAT(teachers.FName, ' ', teachers.LName, ', ', teachers.School)
        END LIKE '%$search%'
      )
    ORDER BY
      FIELD(stories.UploaderID, 0) DESC,
      stories.ID DESC
    LIMIT $storiesPerPage OFFSET $offset
  ");
  $sql->execute();
  $results = $sql->get_result();

  // Format retrieved story data as table row.
  $table = '';
  while ($row = $results->fetch_assoc())
  {
    $table .= '
      <tr>
        <td>'.$row["Title"].'</td>
        <td>'.$row["Author"].'</td>
        <td>'.$row["Uploader"].'</td>
        <td class="hideWhenSelected">
          <input type="button" onclick="previewStory('.$row["ID"].', &quot;'.$row["Title"].'&quot;)" class="orangeBtn" value="Preview" />
          <input type="button" onclick="selectStory(this.parentElement.parentElement, '.$row["ID"].', &quot;'.$row["Title"].'&quot;)" class="orangeBtn" value="Select" />
        </td>
        <td class="showWhenSelected">
          <input type="button" onclick="openModal(\'editModal\')" class="orangeBtn" value="Edit" />
        </td>
      </tr>
    ';
  }

  // Get total number of published stories to later format table navigation.
  $sql = $conn->prepare("
    SELECT
      COUNT(DISTINCT stories.ID) AS Total
    FROM
      stories,
      teachers
    WHERE
      stories.Published = 1 AND
      (stories.UploaderID = 0 OR stories.UploaderID = teachers.ID) AND
      (
        stories.Title LIKE '%$search%' OR 
        stories.Author LIKE '%$search%' OR 
        CASE
          WHEN stories.UploaderID = 0 THEN 'Default'
          ELSE CONCAT(teachers.FName, ' ', teachers.LName, ', ', teachers.School)
        END LIKE '%$search%'
      )
  ");
  $sql->execute();
  $results = $sql->get_result();
  $row = $results->fetch_assoc();

  // Update table navigation using retrieved count and specified page.
  $nav = '';
  // Determine state of "Previous" button.
  if ($page != 1)
  {
    // Not first page, show "Previous" button.
    $nav .= '<input type="button" onclick="displayStories('.($page-1).',&quot;'.$search.'&quot;)" class="orangeBtn prev" value="&#10094; Previous" />';
  }
  // Format count display of currently showing / total number of published stories.
  // If no stories present, due to search term or empty database, display "No stories found."
  if ($row['Total'] > 0)
  {
    $upper = $page * $storiesPerPage;
    $nav .= '<p>Showing '.($offset+1).' to '.($upper > $row['Total'] ? $row['Total'] : $upper).' of '.$row['Total'].' stories</p>';
  } else
  {
    $nav .= '<p>No stories found.</p>';
  }
  // Determine state of "Next" button.
  if ($row['Total'] > $page * $storiesPerPage)
  {
    // More stories available, show "Next" button.
    $nav .= '<input type="button" onclick="displayStories('.($page+1).',&quot;'.$search.'&quot;)" class="orangeBtn next" value="Next &#10095;" />';
  }

  // Return data in json format to later be interpreted using JavaScript.
  echo json_encode(array("table"=>$table,"nav"=>$nav));

  $conn->close();

?>