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