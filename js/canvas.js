class canvasContainer
{
  constructor(canvasID)
  {
    var canvasElement = document.getElementById(canvasID);

    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.ctx.canvas.width = canvasElement.offsetWidth;
    this.ctx.canvas.height = canvasElement.offsetHeight;

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
}

class canvasElement
{
  constructor(x, y, canvasObj)
  {
    // Element properties.
    this.x = x;
    this.y = y;
    this.dir = 0;
    // TEMPORARY: SET SIZE DYNAMICALLY BASED ON CANVAS SIZE
    this.size = 75;

    // Canvas of which this element belongs to.
    this.canvasObj = canvasObj;
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

  // TEMPORARY INITIALIZING OF CHARACTER AND STORY ELEMENTS
  charCanvas.elements.push(new canvasElement(0, 0, charCanvas));
  charCanvas.elements[0].drawSquare();

  storyCanvas.elements.push(new canvasElement(450, 450, storyCanvas));
  storyCanvas.elements[0].drawSquare();
});

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