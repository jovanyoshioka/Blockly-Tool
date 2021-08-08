<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include('../php/head.php'); ?>
    <style>
      canvas {
        width: 750px;
        height: 750px;
        background-color: #000000;
      }
      canvas:hover {
        cursor: pointer;
      }

      select {
        margin-left: 25px;
        min-width: 50px;
        font-size: 1.5em;
      }

      div {
        width: 500px;
        height: 750px;
        position: absolute;
        top: 0;
        right: 0;
        background-color: #FFFFFF;
        text-align: center;
      }
      div h1 {
        margin: 0;
      }
      div textarea {
        width: 450px;
        height: 100px;
        margin-bottom: 25px;
      }
      div button {
        font-size: 1.5em;
      }
      div button:hover {
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <!-- Note: This page is temporary and only for manually generating mazes. -->
    <canvas></canvas>
    <br /><br />
    <select id="type">
      <option value="0">Empty</option>
      <option value="1">Character</option>
      <option value="2">Boundary</option>
      <option value="3">Goal</option>
      <option value="4">Fake Goal</option>
    </select>

    <div>
      <h1>Character Coords</h1>
      <textarea id="char"></textarea>
      <h1>Boundary Coords</h1>
      <textarea id="bound"></textarea>
      <h1>Goal Coords</h1>
      <textarea id="goal"></textarea>
      <h1>Decoy Coords</h1>
      <textarea id="decoy"></textarea>
      <button onclick="formatData()">Format</button>
    </div>

    <script>

      const UNITS_PER_LINE = 13;

      var points = [];

      var ctx;
      var unitSize;

      /**
       * Draws dot on canvas at given grid coordinates.
       */
      function drawDot(x, y, size, color)
      {
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
       * Generates maze grid (canvas and array).
       */
      function generateGrid()
      {
        // Initialize canvas.
        var canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        ctx.canvas.width = canvas.offsetWidth;
        ctx.canvas.height = canvas.offsetHeight;
        unitSize = ctx.canvas.width / UNITS_PER_LINE;

        // Draw grid.
        for (var i = 0; i < UNITS_PER_LINE; i++)
        {
          for (var j = 0; j < UNITS_PER_LINE; j++)
          {
            drawDot(i, j, (unitSize * 0.2) / 2, "#FFFFFF");
          }
        }

        // Generate array of grid spaces, i.e. points.
        // 0 => Empty, 1 => Character, 2 => Boundary, 3 => Goal, 4 => Decoy Goal
        for (var i = 0; i < UNITS_PER_LINE; i++)
        {
          points[i] = [];
          for (var j = 0; j < UNITS_PER_LINE; j++)
          {
            points[i][j] = 0;
          }
        }
      }

      /**
       * Compiles points array into string based on type to be inserted into database.
       */
      function formatData()
      {
        var char, bound, goal, decoy;
        char = bound = goal = decoy = "";

        for (var i = 0; i < UNITS_PER_LINE; i++)
        {
          for (var j = 0; j < UNITS_PER_LINE; j++)
          {
            // Append coordinate to correct type string.
            // Append "/" as separator if not first coordinate.
            // Note: i => y, j => x
            switch (points[i][j])
            {
              case 1:
                // Character
                if (char != "") char += "/";
                char += j + "," + i;
                break;
              case 2:
                // Boundary
                if (bound != "") bound += "/";
                bound += j + "," + i;
                break;
              case 3:
                // Goal
                if (goal != "") goal += "/";
                goal += j + "," + i;
                break;
              case 4:
                // Decoy Goal
                if (decoy != "") decoy += "/";
                decoy += j + "," + i;
                break;
              // Do nothing if type is empty.
            }
          }
        }

        // Display data strings into respective <textarea> elements.
        document.getElementById("char").value = char;
        document.getElementById("bound").value = bound;
        document.getElementById("goal").value = goal;
        document.getElementById("decoy").value = decoy;
      }

      window.addEventListener('load', function () {
        generateGrid();
      });

      window.addEventListener('click', function(e) {
        // Get mouse click coordinates.
        var x = e.pageX;
        var y = e.pageY;

        // Verify mouse click within grid area.
        if (x <= ctx.canvas.width && x > 0 && y <= ctx.canvas.height && y > 0)
        {
          // Get type to change space to.
          var type = document.getElementById("type").value;

          // Determine coordinates of grid space clicked.
          x = parseInt(x / unitSize);
          y = parseInt(y / unitSize);

          // Change type within points array to later be formatted for insertion into database.
          // Note: points[row][col] <=> points[y][x]
          points[y][x] = parseInt(type);

          // Change color of dot on canvas based on type.
          // 0 => White, 1 => Orange, 2 => Purple, 3 => Lime, 4 => Red
          colors = ["#FFFFFF", "#FF8200", "#C900FF", "#27FF00", "#FF0000"]
          drawDot(x, y, (unitSize * 0.2) / 2, colors[type]);
        }
      });
    </script>
  </body>
</html>