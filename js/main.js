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

/***********
 * TOOLTIP *
 ***********/
/**
 * Copies specified text to clipboard and modifies associated tooltip's text.
 * @param txtNode Tooltip text element.
 * @param copyTxt Text to copy to clipboard.
 */
function copyText(txtNode, copyTxt)
{
  if (navigator.clipboard)
  {
    // Use supported Clipboard API to copy text.
    navigator.clipboard.writeText(copyTxt).then(function() {
      // Successfully copied text.
      txtNode.innerHTML = "Copied!";
    })
      .catch(function() {
        // Failed at copying text.
        txtNode.innerHTML = "An error occurred.";
      });
  } else
  {
    // Clipboard API not supported, use deprecated commandExec() method instead.
    // Can only copy from input/textarea elements, so create temporary input to adhere to this.
    var tempInput = document.createElement("input");
    tempInput.value = copyTxt;
    document.body.appendChild(tempInput);
    // Select and copy text.
    tempInput.select();
    document.execCommand("copy");
    // Delete temporary input element.
    document.body.removeChild(tempInput);
    
    // Change text of tooltip to reflect success.
    txtNode.innerHTML = "Copied!";
  }
}
/**
 * Changes specified tooltip's text.
 * @param txtNode Tooltip text element.
 * @param newTxt Text to change tooltip to.
 */
function changeTooltipText(txtNode, newTxt)
{
  txtNode.innerHTML = newTxt;
}

/****************
 * NOTIFICATION *
 ****************/
/**
 * Shows notification with specified type and message.
 * Note: There should only be one notification instance on each page.
 * @param msg Notification's message.
 * @param type 1: success, 2: fail, (default) 0: neutral
 */
function showNotification(msg, type = 0)
{
  var notificationNode = document.querySelector(".notification");

  // Set success/fail type and message.
  // type = 1: success, 2: fail, (default) 0: neutral
  type = type == 1 ? "success"
       : type == 2 ? "fail"
       : "";
  notificationNode.classList = "notification " + type;
  notificationNode.querySelector("span.msg").innerHTML = msg;

  // Display notification element.
  notificationNode.style.pointerEvents = "all";
  notificationNode.style.opacity = 1.0;
}
/**
 * Hides displayed notification.
 * Note: There should only be one notification instance on each page.
 */
function hideNotification()
{
  var notificationNode = document.querySelector(".notification");

  // Hide notification element, and disable click to prevent blocking content.
  notificationNode.style.pointerEvents = "none";
  notificationNode.style.opacity = 0.0;
}

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

/**********
 * SEARCH *
 **********/
/**
 * Search container of elements for those matching specified search term.
 * @param term Term to search by.
 * @param container Container of elements to search.
 */
function searchElements(term, container)
{
  var elementTxt;
  var displayAttr;

  // Element's text and search term compared case-insensitive.
  term = term.toUpperCase();

  for (element of container.children)
  {
    elementTxt = element.innerHTML.toUpperCase();

    // If element matches search term, show. Otherwise, hide.
    displayAttr = elementTxt.includes(term) ? "block" : "none";
    element.style.display = displayAttr;
  }
}
/**
 * Search table for rows matching specified search term.
 * 
 * HTML Requirements:
 *   <td class="none" colspan="a" style="display:b">No students found.</td>
 * 
 * @param term Term to search by.
 * @param table Table to search.
 * @param toSearch Indicates which columns to search. Ex: [true, false] -> Search col1, not col2.
 */
function searchTable(term, table, toSearch)
{
  var rowTxt;
  var displayAttr;
  var found = false;

  // Row's text and search term compared case-insensitive.
  term = term.toUpperCase();

  // Compare each row's content to search term.
  // Ignore header row, i.e. first row.
  for (row of table.querySelectorAll("tbody tr:not(.none)"))
  {
    // To compare each row, need to compare each row's columns' content to search term.
    rowTxt = "";
    for (var i = 0; i < row.children.length; i++)
    {
      // Append column's text to cumulative row text variable that is compared to search term.
      rowTxt = toSearch[i] ? rowTxt + " " + row.children[i].textContent.toUpperCase() : rowTxt;
    }
    // Compare cumulative row text to search term. If matches, show. Otherwise, hide.
    displayAttr = rowTxt.includes(term) ? "table-row" : "none";
    row.style.display = displayAttr;

    // If row was displayed, indicate at least one result was found.
    if (displayAttr == "table-row") found = true;
  }
  
  // Display "No students found." message if no results were found.
  table.querySelector("tbody tr.none").style.display = (!found ? "table-row" : "none");
}

