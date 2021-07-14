<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
  </head>
  <body>
    <!-- Note: This page is temporary and only for experimenting with maze generation. -->
    <canvas style="width:750px;height:750px;background-color:black;"></canvas>

    <script>

      var ctx;
      var unitsPerLine = 7;
      var unitSize;

      function drawDot(x, y, size, color)
      {
        // Draw dot for current grid unit.
        ctx.beginPath();
        ctx.arc(
        (unitSize * x) + unitSize / 2,
        (unitSize * y) + unitSize / 2,
        size, 
        0, 2 * Math.PI, false
        );
        ctx.fillStyle = color;
        ctx.fill();
      }

      /**
       * Generates maze using iterative implementation of the depth-first search maze generation algorithm.
       */
      function generateMaze()
      {
        // Initialize canvas.
        var canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        ctx.canvas.width = canvas.offsetWidth;
        ctx.canvas.height = canvas.offsetHeight;
        unitSize = ctx.canvas.width / unitsPerLine;

        // Draw grid.
        for (var i = 0; i < unitsPerLine; i++)
        {
          for (var j = 0; j < unitsPerLine; j++)
          {
            drawDot(i, j, (unitSize * 0.075) / 2, "#FFFFFF");
          }
        }

        // Generate array of grid spaces, i.e. points.
        var points = [];
        for (var i = 0; i < unitsPerLine; i++)
        {
          points[i] = [];
          for (var j = 0; j < unitsPerLine; j++)
          {
            points[i][j] = false;
          }
        }

        // Generate array of walls.
        var walls = [];
        var temp = 0;
        for (var i = 0; i < (unitsPerLine * 2); i++)
        {
          walls[i] = [];
          for (var j = 0; j < (unitsPerLine); j++)
          {
            if (i % 2 != 0)
            {
              temp = j;
            } else
            {
              temp = j + 0.5;
            }
            walls[i][j] = {
              x: temp,
              y: (i * 0.5)
            };
          }
        }

        // Randomize starting point.
        var initX = Math.floor(Math.random() * unitsPerLine);
        var initY = Math.floor(Math.random() * unitsPerLine);
        // Draw dot for character (initial starting pos).
        drawDot(initX, initY, unitSize * 0.25, "orange");
        // Mark starting point as visited (true) in points array.
        points[initX][initY] = true;

        var delay = 1;
        var stack = [];

        // Add starting point to stack for later reference when backtracking.
        stack.push([initX,initY]);

        var currPoint;
        var neighbors = [];
        var avg = 0;
        while (stack.length != 0)
        {
          neighbors = [];

          // Set current point as most recently added point in the stack.
          currPoint = {x:stack[stack.length-1][0],y:stack[stack.length-1][1]};
          stack.pop();

          // Determine unvisited neighboring point (east, north, west, and south).
          if ((currPoint.x+1) < unitsPerLine && !points[currPoint.x+1][currPoint.y])
            neighbors.push([currPoint.x+1,currPoint.y]);
          if ((currPoint.y+1) < unitsPerLine && !points[currPoint.x][currPoint.y+1])
            neighbors.push([currPoint.x,currPoint.y+1]);
          if ((currPoint.x-1) >= 0 && !points[currPoint.x-1][currPoint.y])
            neighbors.push([currPoint.x-1,currPoint.y]);
          if ((currPoint.y-1) >= 0 && !points[currPoint.x][currPoint.y-1])
            neighbors.push([currPoint.x,currPoint.y-1]);
          
          if (neighbors.length != 0)
          {
            // Push the current cell to the stack.
            stack.push([currPoint.x,currPoint.y]);

            // Randomly choose one of the unvisited neighbors.
            var chosenIndx = Math.floor(Math.random() * neighbors.length);

            // Remove the wall between the current and chosen point.
            // Note: Walls are between points, so walls' coordinates are averages of two neighboring points.
            if (neighbors[chosenIndx][0] == currPoint.x)
            {
              // Same x, so average y.
              avg = (currPoint.y + neighbors[chosenIndx][1]) / 2;
              for (var i = 0; i < walls.length; i++)
              {
                for (var j = 0; j < walls[i].length; j++)
                {
                  if (walls[i][j].x == currPoint.x && walls[i][j].y == avg)
                  {
                    // Wall found, delete from array.
                    walls[i].splice(j, 1);
                  }
                }
              }
            } else if (neighbors[chosenIndx][1] == currPoint.y)
            {
              // Same y, so average x.
              avg = (currPoint.x + neighbors[chosenIndx][0]) / 2;
              for (var i = 0; i < walls.length; i++)
              {
                for (var j = 0; j < walls[i].length; j++)
                {
                  if (walls[i][j].x == avg && walls[i][j].y == currPoint.y)
                  {
                    // Wall found, delete from array.
                    walls[i].splice(j, 1);
                  }
                }
              }
            } else
            {
              console.error("Failed relating current point and chosen point.");
            }

            // Mark chosen as visited and push to the stack.
            points[neighbors[chosenIndx][0]][neighbors[chosenIndx][1]] = true;
            stack.push([neighbors[chosenIndx][0],neighbors[chosenIndx][1]]);
          } else
          {
            // TEMPORARY: At dead end, place goal. This will later have to be tweaked to do this after several moves based on difficulty.
            // Possibly back track one, open up a passage and continue maze generation?
            if (delay == 1)
            {
              drawDot(currPoint.x, currPoint.y, unitSize * 0.25, "lime");
              delay = 0;
            } else if (delay > 0)
            {
              delay--;
            }
          }

        }

        // Draw walls on canvas.
        for (var i = 0; i < walls.length; i++)
        {
          for (var j = 0; j < walls[i].length; j++)
          {
            // Drawing walls as lines.
            ctx.beginPath();
            if (walls[i][j].x % 1 != 0)
            {
              // Vertical line.
              ctx.moveTo((walls[i][j].x * unitSize) + (unitSize / 2), ((walls[i][j].y - 0.5) * unitSize) + (unitSize / 2));
              ctx.lineTo((walls[i][j].x * unitSize) + (unitSize / 2), ((walls[i][j].y + 0.5) * unitSize) + (unitSize / 2));
            } else
            {
              // Horizontal line.
              ctx.moveTo(((walls[i][j].x - 0.5) * unitSize) + (unitSize / 2), (walls[i][j].y * unitSize) + (unitSize / 2));
              ctx.lineTo(((walls[i][j].x + 0.5) * unitSize) + (unitSize / 2), (walls[i][j].y * unitSize) + (unitSize / 2));
            }
            ctx.strokeStyle = "red";
            ctx.stroke();

            // Drawing walls' grid positions as circles.
            // if (walls[i][j].x < unitsPerLine-0.5 && walls[i][j].y < unitsPerLine-0.5)
            // {
            //   ctx.beginPath();
            //   ctx.arc(
            //     (unitSize * walls[i][j].x) + unitSize / 2,
            //     (unitSize * walls[i][j].y) + unitSize / 2,
            //     unitSize * 0.15, 
            //     0, 2 * Math.PI, false
            //   );
            //   ctx.fillStyle = "red";
            //   ctx.fill();
            // }
          }
        }
      }

      window.addEventListener('load', function () {
        generateMaze();
      });
    </script>
  </body>
</html>