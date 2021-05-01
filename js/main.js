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

// TEMPORARY: Need to change to "../assets/" for PHP pages.
// This is "assets/" for the temporary index.html so demo still runs on GitHub Pages
// while we setup the webserver.
const ASSETS_PATH = "assets/";

window.addEventListener('load', function () {
  loadStory(document.getElementById("storySelector").value);
});
