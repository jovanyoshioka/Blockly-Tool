window.addEventListener('load', function () {
  // Initialize default coding workspace.
  // Note: Block capacity is set in initCap(x);
  workspace = Blockly.inject("workspace",
    {
      toolbox: document.getElementById("textToolbox"),
      renderer: "thrasos",
      rendererOverrides: {
        'FIELD_TEXT_FONTSIZE': 14,
        'ADD_START_HATS': true
      }
    }
  );

  // Dynamically update blocks capacity counter.
  workspace.addChangeListener(updateCapTxt);

  // Update displayed JavaScript when workspace (block code) is manipulated.
  workspace.addChangeListener(updateJS);

  // Prevent user's code from colliding with local variables.
  Blockly.JavaScript.addReservedWords("workspace", "code", "lines");

  // Prevents infinite loops by using a counter.
  window.LoopTrap = 1000;
  Blockly.JavaScript.INFINITE_LOOP_TRAP = "if(--window.LoopTrap == 0) throw 'Infinite loop.';\n";

  // Set to highlight block of code when executed.
  Blockly.JavaScript.STATEMENT_PREFIX = "highlightBlock(%1);\n";
});

/**
 * Updates block capacity counter conditionally.
 */
function updateCapTxt()
{
  var blocksLeft = workspace.remainingCapacity();

  // Only update counter if finite block capacity is set. Otherwise, <span> will not exist and error thrown.
  if (blocksLeft != "Infinity")
    document.querySelector("h1#capacity span").innerHTML = blocksLeft;
}

/**
 * Initializes block capacity text/counter.
 * @param cap block capacity.
 */
function initCapTxt(cap)
{
  var capacityTxtNode = document.getElementById("capacity");

  // Set text/counter.
  if (cap != "Infinity")
    capacityTxtNode.innerHTML = "Blocks Left: <span>" + cap + "</span>";
  else
    capacityTxtNode.innerHTML = "No Block Limit";
}


/**
 * Initializes coding workspace block capacity.
 * @param cap block capacity.
 */
function initCap(cap)
{
  // Update block capacity.
  workspace.options.maxBlocks = cap;

  // Initialize block capacity text/counter.
  initCapTxt(cap);
}

/**
 * Sets workspace toolbox to either text or image-based.
 * @param isImage If true, image-based. If false, text-based.
 */
function setToolbox(isImage)
{
  // Define toolbox node to update workspace to.
  var type = isImage ? "img" : "text"
  var toolboxNode = document.getElementById(type + "Toolbox");
  // Update workspace toolbox.
  workspace.updateToolbox(toolboxNode);
}

// Return [number of blocks to skip, block]
function makeLoop(block)
{
  var toSkip = 0;
  var times, temp;
  var doXML = "";
  var str = "";
  var response = [];

  times = block.getInputTargetBlock("TIMES");
  if (times !== null)
  {
    toSkip++;
    times = '<block type="math_number"><field name="NUM">' + times.type[times.type.length - 1] + '</field></block>"';
  }
  else times = "";
  
  temp = block.getInputTargetBlock("DO");
  if (temp !== null)
  {
    if (temp.type == "controls_repeat_ext_img")
    {
      response = makeLoop(temp);
      toSkip += response[0];
      doXML += response[1];
    } else
    {
      str = temp.type;
      str = str.replace("_img", "");
      doXML += '<block type="' + str + '">%</block>';
    }
    toSkip++;

    while (temp = temp.getNextBlock())
    {
      if (temp.type == "controls_repeat_ext_img")
      {
        response = makeLoop(temp);
        toSkip += response[0];
        if (doXML.indexOf("%") != -1) doXML = doXML.replace('%', '<next>' + response[1] + '</next>');
        else doXML += response[1];
      } else
      {
        str = temp.type;
        str = str.replace("_img", "");
        if (doXML.indexOf("%") != -1) doXML = doXML.replace('%', '<next><block type="' + str + '">%</block></next>');
        else doXML += '<block type="' + str + '">%</block>';
      }
      toSkip++;
    }

    doXML = doXML.replace("%", "");
  }
  
  blockText = `
    <block type='controls_repeat_ext'>
      <value name='TIMES'>
        ` + times + `
      </value>
      <statement name='DO'>
        ` + doXML + `
      </statement>
      %
    </block>
  `;

  return [toSkip, blockText];
}

