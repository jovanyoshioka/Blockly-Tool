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

const ASSETS_PATH = "../assets/";

/*********
 * MODAL *
 *********/
/**
 * Opens specified modal and tints background.
 * @param modalId ID of modal element to show.
 */
function openModal(modalId)
{
  document.querySelector(".modalBackground").classList.add("show");
  document.getElementById(modalId).classList.add("show");
}
/**
 * Closes specified modal and revert background.
 * @param modalNode modal element to hide.
 */
function closeModal(modalNode)
{
  document.querySelector(".modalBackground").classList.remove("show");
  modalNode.classList.remove("show");
}

/*******************
 * MULTI-STEP FORM *
 *******************/
/**
 * Dynamically applies animation of form switching to next tab.
 * Supports both "next" and "back".
 * 
 * CSS Requirements:
 * -All Form Tabs:
 *   transition: opacity 0.5s, transform 0.5s;
 * -Initially Hidden Form Tabs:
 *   opacity: 0.0;
 *   transform: translateX(-100%);
 *   pointer-events: none;
 * 
 * @param hideID ID of form tab to slide out of view.
 * @param showID ID of form tab to slide into view.
 */
function switchFormTabs(hideID, showID)
{
  var hideTab = document.getElementById(hideID);
  var showTab = document.getElementById(showID);

  // Determine translation of tab to hide based on current position of tab to show.
  // If showTab is to the [right/left], it will slide to the [left/right], and thus hideTab should slide to the [left/right].
  var transformMatrix = window.getComputedStyle(showTab).getPropertyValue("transform");
  var transformVals = transformMatrix.replace(/(matrix\(|\))/g, '').split(', ');
  // "translateX" is index 4 of above transform values array.
  var translation = -(transformVals[4]);

  // Slide hideTab out of view.
  hideTab.style.opacity = 0.0;
  hideTab.style.transform = "translateX(" + translation + "px)";
  hideTab.style.pointerEvents = "none";

  // Slide showTab into view.
  showTab.style.opacity = 1.0;
  showTab.style.transform = "translateX(0)";
  showTab.style.pointerEvents = "all";
}