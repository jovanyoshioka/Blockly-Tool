/***********
 * GLOBALS *
 ***********/
// blockly.js
var workspace;
var executor;
// canvas.js
var charCanvas;
var storyCanvas;
// story.js
var storyObj;

window.addEventListener('load', function () {
  loadStory(document.getElementById("storySelector").value);
});