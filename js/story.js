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
  constructor(title)
  {
    this.title = title;

    this.charImgSrc = "assets/" + this.title + "/character.png";
    this.boundImgSrc = "assets/" + this.title + "/boundary.png";

    // Initialize at 0 for initial cutscene.
    this.currLevel = 0;

    this.levels = getLvlsData(this.title);
    
  }
}

function loadStory(title)
{
  storyObj = new Story(title);

  // Instantiate level indicators after content is no longer visible (hidden by cutscene).
  setTimeout(function() {
    initLvlsIndis();
  }, SLIDE_IN_DUR);

  // Show initial cutscene with cover and introduction.
  initCutscene();
}

/**********
 * LEVELS *
 **********/
/**
 * Gets specified story's levels data and formats it into an array.
 * @param title story of which to load levels in formatted array.
 * @returns formatted array of levels data (goal, grid size, pages).
 */
function getLvlsData(title)
{
  var story = STORIES_DATA.find(element => element.title == title);
  var pages = [];
  var levels = [];

  // Loop through each level and format data.
  // Also format data for cover/intro cutscene pages, i.e. index 0.
  for (var i = 0; i <= story.numLevels; i++)
  {
    pages = [];
    // Loop through each page of current level and format source.
    for (var j = 1; j <= story.pages[i]; j++)
    {
      // Page Image Format: "pages_[level]_[pageNum].jpg"
      pages.push("assets/" + title + "/page_" + i + "_" + j + ".jpg");
    }
    
    // Compile level's data into array.
    // Goal Image Format: "goal_[level].jpg"
    if (i == 0)
    {
      // Cover/Intro Cutscene: only pages.
      levels.push({
        pageImgSrcs: pages
      });
    } else
    {
      levels.push({
        goalImgSrc: "assets/" + title + "/goal_" + i + ".png",
        pageImgSrcs: pages
      });
    }
  }

  return levels;
}

/**
 * Instantiates levels indicators, i.e. buttons above workspace showing levels progression.
 */
function initLvlsIndis()
{
  var lvlsContainer = document.getElementById("levelsContainer");

  // Verify no levels present from previously loaded stories by removing container content.
  lvlsContainer.innerHTML = "";

  // Instantiate number of level indicators as levels present.
  var btnNode, textNode;
  for (var i = 1; i < storyObj.levels.length; i++)
  {
    btnNode = document.createElement("BUTTON");
    textNode = document.createTextNode(i);
    btnNode.appendChild(textNode);
    btnNode.disabled = true;
    lvlsContainer.appendChild(btnNode);
  }
}

/**
 * Updates levels indicators to reflect completed and current levels.
 */
function updateLvlsIndis(nextLvlExists)
{
  var lvlsContainer = document.getElementById("levelsContainer");

  // Change level indicator for completed level to completed color.
  if (storyObj.currLevel != 0)
  {
    lvlsContainer.children[storyObj.currLevel-1].classList.add("complete");
  }

  // Switch active level indicator to next level, if one exists.
  if (nextLvlExists)
  {
    if (storyObj.currLevel != 0)
    {
      lvlsContainer.children[storyObj.currLevel-1].classList.remove("active");
    }
    lvlsContainer.children[storyObj.currLevel].classList.add("active");
  }
}

/**
 * Prepares and proceeds to next level, if one exists.
 */
function goNextLvl()
{
  // Determine if there is another level for the user to complete.
  var nextLvlExists = storyObj.levels.length-1 > storyObj.currLevel;

  // Update levels indicators.
  updateLvlsIndis(nextLvlExists);

  // Advance to next level if one exists. If not, user completed story.
  if (nextLvlExists)
  {
    // Increment level tracking counter.
    storyObj.currLevel++;

    // Reset simulation and generate next level's maze (blockly.js).
    resetSim();

    // Clear previous level's code blocks from workspace.
    workspace.clear();
  } else
  {
    // TEMPORARY
    setTimeout(function() {
      alert("USER COMPLETED STORY! GO BACK TO STORY SELECTOR OR LOBBY?");
    }, SLIDE_IN_DUR);
  }
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

  if (storyObj.levels[storyObj.currLevel].pageImgSrcs.length > numShown)
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
  var wrapper = document.getElementById("cutsceneWrapper");
  var screen = document.getElementById("cutsceneScreen");
  var showingImg = document.getElementById("cutsceneImgA");
  var hiddenImg = document.getElementById("cutsceneImgB");
  var btn = document.getElementById("cutsceneBtn");

  // "Re-enable" cutscene. Initially "disabled" as it overlaps/blocks app content from user interaction.
  wrapper.style.pointerEvents = "auto";

  // Set cover as image to be shown.
  showingImg.src = storyObj.levels[storyObj.currLevel].pageImgSrcs[0];

  // Fade in black background.
  screen.classList.add("show");

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
  nextImg.src = storyObj.levels[storyObj.currLevel].pageImgSrcs[idx];
  
  // Bring next image forward.
  prevImg.style.zIndex = "997";
  nextImg.style.zIndex = "998";

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
  var wrapper = document.getElementById("cutsceneWrapper");
  var screen = document.getElementById("cutsceneScreen");
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

  // Fade out black screen after image slides out of view.
  const SLIDE_FADE_DUR = 750;
  setTimeout(function() {
    screen.classList.remove("show");
  }, SLIDE_FADE_DUR);

  // After cutscene complete (screen faded away and app content displayed), 
  // "disable" cutscene as it overlaps/blocks app content from user interaction.
  const SCREEN_FADE_DUR = 1750;
  setTimeout(function() {
    wrapper.style.pointerEvents = "none";
  }, SCREEN_FADE_DUR);

  goNextLvl();
}