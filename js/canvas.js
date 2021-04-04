/*************
 * CONSTANTS *
 *************/
const GRID_DOT_SCALER = 0.075;
const GRID_DOT_COLOR  = "#FFFFFF";
const CHARACTER_ID    = "character";
const BOUNDARY_ID     = "boundary";
const GOAL_ID         = "goal";

/***********
 * GLOBALS *
 ***********/
var charCanvas;
var storyCanvas;

/***********
 * CLASSES *
 ***********/
class canvasContainer
{
  constructor(canvasID)
  {
    var canvasElement = document.getElementById(canvasID);

    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.ctx.canvas.width = canvasElement.offsetWidth;
    this.ctx.canvas.height = canvasElement.offsetHeight;

    // Clear canvas element of any prior drawings.
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Number of units per grid row or grid column.
    this.unitsPerLine = 5;
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

class canvasElement
{
  constructor(canvasObj, x, y, type)
  {
    // Canvas of which this element belongs to.
    this.canvasObj = canvasObj;

    // Element properties.
    // Tracks element's position relative to canvas.
    this.x = x;
    this.y = y;
    // Tracks element's position relative to transformation.
    this.pos = 0;
    // Tracks element's direction relative to canvas (from 0 to 2pi).
    this.dir = 0;
    // Each element's size is equivalent to one grid unit size.
    this.size = this.canvasObj.unitSize;

    // Differentiates between: character, boundary, goal.
    // Specific actions, mostly related to movement, only for specific types.
    this.type = type;

    // Images for character, boundary, and goal elements.
    // TEMPORARY: This will later be set by user input.
    this.charImgSrc = "assets/caterpillar.png";
    this.boundImgSrc = "assets/leaves.PNG";
    this.goalImgSrc = "assets/apple.png";
  }

  /**
   * Places element onto canvas as a square.
   */
  drawSquare()
  {
    var img = new Image(this.size, this.size);
    img.src = this.type == CHARACTER_ID ? this.charImgSrc
            : this.type == BOUNDARY_ID  ? this.boundImgSrc
            : this.type == GOAL_ID      ? this.goalImgSrc
            : null;

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
  // Instantiate canvas objects for character and other story elements.
  charCanvas = new canvasContainer("charCanvas");
  storyCanvas = new canvasContainer("storyCanvas");
  storyCanvas.drawGrid();

  /**
   * FOLLOWING IS TEMPORARY WHILE MAZE GENERATION ALGORITHM IS STILL BEING CONSTRUCTED.
   */

  // TEMPORARY INITIALIZING OF CHARACTER AND STORY ELEMENTS
  charCanvas.elements.push(new canvasElement(charCanvas, 0, 0, CHARACTER_ID));
  charCanvas.elements[0].drawSquare();

  // VERY HUNGRY CATERPILLAR DEMO MAZE
  storyCanvas.elements.push(new canvasElement(storyCanvas, 0, 135, BOUNDARY_ID));
  storyCanvas.elements[0].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 135, 135, BOUNDARY_ID));
  storyCanvas.elements[1].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 540, 135, BOUNDARY_ID));
  storyCanvas.elements[2].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 270, 135, BOUNDARY_ID));
  storyCanvas.elements[3].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 540, 270, BOUNDARY_ID));
  storyCanvas.elements[4].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 540, 0, BOUNDARY_ID));
  storyCanvas.elements[5].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 540, 405, BOUNDARY_ID));
  storyCanvas.elements[6].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 405, 405, BOUNDARY_ID));
  storyCanvas.elements[7].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 270, 405, BOUNDARY_ID));
  storyCanvas.elements[8].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 270, 270, BOUNDARY_ID));
  storyCanvas.elements[9].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 405, 270, GOAL_ID));
  storyCanvas.elements[10].drawSquare();
}

window.addEventListener('load', function () {
  generateMaze();
});

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
  if (char.dir > 3 * Math.PI / 2)
  {
    char.dir = 0;
  } else if (char.dir < 0)
  {
    char.dir = 3 * Math.PI / 2;
  }
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

  // Translate to center of character.
  charCanvas.ctx.translate(character.pos + character.size/2, character.size/2);
  // Invert (-) angle since canvas uses clockwise as positive.
  charCanvas.ctx.rotate(-angle);
  // Translate to initial position.
  charCanvas.ctx.translate(-(character.pos + character.size/2), -character.size/2);

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
      console.log("An error occured while identifying character's direction!");
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
  if (char.x < 0 || char.x > charCanvas.ctx.canvas.width ||
      char.y < 0 || char.y > charCanvas.ctx.canvas.height)
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

    // Notify user.
    alert("You ran into something!");
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

  // Check if character and goal coordinates are the same.
  if (character.x == goal.x && character.y == goal.y)
  {
    // User successfully traversed maze, notify user.
    alert("You successfully completed the maze!");
  }
}