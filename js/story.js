/*************
 * CONSTANTS *
 *************/
// Time (ms) until content no longer visible (due to cutscene).
const SLIDE_IN_DUR = 1750;

/***********
 * CLASSES *
 ***********/
class Story
{
  constructor()
  {
    // Note: The below data changes each level.

    // Maze Elements, Images/Coords.
    this.character  = { img: "",  coord: "" };
    this.boundary   = { img: "",  coords: [] };
    this.goal       = { img: "",  coord: "" };
    this.decoy      = { imgs: [], coords: []};

    // Other Maze Components.
    this.background     = "";
    this.instructions   = "";
    this.cutscenes      = [];
    this.finalCutscenes = [];

    // User's current level.
    this.currLvl = 0;
    // Total number of levels.
    this.totalLvls = 0;
  }
}

/**
 * Initializes Story object and level indicators.
 * @param currLvl current level user is on.
 * @param totalLvls total number of levels.
 */
function loadStory(currLvl, totalLvls)
{
  // Instantiate Story object with known data.
  storyObj = new Story();
  storyObj.currLvl = currLvl;
  storyObj.totalLvls = totalLvls;

  // Instantiate level indicators.
  instLvlIndicators(totalLvls);

  // Load data for current level into Story object.
  loadCurrentLevel();
}

/**
 * Retrieves and applies data for current level,
 * i.e. cutscene images, maze elements' images/coordinates, instructions.
 */
