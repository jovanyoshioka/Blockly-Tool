/*************
 * CONSTANTS *
 *************/
const GRID_DOT_SCALER = 0.075;
const GRID_DOT_COLOR  = "#FFFFFF";
const CHARACTER_ID    = "character";
const BOUNDARY_ID     = "boundary";
const GOAL_ID         = "goal";
const DECOY_ID        = "decoy";

/***********
 * CLASSES *
 ***********/
class CanvasContainer
{
  constructor(canvasID, unitsPerLine)
  {
    var canvasElement = document.getElementById(canvasID);

    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.ctx.canvas.width = canvasElement.offsetWidth;
    this.ctx.canvas.height = canvasElement.offsetHeight;

    // Clear canvas element of any prior drawings.
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Number of units per grid row or grid column.
    this.unitsPerLine = unitsPerLine;
    // Size of each grid unit.
    this.unitSize = this.ctx.canvas.width / this.unitsPerLine;

    // Character, Story Elements, Grid Dots
    this.elements = [];
  }

  // Clears canvas taking into account any transformations.
  clear()
  {
    // Store current transformations. 
    this.ctx.save();
    // Use default transformations for clearing (identity matrix).
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Clear canvas.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Restore the transformations.
    this.ctx.restore();
  }

  // Draws dotted grid layout based on canvas size.
  drawGrid()
  {
    // Loop through each row of grid.
    for (var i = 0; i < this.unitsPerLine; i++)
    {
      // Loop through each column of grid.
      for (var j = 0; j < this.unitsPerLine; j++)
      {
        // Draw dot for current grid unit.
        this.ctx.beginPath();
        this.ctx.arc(
          (this.unitSize * j) + this.unitSize / 2,
          (this.unitSize * i) + this.unitSize / 2,
          (this.unitSize * GRID_DOT_SCALER) / 2, 
          0, 2 * Math.PI, false
        );
        this.ctx.fillStyle = GRID_DOT_COLOR;
        this.ctx.fill();
      }
    }
  }
}

class CanvasElement
{
  constructor(canvasObj, unitsX, unitsY, type, imgSrc)
  {
    // Canvas of which this element belongs to.
    this.canvasObj = canvasObj;

    // Differentiates between: character, boundary, goal.
    // Specific actions, mostly related to movement, only for specific types.
    this.type = type;

    // Element properties.
    // Each element's size is equivalent to one grid unit size.
    this.size = this.canvasObj.unitSize;
    // Tracks element's position relative to canvas.
    this.x = unitsX * this.size;
    this.y = unitsY * this.size;

    // Tracks element's position relative to transformation.
    this.pos = 0;
    if (this.type == CHARACTER_ID)
    {
      // Initialize transformation-relative starting position, i.e. convert passed x and y to pos.
      this.pos = this.x;
      this.rotate(-Math.PI / 2);
      this.pos += this.y;
      this.rotate(Math.PI / 2);
    }

    // Tracks element's direction relative to canvas (from 0 to 2pi).
    this.dir = 0;

    // Image of element.
    this.imgSrc = imgSrc;
  }

  /**
   * Rotates canvas relative to this element, giving illusion of rotating element itself.
   * @param angle angle value to rotate canvas, and this element, to.
   */
  rotate(angle)
  {
    // Translate to center of this element (to rotate canvas relative to element).
    this.canvasObj.ctx.translate(this.pos + this.size/2, this.size/2);
    // Invert (-) angle since canvas uses clockwise as positive.
    this.canvasObj.ctx.rotate(-angle);
    // Translate back to initial position.
    this.canvasObj.ctx.translate(-(this.pos + this.size/2), -this.size/2);
  }

  /**
   * Places element onto canvas as a square.
   */
  drawSquare()
  {
    var img = new Image(this.size, this.size);
    img.src = this.imgSrc;

    // Draw element when specified image is done loading.
    img.addEventListener("load", e => {
      // Character and Boundary/Goal elements drawn different due to transformations on character canvas.
      if (this.type == CHARACTER_ID)
      {
        this.canvasObj.ctx.drawImage(img, this.pos, 0, this.size, this.size);
      } else
      {
        this.canvasObj.ctx.drawImage(img, this.x, this.y, this.size, this.size);
      }
    });
  }
}

/*******************
 * MAZE GENERATION *
 *******************/
/**
 * Generates maze using given attributes to be traversed by user.
 * @param mazeAttr attributes of maze to be generated (e.g., one turn, two move forwards, etc.)
 */