// Return [number of blocks to skip, block]
function makeLoopImg(block)
{
  var toSkip = 0;
  var times, temp;
  var doXML = "";
  var str = "";
  var response = [];

  times = block.getInputTargetBlock("TIMES");
  if (times !== null)
  {
    toSkip++;
    times = times < 0 ? times = 0
          : times > 9 ? times = 9
          : times;
    times = '<block type="math_number_' + times + '"></block>';
  }
  else times = "";
  
  temp = block.getInputTargetBlock("DO");
  if (temp !== null)
  {
    if (temp.type == "controls_repeat_ext")
    {
      response = makeLoopImg(temp);
      toSkip += response[0];
      doXML += response[1];
    } else
    {
      str = temp.type;
      doXML += '<block type="' + str + '_img">%</block>';
    }
    toSkip++;

    while (temp = temp.getNextBlock())
    {
      if (temp.type == "controls_repeat_ext")
      {
        response = makeLoopImg(temp);
        toSkip += response[0];
        if (doXML.indexOf("%") != -1) doXML = doXML.replace('%', '<next>' + response[1] + '</next>');
        else doXML += response[1];
      } else
      {
        str = temp.type;
        if (doXML.indexOf("%") != -1) doXML = doXML.replace('%', '<next><block type="' + str + '_img">%</block></next>');
        else doXML += '<block type="' + str + '_img">%</block>';
      }
      toSkip++;
    }

    doXML = doXML.replace("%", "");
  }
  
  blockText = `
    <block type='controls_repeat_ext_img'>
      <value name='TIMES'>
        ` + times + `
      </value>
      <statement name='DO'>
        ` + doXML + `
      </statement>
      %
    </block>
  `;

  return [toSkip, blockText];
}

/**
 * Toggle whether using text or image code blocks, i.e., mode.
 * @param isImage If true, use image code blocks. If false, text code blocks.
 */
function setMode(isImage)
{
  // Toggle Text/Image buttons.
  var buttons = document.getElementById("modes").querySelectorAll("button");
  buttons[0].disabled = !isImage;
  buttons[1].disabled = isImage;

  // Update toolbox.
  setToolbox(isImage);

  // Get all blocks.
  var parentCoords = [];
  var parents = workspace.getTopBlocks();
  parents.forEach(function(parentBlock) {
    parentCoords.push(parentBlock.getRelativeToSurfaceXY());

    // Stop from continuing.
    if ((parentBlock.type == "run" && isImage) || (parentBlock.type == "run_img" && !isImage))
      return;
  });

  var blockText, blockXML, newBlock;
  var toAppend = [];
  var k = 0;
  var times, temp, doXML, toSkip;
  var response = [];
  var currBlock;
  parents.forEach(function(parentBlock) {
    toAppend.push([]);
    
    currBlock = parentBlock;

    do
    {
      times = null;
      temp = null;
      doXML = ``;
      blockText = "";
      toSkip = 0;
      if (currBlock.type == "run") {
        blockText = "<block type='run_img' deletable='false'></block>";
      } else if (currBlock.type == "run_img") {
        blockText = "<block type='run' deletable='false'></block>";
      } else if (currBlock.type == "movement_move_forward") {
        blockText = "<block type='movement_move_forward_img'></block>";
      } else if (currBlock.type == "movement_move_forward_img") {
        blockText = "<block type='movement_move_forward'></block>";
      } else if (currBlock.type == "movement_turn_left") {
        blockText = "<block type='movement_turn_left_img'></block>";
      } else if (currBlock.type == "movement_turn_left_img") {
        blockText = "<block type='movement_turn_left'></block>";
      } else if (currBlock.type == "movement_turn_right") {
        blockText = "<block type='movement_turn_right_img'></block>";
      } else if (currBlock.type == "movement_turn_right_img") {
        blockText = "<block type='movement_turn_right'></block>";
      } else if (currBlock.type == "controls_repeat_ext") {
        response = [];
        response = makeLoopImg(currBlock);
        blockText = response[1];
        blockText = blockText.replace('%', '');
      } else if (currBlock.type == "controls_repeat_ext_img") {
        response = [];
        response = makeLoop(currBlock);
        blockText = response[1];
        blockText = blockText.replace('%', '');
      } else if (currBlock.type == "math_number") {
        times = currBlock.getFieldValue("NUM");
        times = times < 0 ? times = 0
                : times > 9 ? times = 9
                : times;
        blockText = '<block type="math_number_' + times + '"></block>';
      } else
      {
        // TEMPORARY: Image math_number_x block.
        str = currBlock.type;
        blockText = '<block type="math_number"><field name="NUM">' + str[str.length - 1] + '</field></block>';
      }

      blockXML = Blockly.Xml.textToDom(blockText);
      toAppend[k].push(blockXML);
    } while (currBlock = currBlock.getNextBlock());
    k++;
  });

  workspace.clear();

  k = 0;
  var prev;
  toAppend.forEach(function(blocks) {
    for (var i = 0; i < blocks.length; i++)
    {
      newBlock = Blockly.Xml.domToBlock(blocks[i], workspace);
      if (i == 0)
      {
        newBlock.moveTo(parentCoords[k]);
        prev = newBlock.nextConnection;
      }
      else
      {
        newBlock.previousConnection.connect(prev);
        prev = newBlock.nextConnection;
      }
    }
    k++;
  });
}