function loadCurrentLevel()
{
  /**
   * Nested function to initialize Story object with retrieved level data.
   */
  function initStoryObj(data)
  {
    // Initialize maze elements, images/coords.
    // Character Image Src/Coord.
    storyObj.character.img = data.charImg;
    storyObj.character.coord = data.charCoord;
    // Boundary Image Src/Coords.
    storyObj.boundary.img = data.boundImg;
    storyObj.boundary.coords = data.boundCoords;
    // Goal Image Src/Coord.
    storyObj.goal.img = data.goalImg;
    storyObj.goal.coord = data.goalCoord;
    // Decoy Images Srcs/Coords.
    storyObj.decoy.imgs = data.decoyImgs;
    storyObj.decoy.coords = data.decoyCoords;

    // Initialize other maze components.
    // Background Image Src.
    storyObj.background = data.bckgrndImg;
    // Instructions Text.
    storyObj.instructions = data.instructions;
    // Cutscene Images Srcs.
    storyObj.cutscenes = data.cutscnImgs;
    // Append introduction cutscene images to first level's cutscene images.
    // Note: Introduction images separate from first level's cutscene images for teacher convenience when generating (preview, create/edit, etc).
    for (img of data.introCutscnImgs.reverse())
      storyObj.cutscenes.unshift(img);
    // Final Cutscene Images Srcs.
    // Allows last level to show conclusion cutscenes without separate retrieval from database.
    storyObj.finalCutscenes = data.finalCutscnImgs;
  }

  // Retrieve level data from database.
  $.post("../php/getLevelData.php", {}, function(data) {
    if (data.success)
    {
      // Level data was successfully retrieved.
      // Initialize Story object.
      initStoryObj(data.data);

      // Transition to level.
      initCutscene();
    } else
    {
      // Level data was not successfully retrieved, redirect to dashboard with error.
      var error = "Level load unsuccessful! " + data.msg;
      window.location.replace("dashboard.php?notify=" + error + "&notifyType=2");
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong, redirect to dashboard with error.
      error = "An error occurred when fetching level data: " + error;
      window.location.replace("dashboard.php?notify=" + error + "&notifyType=2");
    });
}

/**********
 * LEVELS *
 **********/
/**
 * Updates levels indicators to reflect completed and current levels.
 */
function updateLvlIndicators()
{
  var intensities = [];

  // Initialize color intensities for each level indicator.
  // Complete => 2.0, Current => 0.4, Incomplete => 0.0
  for (var i = 1; i <= storyObj.totalLvls; i++)
  {
    intensities.push(
      i < storyObj.currLvl ? 2.0 : i == storyObj.currLvl ? 0.4 : 0.0
    );
  }

  // Set levels indicators to specified color intensities.
  setLvlIndicators(intensities);
}

/**
 * Goes to next level, if one exists.
 */
function goNextLvl()
{
  // Determine if there is another level for the user to complete.
  var nextLvlExists = storyObj.totalLvls > storyObj.currLvl;

  // Increment level tracking counter.
  storyObj.currLvl++;

  // Advance to next level if one exists. If not, user completed story.
  if (nextLvlExists)
  {
    // Load data for current level into Story object.
    loadCurrentLevel();
  } else
  {
    storyObj.cutscenes = storyObj.finalCutscenes;

    initCutscene();
  }

}

/**
 * Initializes current level elements.
 */
function initCurrLvl()
{
  // Update levels indicators.
  updateLvlIndicators();

  // Reset simulation and generate next level's maze (blockly.js).
  resetSim();

  // Clear previous level's code blocks from workspace.
  workspace.clear();

  // Update instructions.
  document.getElementById("instructions").innerHTML = storyObj.instructions;
}

/************
 * CUTSCENE *
 ************/
/**
 * Sets onclick attr of cutscene button based on remaining cutscene images.
 * @param numShown number of images already shown for current cutscene.
 */
function initCutsceneBtn(numShown)
{
  var btn = document.getElementById("cutsceneBtn");

  if (storyObj.cutscenes.length > numShown)
  {
    // Other images to show in cutscene, set button to show next one.
    btn.onclick = function() {
      showNextScene(numShown);
    };
  } else
  {
    // No other images to show in cutscene. Set button to proceed to next level.
    btn.onclick = function() {
      endCutscene(numShown);
    };
  }
}

/**
 * Initial cutscene display. Slide into view cover image.
 */
function initCutscene()
{
  var screen = document.getElementById("cutsceneScreen");

  // Fade in black background.
  screen.classList = "show";

  // Show cutscene image and proceed next button if image present to show.
  // If the level has no cutscenes associated, no need to do below.
  if (storyObj.cutscenes.length > 0)
  {
    var wrapper = document.getElementById("cutsceneWrapper");
    var showingImg = document.getElementById("cutsceneImgA");
    var hiddenImg = document.getElementById("cutsceneImgB");
    var btn = document.getElementById("cutsceneBtn");

    // "Re-enable" cutscene. Initially "disabled" as it overlaps/blocks app content from user interaction.
    wrapper.style.pointerEvents = "auto";

    // Set cover as image to be shown.
    showingImg.src = storyObj.cutscenes[0];

    // Remove any animations from previous cutscenes.
    // Note: Only possible remaining animation would be slideOut.
    showingImg.classList.remove("slideOut");
    hiddenImg.classList.remove("slideOut");
    
    // Apply slide/fade in animation.
    showingImg.classList.add("slideIn");

    // Show and enable proceed to next button once cover has slid into view.
    setTimeout(function() {
      btn.classList.add("show");
      btn.disabled = false;
    }, SLIDE_IN_DUR);

    initCutsceneBtn(1);
  } else
  {
    endCutscene();
  }
}

/**
 * Show next image of cutscene.
 * @param idx index of next image to show in pageImgSrcs array.
 */
function showNextScene(idx)
{
  var imgA = document.getElementById("cutsceneImgA");
  var imgB = document.getElementById("cutsceneImgB");
  var btn = document.getElementById("cutsceneBtn");
  var prevImg, nextImg;

  // Temporarily disable while switching images. Re-enable when fade animation is complete.
  const FADE_DUR = 1000;
  btn.disabled = true;
  setTimeout(function() {
    btn.disabled = false;
  }, FADE_DUR);

  // Determine which image to show and which to hide based on opacity.
  // Opacity 0.0: Currently hidden, so show. Opacity 1.0: Currently shown, so hide.
  var imgAOpacity = window.getComputedStyle(imgA, null).getPropertyValue("opacity");
  var imgBOpacity = window.getComputedStyle(imgB, null).getPropertyValue("opacity");
  if (imgAOpacity == 1 && imgBOpacity == 0)
  {
    // imgA should be hidden and imgB should be shown.
    prevImg = imgA;
    nextImg = imgB;
  } else if (imgAOpacity == 0 && imgBOpacity == 1)
  {
    // imgA should be shown and imgB should be hidden.
    prevImg = imgB;
    nextImg = imgA;
  } else
  {
    console.error("Could not determine which cutscene image to show/hide.");
  }

  // Set next image of cutscene to be shown.
  nextImg.src = storyObj.cutscenes[idx];
  
  // Bring next image forward.
  prevImg.style.zIndex = "996";
  nextImg.style.zIndex = "997";

  // Fade out currently shown image, fade in next cutscene image.
  // Note: Animations rely on transition rather than animation due to JS inconsistencies.
  prevImg.classList.remove("slideIn", "show");
  nextImg.classList.add("show");
  
  initCutsceneBtn(idx+1);
}

/**
 * Ends cutscene. Slide out of view currently shown image. Switch levels.
 * @param numShown number of total images shown; used to either slide out imgA or imgB.
 */
function endCutscene(numShown)
{
  var screen = document.getElementById("cutsceneScreen");

  // Hide cutscene image/button if images were shown.
  // If the level has no cutscenes associated, no need to do below.
  if (numShown > 0)
  {
    var wrapper = document.getElementById("cutsceneWrapper");
    var imgA = document.getElementById("cutsceneImgA");
    var imgB = document.getElementById("cutsceneImgB");
    var currImg;
    var btn = document.getElementById("cutsceneBtn");

    // Determine if image A or image B is currently shown, and thus should slide out.
    currImg = numShown % 2 == 0 ? imgB : imgA;

    // Remove any previous animations, apply slide out animation.
    currImg.classList.remove("slideIn", "show");
    currImg.classList.add("slideOut");
    
    // Disable and hide proceed to next button indefinitely as no more images for current cutscene.
    btn.disabled = true;
    btn.classList.remove("show");

    // After cutscene complete (screen faded away and app content displayed), 
    // "disable" cutscene as it overlaps/blocks app content from user interaction.
    const SCREEN_FADE_DUR = 2000;
    setTimeout(function() {
      wrapper.style.pointerEvents = "none";
    }, SCREEN_FADE_DUR);
  }

  // Continue to level once cutscene image fades out (if images were shown)
  // or once black screen finishes fading in (if no images were shown).
  const SLIDE_FADE_DUR = 1000;
  setTimeout(function() {
    if (storyObj.currLvl <= storyObj.totalLvls)
    {
      // Initialize level elements.
      initCurrLvl();
    } else
    {
      // Now that final cutscenes have been shown, maze is complete.
      // Update levels indicators.
      updateLvlIndicators();

      // TEMPORARY
      setTimeout(function() {
        alert("USER COMPLETED STORY! SHOW POP-UP INSTEAD OF THIS.");
      }, SLIDE_FADE_DUR);
    }

    // Fade out black screen.
    screen.classList = "hide";
    
  }, SLIDE_FADE_DUR);
}