function generateMaze()
{
  // Get current level's maze data.
  var levelData = [
    { type: CHARACTER_ID, coords: [storyObj.character.coord] },
    { type: BOUNDARY_ID, coords: storyObj.boundary.coords },
    { type: GOAL_ID, coords: [storyObj.goal.coord] },
    { type: DECOY_ID, coords: storyObj.decoy.coords }
  ];

  // Determine size of grid based on input coordinates.
  var gridSize = calcGridSize();

  // Instantiate canvas objects for character and other story elements.
  // This also effectively clears the canvas.
  charCanvas = new CanvasContainer("charCanvas", gridSize);
  storyCanvas = new CanvasContainer("storyCanvas", gridSize);
  storyCanvas.drawGrid();

  // Instantiate and draw elements of each element type defined in level data.
  // Note: Level data is split up based on element type, i.e. character in one array, goal(s) in another, boundaries in another.
  levelData.forEach(instElements);

  // Display story background.
  document.getElementById("storyCanvas").style.backgroundImage = `linear-gradient(
    rgba(66, 67, 67, 0.5), 
    rgba(66, 67, 67, 0.5)
  ), url(` + storyObj.background + `)`;

  /**
   * Calculate size of canvas, i.e. canvas.unitsPerLine, by finding largest upper bound, either of x or y.
   */
  function calcGridSize()
  {
    var size = 0;
    // Get largest coordinate, either in x or y direction.
    levelData.forEach(function(item) {
      for (var i = 0; i < item.coords.length; i++)
      {
        size = parseInt(item.coords[i].x) > size ? parseInt(item.coords[i].x) : size;
        size = parseInt(item.coords[i].y) > size ? parseInt(item.coords[i].y) : size;
      }
    });
    // Coordinate system starts at 0, so 1 needs to be added for size of grid.
    return parseInt(size) + 1;
  }

  /**
   * Instantiates and draws elements of current element type, as defined by item.type
   * Note: An element is defined by a type and an x and y starting coordinate.
   * @param item an array containing coordinates for a specific type of canvas elements.
   */
  function instElements(item)
  {
    var numElements = item.coords.length;
    var imgSrc = item.type == CHARACTER_ID ? storyObj.character.img
               : item.type == BOUNDARY_ID  ? storyObj.boundary.img
               : item.type == GOAL_ID      ? storyObj.goal.img
               : null;
    
    for (var i = 0; i < numElements; i++)
    {
      if (item.type == DECOY_ID)
      {
        // Initialize image source as different decoy each iteration.
        imgSrc = storyObj.decoy.imgs[i];
      }

      if (item.type == CHARACTER_ID)
      {
        // Instantiate character element within character canvas.
        charCanvas.elements.push(new CanvasElement(charCanvas, item.coords[i].x, item.coords[i].y, item.type, imgSrc));
        // Draw recently pushed character element.
        charCanvas.elements[charCanvas.elements.length-1].drawSquare();
      } else
      {
        // Instantiate element of other type (i.e. goal(s) and boundaries) within story canvas.
        storyCanvas.elements.push(new CanvasElement(storyCanvas, item.coords[i].x, item.coords[i].y, item.type, imgSrc));
        // Draw recently pushed element.
        storyCanvas.elements[storyCanvas.elements.length-1].drawSquare();
      }
    }
  }
}

/************
 * MOVEMENT *
 ************/
/**
 * Sets character's tracked direction relative to canvas (from 0 to 2pi).
 * @param char character object.
 * @param angle angle addition to current direction.
 */
function trackDir(char, angle)
{
  // "Turn" current direction by angle parameter.
  char.dir += angle;
  // Keep bounded between 0 and 2pi.
  char.dir = char.dir > 3 * Math.PI / 2 ? 0
           : char.dir < 0               ? 3 * Math.PI / 2
           : char.dir;
}

/**
 * Rotates character in certain direction.
 * @param dir direction to rotate, 'L': Math.PI / 2 Radians, 'R': -Math.PI / 2 Radians.
 */
function turn(dir)
{
  var character = charCanvas.elements.find(element => element.type == CHARACTER_ID);
  var angle = dir == 'L' ? Math.PI / 2
            : dir == 'R' ? -Math.PI / 2
            : 0;

  // Clear previous orientation from canvas.
  charCanvas.clear();

  // Rotate character in specified direction.
  character.rotate(angle);

  // Draw new orientation on canvas.
  character.drawSquare();

  // Set direction of character relative to canvas for later tracking position relative to canvas.
  trackDir(character, angle);
}

/**
 * Turns character left or right.
 * Keeps displayed JavaScript readable for user, e.g., turnLeft() instead of turn('L').
 */
function turnLeft()
{
  turn('L');
}
function turnRight()
{
  turn('R');
}

