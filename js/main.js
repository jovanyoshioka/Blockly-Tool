var workspace;
window.addEventListener('load', function () {
  // Inject workspace into DOM.
  workspace = Blockly.inject("blocklyDiv",
    {toolbox: document.getElementById("toolbox")});

  // Update displayed JavaScript when workspace (block code) is manipulated.
  workspace.addChangeListener(updateJS);

  // Prevent user's code from colliding with local variables.
  Blockly.JavaScript.addReservedWords("workspace", "code", "lines", "highlightBlock");

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
 * Highlights block of code being currently executed.
 * @param id serial number of block to be highlighted (auto-passed)
 */
function highlightBlock(id)
{
  workspace.highlightBlock(id);
}

/**
 * Runs translated code.
 */
function runCode()
{
  // Evaluate code string as JavaScript. Watch for any runtime errors.
  try
  {
    eval(getTranslatedCode(workspace));
  } catch (e)
  {
    alert(e);
  }
}