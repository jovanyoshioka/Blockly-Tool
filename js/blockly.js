var workspace;

window.addEventListener('load', function () {
  // Inject workspace into DOM.
  workspace = Blockly.inject("workspace",
    {toolbox: document.getElementById("toolbox")});

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
  document.getElementById("jsCode").value = code;
}

/**
 * Runs translated code.
 */
function runCode()
{
  // Disable run button.
  // TEMPORARY: Instead, change to a pause/reset button?
  document.getElementById("run").disabled = true;
  
  var code = getTranslatedCode(workspace);
  var jsInterpreter = new Interpreter(code, initApi);
  
  /**
   * Steps through code utilizing JS-Interpreter.
   */
  function nextStep()
  {
    if (jsInterpreter.step())
    {
      // Execute next available semantic unit.
      setTimeout(nextStep, 100);
    } else
    {
      // End of program
      // Remove all highlighting.
      workspace.highlightBlock(null);
      // Enable run button.
      document.getElementById("run").disabled = false;
    }
  }
  nextStep();
}