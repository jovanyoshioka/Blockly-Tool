/**
 * JS-Interpreter requires an API to handle commands due to its isolation.
 */

 function initApi(interpreter, globalObject)
 {
   var wrapper;
 
   // Add an API function for highlighting blocks.
   wrapper = function(id)
   {
     return workspace.highlightBlock(id);
   };
   interpreter.setProperty(globalObject, "highlightBlock",
     interpreter.createNativeFunction(wrapper));
 
   // Add an API function for moveForward() block.
   wrapper = function()
   {
     return moveForward();
   };
   interpreter.setProperty(globalObject, "moveForward",
     interpreter.createNativeFunction(wrapper));
 
   // Add an API function for turnLeft() block.
   wrapper = function()
   {
     return turnLeft();
   };
   interpreter.setProperty(globalObject, "turnLeft",
     interpreter.createNativeFunction(wrapper));
 
   // Add an API function for turnRight() block.
   wrapper = function()
   {
     return turnRight();
   };
   interpreter.setProperty(globalObject, "turnRight",
     interpreter.createNativeFunction(wrapper));
 }