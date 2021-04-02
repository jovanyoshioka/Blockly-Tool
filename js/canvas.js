/*************
 * CONSTANTS *
 *************/
const GRID_DOT_SIZE  = 5;
const GRID_DOT_COLOR = "#666666";

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

    // Number of units per grid row or grid column.
    this.unitsPerLine = 10;
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
          GRID_DOT_SIZE / 2, 
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

    // Differentiates between: character, boundary, goal
    // Specific actions, mostly related to movement, only for specific types.
    this.type = type;
  }

  /**
   * Places element onto canvas as a square.
   */
  drawSquare()
  {
    // Character element undergoes transformations, so position used to draw is different.
    if (this.type == "character")
    {
      // TEMPORARY FILL STYLE
      var gradient = this.canvasObj.ctx.createLinearGradient(this.pos, 0, this.pos + this.size, 0);
      gradient.addColorStop(0, "blue");
      gradient.addColorStop(1, "red");
      this.canvasObj.ctx.fillStyle = gradient;

      // Use transformation relative position for character type.
      this.canvasObj.ctx.fillRect(
        this.pos,
        0,
        this.size,
        this.size
      );
    } else
    {
      // TEMPORARY FILL STYLE
      this.canvasObj.ctx.fillStyle = "#000000";

      // Use tracked position (x,y) for all other element types.
      this.canvasObj.ctx.fillRect(
        this.x,
        this.y,
        this.size,
        this.size
      );
    }
  }
}

var charCanvas, storyCanvas;

window.addEventListener('load', function () {
  // Instantiate canvas objects for character and other story elements.
  charCanvas = new canvasContainer("charCanvas");
  storyCanvas = new canvasContainer("storyCanvas");
  storyCanvas.drawGrid();

  // TEMPORARY INITIALIZING OF CHARACTER AND STORY ELEMENTS
  charCanvas.elements.push(new canvasElement(charCanvas, 0, 0, "character"));
  charCanvas.elements[0].drawSquare();

  // TEMPORARY DEMO MAZE
  storyCanvas.elements.push(new canvasElement(storyCanvas, 0, 67.5, "boundary"));
  storyCanvas.elements[0].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 67.5, 67.5, "boundary"));
  storyCanvas.elements[1].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 135, 67.5, "boundary"));
  storyCanvas.elements[2].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 202.5, 67.5, "boundary"));
  storyCanvas.elements[3].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 270, 67.5, "boundary"));
  storyCanvas.elements[4].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 337.5, 67.5, "boundary"));
  storyCanvas.elements[5].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 472.5, 67.5, "boundary"));
  storyCanvas.elements[6].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 472.5, 0, "boundary"));
  storyCanvas.elements[7].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 337.5, 135, "boundary"));
  storyCanvas.elements[8].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 472.5, 135, "boundary"));
  storyCanvas.elements[9].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 405, 202.5, "boundary"));
  storyCanvas.elements[10].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 337.5, 202.5, "boundary"));
  storyCanvas.elements[11].drawSquare();
  storyCanvas.elements.push(new canvasElement(storyCanvas, 472.5, 202.5, "boundary"));
  storyCanvas.elements[12].drawSquare();
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
  var character = charCanvas.elements.find(element => element.type == "character");
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
      if (element.type == "boundary" &&
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
  var character = charCanvas.elements.find(element => element.type == "character");

  // Track position relative to canvas using direction relative to canvas.
  trackPos(character);

  // Move character if space is valid.
  moveWithValidator(character);
}