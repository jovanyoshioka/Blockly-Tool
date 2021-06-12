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
  
  // Slide up (and show) corresponding form after button expansion animation is complete.
  var formContainer = document.getElementById(btnNode.id + "Form");
  formContainer.style.display = "block";
  setTimeout(function() {
    formContainer.style.transform = "none";
  }, 750);
}

/**
 * Gets total number of stories and displays five based on current "page" of table.
 * @param page Number of table specifying which five stories to display.
 * @param search Term used to find specific title, author, or uploader. Default: ""
 */
function displayStories(page, search = "")
{
  $.post("../php/getStoriesTable.php", { page: page, search: search }, function(data) {
    // Show specified page of stories in table.
    document.querySelector("table#stories tbody").innerHTML = data.table;

    // Update table navigation buttons.
    document.getElementById("tableNav").innerHTML = data.nav;
  }, "json")
    .fail(function(jqXHR, status, error) {
      alert("An error occured when fetching stories: " + error);
    });
}

/**
 * Handles search bar user interaction: pressing enter & backspacing, i.e. deleting contents.
 * @param e Event of input-user interaction.
 * @param inputNode Search bar DOM input object.
 */
function handleSearch(e, inputNode)
{
  if (e.type === "keydown" && e.keyCode === 13)
  {
    // Enter key (13) pressed while in search box, so execute search.
    displayStories(1,inputNode.value);
  } else if (e.type === "keyup" && inputNode.value.length == 0)
  {
    // Search bar was cleared, so revert to displaying all published stories.
    displayStories(1);
  }
  // Ignore all other events.
}

/**
 * When user selects a story from table of pre-existing stories, show/hide appropriate elements and tag selected story.
 * @param selectedNode Element to be tagged as selected.
 */
function selectStory(selectedNode, storyID)
{
  // Tag selected story (table row) as selected for when maze is to be generated.
  selectedNode.classList.add("selectedStory");

  // Hide all table rows (i.e. stories) except table header (i.e. title, author, uploader) and selected story table row.
  var notSelectedNodes = document.querySelector("table#stories tbody").querySelectorAll("tr:not(.selectedStory)");
  for (var i = 0; i < notSelectedNodes.length; i++)
  {
    notSelectedNodes[i].style.display = "none";
  }

  // Hide all elements that should be hidden when story is selected, except other stories as they are already hidden above.
  var elementsToHide = document.querySelectorAll(".hideWhenSelected");
  for (var i = 0; i < elementsToHide.length; i++)
  {
    elementsToHide[i].style.display = "none";
  }

  // Show all elements that should be shown when story is selected.
  document.querySelectorAll(".showWhenSelected").forEach(element => {
    if (element.tagName == "TD")
    {
      // Element to be shown is a table cell, i.e. requires special display.
      element.style.display = "table-cell";
    } else
    {
      // Element not a table-cell, so no special display needed.
      element.style.display = "block";
    }
  });
}

/**
 * If user unselects a story, revert to initial form view with table of pre-existing stories, and untag selected story.
 */
function unselectStory()
{
  // Untag selected story (table row).
  document.querySelector(".selectedStory").classList.remove("selectedStory");

  // Hide all elements that were shown when story was selected.
  var elementsToHide = document.querySelectorAll(".showWhenSelected");
  for (var i = 0; i < elementsToHide.length; i++)
  {
    elementsToHide[i].style.display = "none";
  }

  // Show stories (table rows) that were not selected.
  var tableRows = document.getElementById("stories").querySelectorAll("tr");
  for (var i = 0; i < tableRows.length; i++)
  {
    tableRows[i].style.display = "table-row";
  }

  // Show all elements that were hidden when story was selected, except other stories as they are already shown above.
  document.querySelectorAll(".hideWhenSelected").forEach(element => {
    if (element.tagName == "TD")
    {
      // Element to be shown is a table cell, i.e. requires special display.
      element.style.display = "table-cell";
    } else
    {
      // Element not a table cell, so no special display needed.
      element.style.display = "block";
    }
  });
}

/**
 * Gets content, e.g. images and instructions, associated with specified story. Appends to #previewModal.
 * @param storyID ID of story of which to retrieve content from.
 * @param title Title of story.
 */
function previewStory(storyID, title)
{
  $.post("../php/getStoryPreview.php", { storyID: storyID }, function(data) {
    // Set header of preview modal to specified title.
    document.querySelector("#previewModal header h1").innerHTML = title + " Preview";

    // Add formatted story content to preview modal.
    document.querySelector("#previewModal div.body").innerHTML = data;
  })
    .fail(function(jqXHR, status, error) {
      alert("An error occured when fetching the story's data: " + error);
    });

  openModal("previewModal");
}

/**
 * Gets content, e.g. images and instructions, associated with specified story and displays in an editable fashion. Appends to #editModal.
 * @param storyID ID of story of which to retrieve content from.
 */
function displayStoryEditor(storyID)
{
  $.post("../php/getStoryEditor.php", { storyID: storyID }, function(data) {
    alert(data);
  })
    .fail(function(jqXHR, status, error) {
      alert("An error occured when fetching the story's data: " + error);
    });
}

/**
 * Generates mazes for all levels with specified attributes.
 * @formObj Form of which to retrieve maze attributes from.
 */
function generateMaze(formObj)
{
  var includeDecoys = formObj.elements["decoyToggle"].checked;
  var difficulty = formObj.elements["difficulty"].value;
}