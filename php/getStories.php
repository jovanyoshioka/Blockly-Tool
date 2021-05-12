<?php

  include("sqlConnect.php");

  // Determine page offset of stories table.
  $storiesPerPage = 5;
  $page = $_POST["page"];
  $offset = ($page - 1) * $storiesPerPage;

  // Get specified page's stories and corresponding uploaders from database.
  // Note: "Default" stories take precedence, newest stories display first.
  // Automatically formatting Uploader as "Default" or "FName LName, School"
  $sql = $conn->prepare("
    SELECT DISTINCT
      stories.ID,
      stories.Title,
      stories.Author,
      CASE
        WHEN stories.UploaderID = 0 THEN 'Default'
        ELSE CONCAT(users.FName, ' ', users.LName, ', ', users.School)
      END AS Uploader
    FROM
      stories,
      users
    WHERE
      stories.Published = 1 AND
      (stories.UploaderID = 0 OR stories.UploaderID = users.ID)
    ORDER BY
      FIELD(stories.UploaderID, 0) DESC,
      stories.ID DESC
    LIMIT ".$storiesPerPage." OFFSET ".$offset."
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
          <input type="button" onclick="previewStory('.$row["ID"].')" class="orangeBtn" value="Preview" />
          <input type="button" onclick="selectStory(this.parentElement.parentElement, '.$row["ID"].')" class="orangeBtn" value="Select" />
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
      COUNT(ID) AS Total
    FROM
      stories
    WHERE Published = 1;
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
    $nav .= '<input type="button" onclick="displayStories('.($page-1).')" class="orangeBtn prev" value="&#10094; Previous" />';
  }
  // Format count display of currently showing / total number of published stories.
  $upper = $page * $storiesPerPage;
  $nav .= '<p>Showing '.($offset+1).' to '.($upper > $row['Total'] ? $row['Total'] : $upper).' of '.$row['Total'].' stories</p>';
  // Determine state of "Next" button.
  if ($row['Total'] > $page * $storiesPerPage)
  {
    // More stories available, show "Next" button.
    $nav .= '<input type="button" onclick="displayStories('.($page+1).')" class="orangeBtn next" value="Next &#10095;" />';
  }

  // Return data in json format to later be interpreted using JavaScript.
  echo json_encode(array("table"=>$table,"nav"=>$nav));

  $conn->close();

?>