/**
 * Sets character's tracked position relative to canvas (x,y).
 * @param char character object.
 */
function trackPos(char)
{
  // Based on direction motion is in, add/subtract from x or y position value.
  switch (char.dir)
  {
    case 0:
      // East
      char.x += char.size;
      break;
    case Math.PI / 2:
      // North
      char.y -= char.size;
      break;
    case Math.PI:
      // West
      char.x -= char.size;
      break;
    case 3 * Math.PI / 2:
      // South
      char.y += char.size;
      break;
    default:
      console.log("An error occurred while identifying character's direction!");
      break;
  }
}

/**
 * Moves character after verifying final position of moveForward() is a valid space.
 * A valid space is one that is not occupied by a boundary or is not outside the canvas.
 * @param char character object
 */
function moveWithValidator(char)
{
  var isValid = true;

  // Verify character is within canvas bounds.
  if (char.x < 0 || char.x >= charCanvas.ctx.canvas.width ||
      char.y < 0 || char.y >= charCanvas.ctx.canvas.height)
  {
    isValid = false;
  }

  // Verify space is not occupied by a boundary.
  // First check if character is within canvas bounds; no need to check space if already invalid.
  if (isValid)
  {
    var element;
    // Loop through each boundary canvas element and determine if canvas-relative positions match.
    for (var i = 0; i < storyCanvas.elements.length; i++)
    {
      element = storyCanvas.elements[i];
      if (element.type == BOUNDARY_ID &&
          element.x == char.x && element.y == char.y)
      {
        // Space is occupied by a boundary.
        isValid = false;
        break;
      }
    }
  }

  // Move character if space is valid. Otherwise, stop program and alert user.
  if (isValid)
  {
    // Clear previous position from canvas.
    charCanvas.clear();
    // Move by one grid unit, i.e. size of character.
    char.pos += char.size;
    char.drawSquare();
  } else
  {
    // Stop line-by-line execution of program by clearing interval of jsInterpreter loop in blockly.js.
    clearInterval(executor);

    // Alert user of collision with boundary.
    displayAppAlert(3);
  }
}

/**
 * Moves character forward one space.
 * Note: direction is automatically taken into account with transformations.
 */
function moveForward()
{
  var character = charCanvas.elements.find(element => element.type == CHARACTER_ID);

  // Track position relative to canvas using direction relative to canvas.
  trackPos(character);

  // Move character if space is valid.
  moveWithValidator(character);
}

/*******************
 * MAZE COMPLETION *
 *******************/
/**
 * Determine if maze was traversed successfully, i.e., character and goal coordinates are equal.
 * If so, notify user.
 */
function checkCompletion()
{
  var character = charCanvas.elements.find(element => element.type == CHARACTER_ID);
  var goal = storyCanvas.elements.find(element => element.type == GOAL_ID);
  var decoys = storyCanvas.elements.filter(element => element.type == DECOY_ID);

  // Check if character and any decoy coordinates are the same, i.e. user chose incorrect goal.
  for (decoy of decoys)
  {
    if (round(character.x) == round(decoy.x) && round(character.y) == round(decoy.y))
    {
      // Alert user incorrect goal was chosen.
      displayAppAlert(2);
    }
  }

  // Check if character and goal coordinates are the same, i.e. maze is completed.
  // Rounding issues may cause character.x/y and goal.x/y to be VERY slightly off when maze is actually completed,
  // round values to the nearest thousandth to counteract this.
  if (round(character.x) == round(goal.x) && round(character.y) == round(goal.y))
  {
    // User successfully traversed current level's maze, update user's current level and proceed to next level.
    $.post("../php/setProgress.php", { nextLevel: storyObj.currLvl+1 }, function(data) {
      if (data.success)
      {
        // User's current level was successfully updated in database, give option to go to next level.
        if (storyObj.finalCutscenes.length > 0)
        {
          goNextLvl();
        } else if (storyObj.currLvl == storyObj.totalLvls)
        {
          displayAppAlert(1);
        } else
        {
          displayAppAlert(0);
        }
        
      } else
      {
        // Update was not successful, redirect to dashboard with error.
        var error = "User data update unsuccessful! " + data.msg;
        window.location.replace("dashboard.php?notify=" + error + "&notifyType=2");
      }
    }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong, redirect to dashboard with error.
      error = "An error occurred when updating user data: " + error;
      window.location.replace("dashboard.php?notify=" + error + "&notifyType=2");
    });
  }
  // Do not output anything if user did not reach goal nor decoy.

  /**
   * Rounds passed value to the nearest thousandth.
   * @return rounded value.
   */
  function round(num)
  {
    return Math.round(1000 * num) / 1000;
  }
}