/*****************
 * PROGRESS RING *
 *****************/
// Global variable needed to clear previous counter.
var ringCounter;
/**
 * Initializes progress ring fill animation with percentage text.
 * @param id ID of progress ring SVG element.
 * @param percentage Amount to fill ring to.
 */
function initProgressRing(id, percentage)
{
  var ringNode = document.getElementById(id).querySelector("circle.filler");

  // Cast percentage as integer; otherwise, percentage may oscillate.
  percentage = parseInt(percentage);

  // Set progress ring to fill to specified percentage.
  var maxStrokeOffset = parseInt(
    window.getComputedStyle(ringNode).getPropertyValue("stroke-dasharray")
  );
  var strokeOffset = maxStrokeOffset - (maxStrokeOffset * (percentage / 100));
  ringNode.style.strokeDashoffset = strokeOffset

  var textNode = document.getElementById(id).querySelector("text");
  var currPercent = parseInt(textNode.innerHTML);
  var newPercent;

  // Calculate time per iteration for counter to reach new percentage in one second (duration of SVG drawing animation).
  var counterDuration = 1000 / Math.abs(percentage - currPercent);
  // Clear previous counter or it will continue counting to previous percentage.
  clearInterval(ringCounter)
  // Count from initial to new percentage.
  ringCounter = setInterval(function() {
    // Calculate and display next percentage.
    currPercent = parseInt(textNode.innerHTML);
    newPercent = currPercent > percentage ? currPercent - 1 : currPercent + 1;
    textNode.innerHTML = newPercent + "%";
    
    // Stop counter once specified percentage reached.
    if (newPercent == percentage) clearInterval(ringCounter);
  }, counterDuration);
}

/********
 * FORM *
 ********/
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
/**
 * Verifies all specified fields are filled.
 * @param fields Form fields to verify.
 * @return true if all fields are filled, false if not.
 */
function verifyFormFields(fields)
{
  // Determine if any field's value is empty.
  for (var i = 0; i < fields.length; i++)
  {
    if (fields[i].value === "") return false;
  }

  return true;
}
/**
 * Removes unintentional leading and trailing whitespace in user input.
 * @param fields all form fields, including type and value of each.
 */
function trimFormFields(fields)
{
  for (var i = 0; i < fields.length; i++)
  {
    // Trim (remove leading/trailing whitespace) from all inputs except password.
    // If <fieldset> present, trim elements within it.
    if (fields[i].tagName.toUpperCase() == "FIELDSET")
    {
      for (var j = 0; j < fields[i].elements.length; j++)
      {
        trimField(fields[i].elements[j]);
      }
    } else
    {
      trimField(fields[i]);
    }
  }

  // Verifies input is not a password and subsequently trims.
  // Note: not trimming password since leading/trailing spaces allowed.
  function trimField(field)
  {
    if (field.type.toUpperCase() != "PASSWORD")
    {
      field.value = field.value.trim();
    }
  }
}
/**
 * Displays form message.
 * @param msgNode Message display element.
 * @param msg Message to display.
 * @param type 1: success, 2: fail, (default) 0: neutral
 */
function displayFormMsg(msgNode, msg, type = 0)
{
  // Change color and text of form message.
  msgNode.classList = type == 1 ? "msg success"
                    : type == 2 ? "msg fail"
                    : "msg";
  msgNode.innerHTML = msg;
}
/**
 * Execute generic actions required by several forms:
 *   Prevent page refresh, clear form message, verify field requirements met.
 * @param e Form submission event.
 * @param fields Form fields to verify have been filled.
 * @param msgNode Form message node for notifying user of success/failure.
 * @param failMsg Generic message to display when an error occurs.
 * @return true if success, false if failure.
 */
function handleGenericForm(e, fields, msgNode, failMsg)
{
  // Prevent form from refreshing page.
  e.preventDefault();

  // Clear previous form message.
  msgNode.innerHTML = "";

  // Verify all fields were filled.
  if (!verifyFormFields(fields))
  {
    displayFormMsg(msgNode, failMsg + "<br />All required info not entered.", 2);
    return false;
  }

  return true;
}

/*********
 * LOGIN *
 *********/
/**
 * Verify/format fields of student/teacher login form and authenticate.
 * @param e Form submission event.
 * @param formObj Object of student/teacher login form.
 * @param type Deciphers if student (0) or teacher (1) is logging in.
 */
