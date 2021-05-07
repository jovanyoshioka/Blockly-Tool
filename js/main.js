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

/**
 * Controls mode selection animation in Generator page.
 * @param btnNode Clicked DOM button object, i.e. the mode selected.
 */
function selectMode(btnNode)
{
  // Expand button to full width of screen and "remove" hover effect.
  // By "remove," make hover effect permanent.
  btnNode.style.zIndex = 2;
  btnNode.style.width = "100%";
  btnNode.querySelector("img").style.transform = "scale(1.1,1.1)";

  // Disable mode buttons.
  var imgs = document.querySelectorAll(".modeBtn");
  imgs[0].style.pointerEvents = "none";
  imgs[1].style.pointerEvents = "none";
  
  // Slide up form after button expansion animation is complete.
  setTimeout(function() {
    document.querySelector("section").style.transform = "none";
  }, 750);
}