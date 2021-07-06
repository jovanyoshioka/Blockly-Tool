<?php

  /**
   * Converts coordinate string into associative array.
   * @param string $coord Coordinate string, e.g. "x1,y1".
   * @return array Array with x and y separated and labelled, e.g. {"x" => x1, "y" => y1}.
   */ 
  function convertStrToArray($coord)
  {
    // Separate x and y values into array elements.
    $coord = explode(",", $coord);
    // Create array with x and y values labeled.
    $coord = array("x" => $coord[0], "y" => $coord[1]);
    
    return $coord;
  }

  session_start();

  include("sqlConnect.php");

  // Retrieve known information, i.e. maze/level to get data from and total number of levels.
  $mazeID = $_SESSION['mazeID'];
  $level  = $_SESSION['currLevel'];
  $total = $_SESSION['totalLvls'];

  // Get cutscene images, maze elements' images/coordinates, and instructions.
  // Note: Adding "GROUP BY levels.ID" as it prevents a completely NULL row from being returned from GROUP_CONCAT if results could not be found.
  $sql = $conn->prepare("
    SELECT
      levels.CharImg,
      mazes.CharCoord,
      levels.BoundImg,
      mazes.BoundCoords,
      levels.GoalImg,
      mazes.GoalCoord,
      mazes.DecoyImgs,
      mazes.DecoyCoords,
      levels.BckgrndImg,
      levels.Instructions,
      GROUP_CONCAT(cutscenes.Img ORDER BY cutscenes.CutscnNum) AS CutscnImgs,
      GROUP_CONCAT(finalCutscenes.Img ORDER BY finalCutscenes.CutscnNum) AS FinalCutscnImgs
    FROM
      levels
        INNER JOIN
          mazes
        ON mazes.StoryID = levels.StoryID AND mazes.LvlNum = levels.LvlNum
        LEFT JOIN
          cutscenes
        ON cutscenes.StoryID = levels.StoryID AND cutscenes.LvlNum = (levels.LvlNum-1)
        LEFT JOIN
          cutscenes AS finalCutscenes
        ON finalCutscenes.StoryID = levels.StoryID AND finalCutscenes.LvlNum = levels.LvlNum AND ?=?
    WHERE
      levels.StoryID=? AND levels.LvlNum=?
    GROUP BY
      levels.ID
  ");
  $sql->bind_param("iiii", $level, $total, $mazeID, $level);
  $sql->execute();
  $result = $sql->get_result();

  // Verify whether or not query was successful.
  if ($result->num_rows == 0)
  {
    // Data retrieval unsuccessful, return error.
    echo json_encode(array(
      "success" => false,
      "msg"     => "Could not retrieve level's data."
    ));
    $conn->close();
    exit;
  }

  // Data retrieval successful.
  $row = $result->fetch_assoc();

  // Format data into array to be returned.
  // Coordinates are separated into array element(s) with labeled x and y values.
  // Note: Coordinate strings in database => "x1,y1/x2,y2/etc."
  // Note: decoyImgs is to be initialized later if decoys are included,
  //   i.e. $row['DecoyImgs'] contains levels to obtain decoy images from.
  $data = array(
    "charImg"      => $row['CharImg'],
    "charCoord"    => convertStrToArray($row['CharCoord']),
    "boundImg"     => $row['BoundImg'],
    "boundCoords"  => array_map("convertStrToArray", explode("/", $row['BoundCoords'])),
    "goalImg"      => $row['GoalImg'],
    "goalCoord"    => convertStrToArray($row['GoalCoord']),
    "decoyImgs"    => array(),
    "decoyCoords"  => (
      // Return empty array if no decoy images/coordiantes included.
      isset($row['DecoyImgs']) && isset($row['DecoyCoords'])
        ? array_map("convertStrToArray", explode("/", $row['DecoyCoords']))
        : array()
    ),
    "bckgrndImg"   => $row['BckgrndImg'],
    "instructions" => $row['Instructions'],
    "cutscnImgs"   => (
      // Return empty array if no cutscenes included.
      isset($row['CutscnImgs'])
        ? explode(",", $row['CutscnImgs']) 
        : array()
    ),
    "finalCutscnImgs" => (
      // Return empty array if no final cutscenes included.
      isset($row['FinalCutscnImgs'])
        ? explode(",", $row['FinalCutscnImgs'])
        : array()
    )
  );

  // Determine whether or not to continue to retrieving decoy images.
  if (!isset($row['DecoyImgs']) || !isset($row['DecoyCoords']))
  {
    // Decoys are not included, return data as is.
    echo json_encode(array(
      "success" => true,
      "data"    => $data
    ));
    $conn->close();
    exit;
  }

  // Prepare SQL query's bind_param arguments for unknown number of values.
  // Extract array of levels to obtain goal images from to use as decoys.
  $levels = explode(",", $row['DecoyImgs']);
  // Initialize placeholder for each level value.
  $placeholders = str_repeat("?,", count($levels) - 1) . "?";
  // Initialize argument type as string for each level value.
  $types = str_repeat("s", count($levels));

  // Get goal image from each level defined to be used as a decoy.
  $sql = $conn->prepare("
    SELECT
      GoalImg
    FROM
      levels
    WHERE
      StoryID=? AND LvlNum IN ($placeholders) AND GoalImg IS NOT NULL
  ");
  $sql->bind_param("i".$types, $mazeID, ...$levels);
  $sql->execute();
  $results = $sql->get_result();

  $conn->close();

  // Verify whether or not query was successful.
  if (
    $results->num_rows == 0
    || $results->num_rows != count($data['decoyCoords'])
  )
  {
    // Failed to retrieve decoys, return error.
    echo json_encode(array(
      "success" => false,
      "msg"     => "Could not retrieve level's decoys."
    ));
    exit;
  }

  // Successfully retrieved decoys.
  // Add each decoy image to data array.
  while ($row = $results->fetch_assoc())
  {
    array_push($data["decoyImgs"], $row['GoalImg']);
  }

  // Return level's data.
  echo json_encode(array(
    "success" => true,
    "data"    => $data
  ));

  exit;

?>