function loginUser(e, formObj, type)
{
  const FAIL_MSG = "Login unsuccessful!";
  var msgNode    = formObj.querySelector("p.msg");

  // Execute generic form actions. Stop login process if false is returned.
  if (!handleGenericForm(e, formObj.elements, msgNode, FAIL_MSG)) return;

  // Determine "action" path based on if student or teacher login.
  var actionPath = type == 0 ? "../php/loginStudent.php"
                 : type == 1 ? "../php/loginTeacher.php"
                 : "";
  // Prepare form data for passing by removing leading/trailing whitespace and serializing.
  trimFormFields(formObj.elements);
  var formData = $(formObj).serialize();

  // Try logging in user with input information.
  $.post(actionPath, formData, function(data) {
    // Output login success/fail message (with returned detailed message).
    if (data.success)
    {
      // Login was successful.
      displayFormMsg(msgNode, "Login successful!<br />" + data.msg, 1);
      if (data.msg == "")
      {
        // Teacher only: temporary password used, so must set new password; display form.
        switchFormTabs("teacherForm","pwdForm");
      } else
      {
        // Redirect to dashboard with delay so user can view success msg.
        setTimeout(function() {
          window.location.href = "dashboard.php";
        }, 1000);
      }
    } else
    {
      // Login was unsuccessful.
      displayFormMsg(msgNode, FAIL_MSG + "<br />" + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      displayFormMsg(msgNode, FAIL_MSG + "<br />Please try again later.", 2);
    });
}
/**
 * Verify fields of password form and save new password.
 * Note: Temporary password given to teachers upon registration, and must be changed upon first login.
 * @param e Form submission event.
 * @param formObj Object of password form.
 */
function setPassword(e, formObj)
{
  const FAIL_MSG = "Password change unsuccessful!";
  var msgNode    = formObj.querySelector("p.msg");

  // Execute generic form actions. Stop pwd change process if false is returned.
  if (!handleGenericForm(e, formObj.elements, msgNode, FAIL_MSG)) return;

  // Verify passwords match.
  if (formObj.elements["newPwd"].value != formObj.elements["rePwd"].value)
  {
    displayFormMsg(msgNode, FAIL_MSG + "<br />Passwords do not match.", 2);
    return;
  }

  // Previous checks passed, so remove temporary password and save new password.
  $.post("../php/setPassword.php", $(formObj).serialize(), function(data) {
    if (data.success)
    {
      // Password change was successful.
      displayFormMsg(msgNode, "Password change successful!<br />" + data.msg, 1);

      // Redirect to dashboard with delay so user can view success msg.
      setTimeout(function() {
        window.location.href = "dashboard.php";
      }, 1000);
    } else
    {
      // Password change was unsuccessful.
      displayFormMsg(msgNode, FAIL_MSG + "<br />" + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      displayFormMsg(msgNode, FAIL_MSG + "<br />Please try again later.", 2);
    });
}

/***********
 * CLASSES *
 ***********/
/**
 * Create a class with specified name.
 * @param e Form submission event.
 * @param formObj Object of "Create a Class" form.
 */
function createClass(e, formObj)
{
  const FAIL_MSG = "Creation unsuccessful!";
  var msgNode    = formObj.querySelector("p.msg");

  // Execute generic form actions. Stop edit process if false is returned.
  if (!handleGenericForm(e, [formObj.elements["name"]], msgNode, FAIL_MSG)) return;

  // Prepare form data for passing by removing leading/trailing whitespace and serializing.
  trimFormFields(formObj.elements);
  var formData = $(formObj).serialize();

  // Create class.
  $.post("../php/createClass.php", formData, function(data) {
    if (data.success)
    {
      // Notify class creation was successful.
      displayFormMsg(msgNode, "Class has been successfully created!", 1);

      // Redirect to newly created class with delay so user can view success msg.
      setTimeout(function() {
        window.location.href = "class.php?id=" + data.classID + "&name=" + data.className;
      }, 1500);
    } else
    {
      // Creation was unsuccessful.
      displayFormMsg(msgNode, FAIL_MSG + "<br />" + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Close "Create a Class" modal.
      closeModal(document.querySelector('.modal.show'));
      // Something unexpected went wrong.
      showNotification("An error occurred when creating the class: " + error, 2);
    });
}
/**
 * Instantiates specified number of levels completion indicators.
 * @param count Number of indicators to instantiate.
 */
function instLvlIndicators(count)
{
  // Clear previous levels indicators.
  document.querySelector(".levelsContainer").innerHTML = "";

  // Instantiate new levels indicators.
  var node;
  for (var i = 1; i <= count; i++)
  {
    // Create level indicator node.
    // Format: <div class="level">X</div>
    node = document.createElement("div");
    node.classList.add("level");
    node.innerHTML = i;

    // Append to levels indicators container.
    document.querySelector(".levelsContainer").appendChild(node);
  }
}
/**
 * Sets color of level completion indicators. Supports cumulative and individual data.
 * @param intensities Array of color saturation intensities (0.0 to 2.0) for each level indicator.
 */
function setLvlIndicators(intensities)
{
  var r, g, b;

  var levelsNodes = document.querySelector(".levelsContainer").children;

  // Calculate and set rgb values for each level indicator based on corresponding specified intensity.
  for (var i = 0; i < levelsNodes.length; i++)
  {
    // Set rgb values based on which side of spectrum intensity resides on.
    // Intensity ranges from 0.0 to 2.0,
    // 0.0: No students completed, 1.0: 50/50, 2.0: All students completed.
    if (intensities[i] >= 1.0)
    {
      // Majority (or half) completed level, set green (or neutral) color.
      // Note: Neutral color is light gray instead of white since text is white.
      // Note: rb ranges from 50 to 205.
      g = 205;
      r = b = ((2.0 - intensities[i]) * 155) + 50;
    } else
    {
      // Majority not completed level, set red color.
      // Note: gb ranges from 50 to 255.
      r = 255;
      g = b = ((intensities[i]) * 205) + 50;
    }
    
    levelsNodes[i].style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
  }
}
/**
 * Initializes and displays levels progression via progress ring and levels indicators.
 * @param progress Array of maze progression: [0] => ring percentage, [1...n] => level indicator intensities.
 */
function displayProgress(progress)
{
  // Set progress ring to specified percentage.
  initProgressRing('progressRing', progress[0]);
  // Remove percentage from progress array to pass rest to setLvlIndicators(x);
  progress.shift();

  // Set levels indicators to specified intensities.
  setLvlIndicators(progress);
}
/**
 * Sets status text and button based on if maze specifieed as assigned or not assigned.
 * @param isAssigned true if maze assigned, false if not assigned.
 */
function displayMazeAssignment(isAssigned)
{
  var mazeInfoContainer  = document.getElementById("mazeInfo");

  var statusTxtNode = mazeInfoContainer.querySelector("p span");
  statusTxtNode.style.color = isAssigned? "#32CD32" : "#FF3131";
  statusTxtNode.innerHTML   = isAssigned ? "Assigned" : "Not Assigned";

  mazeInfoContainer.querySelector("button").innerHTML   = isAssigned ? "Unassign" : "Assign";
}
/**
 * Toggles assignment of specified maze.
 * @param mazeID ID of selected maze.
 */
function toggleMazeAssignment(mazeID)
{
  $.post("../php/toggleAssignment.php", { id: mazeID }, function(data) {
    if (data.success)
    {
      // Maze assignment toggle was successful. Notify user.
      showNotification(data.msg, 1);
      // Update assignment status text/button.
      displayMazeAssignment(data.assigned);
    } else
    {
      // Maze assignment toggle was unsuccessful.
      showNotification("Assignment toggle unsuccessful! " + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      showNotification("An error occurred when toggling maze assignment: " + error, 2);
    });
}
/**
 * Retrieves, prepares, and displays specified maze's analytics.
 * @param mazeID ID of selected maze.
 */
function showMazeAnalytics(mazeID)
{
  /**
   * Nested function to display analytics elements if not already shown.
   */
  function showElements()
  {
    if (
      window.getComputedStyle(
        mazeInfoContainer.querySelector("p")
      )
        .getPropertyValue("display") == "none"
    )
    {
      // Remove encapsulating border.
      var container = document.querySelector("div.mazesContainer");
      container.style.border = "none";
      container.style.clipPath = "none";
      // Show maze assignment status text and button.
      mazeInfoContainer.querySelector("p").style.display      = "block";
      mazeInfoContainer.querySelector("button").style.display = "block";
      // Show student selection and progress analytics containers.
      studentsContainer.style.display  = "flex";
      analyticsContainer.style.display = "flex";
    }
  }

  var mazeInfoContainer  = document.getElementById("mazeInfo");
  var studentsContainer  = document.getElementById("studentSelect");
  var analyticsContainer = document.getElementById("analytics");

  // Display front-end components if not already displayed.
  showElements();

  // Retrieve maze information from database and append to appropriate elements.
  $.post("../php/getMazeAnalytics.php", { id: mazeID }, function(data) {
    if (data.success)
    {
      // Maze analytics selection was successful.
      // Display maze information.
      mazeInfoContainer.querySelector("h1").innerHTML = data.mazeInfo.title;
      mazeInfoContainer.querySelector("h2").innerHTML = "By " + data.mazeInfo.author;
      // Set assignment status text/button.
      displayMazeAssignment(data.mazeInfo.assigned);
      mazeInfoContainer.querySelector("button").onclick = function() { toggleMazeAssignment(mazeID); };

      // Instantiate levels indicators elements.
      instLvlIndicators(data.mazeProgress.length-1);
      // Display cumulative levels progression (by default).
      displayProgress(data.mazeProgress);
    } else
    {
      // Maze analytics selection was unsuccessful.
      showNotification("Selection unsuccessful! " + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      showNotification("An error occurred when fetching maze analytics: " + error, 2);
    });
}
/**
 * Displays specified student's progress on currently selected maze.
 * Also displays cumulative progress if studentID passed as 0.
 * @param studentID ID of student to get progress on. Pass 0 for cumulative.
 */
function getStudentProgress(studentID)
{
  // Get currently selected maze via <select> input.
  var mazeID = document.getElementById("mazeInfo").querySelector("select").value;
  
  // Retrieve student's progress from database and append to appropriate elements.
  $.post("../php/getStdntProgress.php", { studentID: studentID, mazeID: mazeID }, function(data) {
    if (data.success)
    {
      // Display retrieved levels progression, either student or cumulative as defined by studentID.
      displayProgress(data.progress);
    } else
    {
      // Student progression selection was unsuccessful.
      showNotification("Selection unsuccessful! " + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      showNotification("An error occurred when fetching student progression: " + error, 2);
    });
}
/**
 * Extract students' first and last names in individualized form from a list of students.
 * @param list List of students to parse.
 */
function parseStudents(list)
{
  const STUDENT_SEPARATOR = "/";
  const NAME_SEPARATOR = ", ";

  var students = [];
  var studentNode;

  var containerNode = document.querySelector(".foundContainer");
  containerNode.innerHTML = "";

  // Separate students' full names from list.
  var names = list.split(STUDENT_SEPARATOR);
  names.forEach(function(studentName) {
    // Separate student's first and last name from full name string.
    studentName = studentName.split(NAME_SEPARATOR);
    // Verify name is valid, i.e. only contains a first and last name, both of which are initialized.
    if (
      studentName.length == 2 &&
      studentName[0] != "" && studentName[1] != ""
    )
    {
      // Parsed name is valid, add to students array.
      // Trim strings as line breaks will cause "onclick" errors for Edit/Delete buttons.
      // Note: studentName = ["lastName","firstName"].
      students.push(
        { fName: studentName[1].trim(), lName: studentName[0].trim() }
      );
      
      // Display student's name under "Found Students" to notify user of their correct formatting.
      studentNode = document.createElement("div");
      studentNode.innerHTML = studentName[1] + " " + studentName[0];
      containerNode.appendChild(studentNode);
    }
  });

  // Display if no student names were parsed successfully, either by formatting error or no input.
  containerNode.innerHTML = students.length == 0 ? "No students found."
                          : containerNode.innerHTML;
      
  // Return array of parsed students for adding to database.
  return students;
}
/**
 * Gets all students of current class, as defined by $_SESSION['classID'].
 * Formats in row form for "Manage Students" table and button form for "Levels Progression" student selection.
 */
function getStudents()
{
  $.post("../php/getStudents.php", {}, function(data) {
    // "Manage Students" Table Rows
    document.querySelector("div.studentsContainer table tbody").innerHTML = data.rows;
    // "Levels Progression" Student Selection Buttons
    document.querySelector("div.mazesContainer section#studentSelect div").innerHTML = data.btns;
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      showNotification("An error occurred when fetching students: " + error, 2);
    });
}
/**
 * Add students, via first and last name, to class in database.
 */
function addStudents()
{
  var modalBodyNode = document.querySelector("#addModal div.body");
  var textareaNode  = modalBodyNode.querySelector("textarea");
  var msgNode       = modalBodyNode.querySelector("p.msg");

  // Parse out array of students, each element with first and last name, from textarea.
  var students = parseStudents(
    textareaNode.value
  );

  // Verify there are students to add.
  if (students.length == 0)
  {
    displayFormMsg(msgNode, "No students to add were found.\nPlease verify your formatting and try again.", 2);
    return;
  }

  // Add found students to database.
  $.post("../php/addStudents.php", { students: students }, function(data) {
    // Addition of students was successful.
    // Show success notification.
    showNotification("Student(s) was successfully added to this class!", 1);
  })
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      showNotification("An error occurred when adding students: " + error, 2);
    })
    .always(function() {
      // Perform actions below for error too in case error occurred after students added.
      // Clear any previous message.
      msgNode.innerHTML = '';
      // Reset textarea/found list to allow adding more students/prevent adding same students.
      textareaNode.value = '';
      modalBodyNode.querySelector(".foundContainer").innerHTML = 'No students found.';
      // Reload students' information on page.
      getStudents();
      // Close add student(s) modal.
      closeModal(document.querySelector('.modal.show'));
    });
}
/**
 * Initializes data and displays edit student modal.
 * @param id Student's ID number.
 * @param fName Student's first name.
 * @param lName Student's last name.
 * @param birthday Student's birthday, formatted "YYYY-MM-DD".
 */
function displayEditStudent(id, fName, lName, birthday)
{
  var formObj = document.querySelector("#editStudentForm");

  // Clear previous form message.
  formObj.querySelector("p.msg").innerHTML = "";

  // Pre-fill fields with student info.
  formObj.elements["id"].value       = id;
  formObj.elements["fName"].value    = fName;
  formObj.elements["lName"].value    = lName;
  formObj.elements["birthday"].value = birthday;

  // Open edit student modal.
  openModal("editModal");
}
/**
 * Edit student information in database.
 * @param e Form submission event.
 * @param formObj Object of edit student form.
 */
function editStudent(e, formObj)
{
  const FAIL_MSG = "Edit unsuccessful!";
  var msgNode    = formObj.querySelector("p.msg");

  // Note: Birthday field may be unset as it is automatically set on student login,
  // thus it is not a required field.
  var fieldsToVerify = [
    formObj.elements["id"],
    formObj.elements["fName"],
    formObj.elements["lName"]
  ];

  // Execute generic form actions. Stop edit process if false is returned.
  if (!handleGenericForm(e, fieldsToVerify, msgNode, FAIL_MSG)) return;

  // Prepare form data for passing by removing leading/trailing whitespace and serializing.
  trimFormFields(formObj.elements);
  var formData = $(formObj).serialize();

  // Edit student information.
  $.post("../php/editStudent.php", formData, function(data) {
    if (data.success)
    {
      // Notify user edit was successful.
      displayFormMsg(msgNode, "Student information has been successfully edited!", 1);

      // Reload students' information on page.
      getStudents();
    } else
    {
      // Edit was unsuccessful.
      displayFormMsg(msgNode, FAIL_MSG + "<br />" + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Close edit student modal.
      closeModal(document.querySelector('.modal.show'));
      // Something unexpected went wrong.
      showNotification("An error occurred when editing student: " + error, 2);
    });
}
/**
 * Initializes data and displays delete student confirmation modal.
 * @param id Student's ID number.
 * @param name Student's first and last name.
 */
function displayDelStudent(id, name)
{
  var modalNode = document.getElementById("delModal");

  // Set confirmation message with student's full name.
  modalNode.querySelector("div.body p").innerHTML =
    "Are you sure you want to delete <span>" + name + "</span> from this class?";

  // Set "Confirm" button to delete student with passed id.
  // Must use function() { deleteStudent() }
  modalNode.querySelector("footer button:nth-of-type(2)").onclick = function() { deleteStudent(id); };
 
   // Open delete student modal.
   openModal("delModal");
 }
/**
 * Delete student from class in database.
 * @param id Student's ID number.
 */
function deleteStudent(id)
{
  $.post("../php/deleteStudent.php", { id: id }, function(data) {
    if (data.success)
    {
      // Deletion was successful. Notify user.
      showNotification("Student was successfully deleted from this class!", 1);
      // Reload students' information on page.
      getStudents();
    } else
    {
      // Deletion was unsuccessful. Notify user.
      showNotification("Student deletion unsuccessful! " + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      showNotification("An error occurred when deleting student: " + error, 2);
    })
    .always(function() {
      // Close delete student modal in all outcomes.
      closeModal(document.querySelector('.modal.show'));
    });
}