window.addEventListener('load', function () {
  // Initialize default coding workspace.
  // Note: Block capacity is set in updateWorkspace(x);
  workspace = Blockly.inject("workspace",
    {toolbox: document.getElementById("toolbox")});

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
 * Updates coding workspace attribute(s), i.e. block capacity.
 * @param cap block capacity.
 */
function updateWorkspace(cap)
{
  // Update block capacity.
  workspace.options.maxBlocks = cap;

  // Initialize block capacity text/counter.
  initCapTxt(cap);
}

/**
 * Translates block code into JavaScript.
 * @param workspaceObj workspace to be translated
 * @return translated code as string
 */
function getTranslatedCode(workspaceObj)
{
  return Blockly.JavaScript.workspaceToCode(workspaceObj);
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