/**
 * Translates block code into JavaScript.
 * @param workspaceObj workspace to be translated
 * @return translated code as string
 */
function getTranslatedCode(workspaceObj)
{
  var code = "";
  var topBlocks = workspaceObj.getTopBlocks();
  for (var i = 0; i < topBlocks.length; i++)
  {
    if (topBlocks[i].type == "run" || topBlocks[i].type == "run_img")
    {
      // Note: Need to first generate entire workspace code to "initialize generator."
      code = Blockly.JavaScript.workspaceToCode(workspaceObj);
      // Only return code under "Run" block.
      code = Blockly.JavaScript.blockToCode(topBlocks[i]);

      break;
    }
  }

  return code;
}

/**
 * Update displayed JavaScript code when workspace is edited.
 */
function updateJS()
{
  var code = getTranslatedCode(workspace);
  // Filter JavaScript output to not show INFINITE_LOOP_TRAP and STATEMENT_PREFIX.
  var lines = code.split('\n');
  lines = lines.filter(function(line) {
    return !(line.includes("if(--window.LoopTrap == 0) throw 'Infinite loop.';") || line.includes("highlightBlock"));
  });
  code = lines.join('\n');
  // Display filtered JavaScript code.
  // document.getElementById("jsCode").value = code;
}

/**
 * Actions to take when program is ended.
 * Program ended if all code ran, failed maze, or clicked reset button.
 */
function endProgram()
{
  // Remove all highlighting.
  workspace.highlightBlock(null);
  // Stop code execution loop.
  clearInterval(executor);
}

/**
 * Runs translated code.
 */
function runCode()
{
  // Disable run button, enable reset button.
  document.getElementById("run").style.display = "none";
  document.getElementById("reset").style.display = "block";
  
  var code = getTranslatedCode(workspace);
  var jsInterpreter = new Interpreter(code, initApi);
  
  // Steps through code utilizing JS-Interpreter.
  executor = setInterval(function() {
    if (!jsInterpreter.step())
    {
      // No more lines of code, end of program reached.
      // Initiate end program actions.
      endProgram();
      
      // Check and take actions if user successfully completed maze (using function from canvas.js).
      checkCompletion();
    }
  }, 50);
}

/**
 * Resets simulation (code execution and canvas).
 */
function resetSim()
{
  // Initiate end program actions.
  endProgram();

  // Reset canvas to initial view (using function from canvas.js).
  generateMaze();

  // Enable run button, disable reset button.
  document.getElementById("run").style.display = "block";
  document.getElementById("reset").style.display = "none";
}