/*************
 * CONSTANTS *
 *************/
const GRID_DOT_SIZE = 5;
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
    this.unitsPerLine = 15;
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
  constructor(canvasObj, x, y)
  {
    // Canvas of which this element belongs to.
    this.canvasObj = canvasObj;

    // Element properties.
    this.x = x;
    this.y = y;
    this.dir = 0;
    this.size = this.canvasObj.unitSize;
  }

  // Places element onto canvas as a square.
  drawSquare()
  {
    // TEMPORARY FILL STYLE
    var gradient = this.canvasObj.ctx.createLinearGradient(this.x, this.y, this.x + this.size, this.y);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "red");
    this.canvasObj.ctx.fillStyle = gradient;
    this.canvasObj.ctx.fillRect(
      this.x,
      this.y,
      this.size,
      this.size
    );
  }

  // Places element onto canvas as a circle.
  drawCircle()
  {
    this.canvasObj.ctx.beginPath();
    this.canvasObj.ctx.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 2, 0,
      2 * Math.PI,
      false
    );
    // TEMPORARY FILL STYLE
    this.canvasObj.ctx.fillStyle = "#000000";
    this.canvasObj.ctx.fill();
  }
}

var charCanvas, storyCanvas;

window.addEventListener('load', function () {
  // Instantiate canvas objects for character and other story elements.
  charCanvas = new canvasContainer("charCanvas");
  storyCanvas = new canvasContainer("storyCanvas");
  storyCanvas.drawGrid();

  // TEMPORARY INITIALIZING OF CHARACTER AND STORY ELEMENTS
  charCanvas.elements.push(new canvasElement(charCanvas, 0, 0));
  charCanvas.elements[0].drawSquare();

  storyCanvas.elements.push(new canvasElement(storyCanvas, 450, 450));
  storyCanvas.elements[0].drawSquare();
});

/************
 * MOVEMENT *
 ************/

/**
 * Rotates character in certain direction.
 * @param dir direction to rotate, 'L': Math.PI / 2 Radians, 'R': -Math.PI / 2 Radians.
 */
function turn(dir)
{
  var character = charCanvas.elements[0];
  var angle = dir == 'L' ? Math.PI / 2
            : dir == 'R' ? -Math.PI / 2
            : 0;

  // Clear previous orientation from canvas.
  charCanvas.clear();

  // Translate to center of character.
  charCanvas.ctx.translate(character.x + character.size/2, character.y + character.size/2);
  // Invert (-) angle since canvas uses clockwise as positive.
  charCanvas.ctx.rotate(-angle);
  // Translate to initial position.
  charCanvas.ctx.translate(-(character.x + character.size/2), -(character.y + character.size/2));

  // Draw new orientation on canvas.
  character.drawSquare();

  // Set direction for future 
  character.dir = dir;
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
 * Moves character forward one space.
 * Note: direction is automatically taken into account.
 */
function moveForward()
{
  var character = charCanvas.elements[0];

  // Clear previous position from canvas.
  charCanvas.clear();

  // Move character.
  character.x += character.size;
  character.drawSquare();
}