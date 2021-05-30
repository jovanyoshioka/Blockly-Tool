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
        txtNode.innerHTML = "An error occured.";
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
 * @param term Term to search by.
 * @param table Table to search.
 * @param toSearch Indicates which columns to search. Ex: [true, false] -> Search col1, not col2.
 */
function searchTable(term, table, toSearch)
{
  var rowTxt;
  var displayAttr;

  // Row's text and search term compared case-insensitive.
  term = term.toUpperCase();

  // Compare each row's content to search term.
  // Ignore header row, i.e. first row.
  for (row of table.querySelectorAll("tr:not(:first-of-type)"))
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
  }
}

/*****************
 * PROGRESS RING *
 *****************/
/**
 * Initializes progress ring fill animation with percentage text.
 * @param id ID of progress ring SVG element.
 * @param percentage Amount to fill ring to.
 */
function initProgressRing(id, percentage)
{
  var ringNode = document.getElementById(id).querySelector("circle.filler");

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
  // Count from initial to new percentage.
  var counter = setInterval(function() {
    // Calculate and display next percentage.
    currPercent = parseInt(textNode.innerHTML);
    newPercent = currPercent > percentage ? currPercent - 1 : currPercent + 1;
    textNode.innerHTML = newPercent + "%";
    
    // Stop counter once specified percentage reached.
    if (newPercent == percentage) clearInterval(counter);
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
 * @param type 1: success, 2: fail, (default) 0: neutral
 * @param msg Message to display.
 */
function displayFormMsg(msgNode, msg, type = 0)
{
  // Change color and text of form message.
  msgNode.classList = type == 1 ? "msg success"
                    : type == 2 ? "msg fail"
                    : "msg";
  msgNode.innerHTML = msg;
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
  // Prevent form from refreshing page.
  e.preventDefault();

  var msgNode = formObj.querySelector("p.msg");
  // Clear previous login message.
  msgNode.innerHTML = "";

  // Verify all fields were filled.
  if (!verifyFormFields(formObj.elements))
  {
    displayFormMsg(msgNode, "Login unsuccessful!<br />All required info not entered.", 2);
    return;
  }

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
      displayFormMsg(msgNode, "Login unsuccessful!<br />" + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      displayFormMsg(msgNode, "Login unsuccessful!<br />Please try again later.", 2);
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
  // Prevent form from refreshing page.
  e.preventDefault();

  var msgNode = formObj.querySelector("p.msg");

  // Verify all fields were filled.
  if (!verifyFormFields(formObj.elements))
  {
    displayFormMsg(msgNode, "Password change unsuccessful!<br />All required info not entered.", 2);
    return;
  }

  // Verify passwords match.
  if (formObj.elements["newPwd"].value != formObj.elements["rePwd"].value)
  {
    displayFormMsg(msgNode, "Password change unsuccessful!<br />Passwords do not match.", 2);
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
      displayFormMsg(msgNode, "Password change unsuccessful!<br />" + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      // Something unexpected went wrong.
      displayFormMsg(msgNode, "Password change unsuccessful!<br />Please try again later." + error, 2);
    });
}

/***********
 * CLASSES *
 ***********/
/**
 * Sets color of level completion indicators. Supports cumulative and individual data.
 * @param intensities Array of color saturation intensities (0.0 to 2.0) for each level indicator.
 */
function setProgressColors(intensities)
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
      // Note: studentName = ["lastName","firstName"].
      students.push(
        { fName: studentName[1], lName: studentName[0] }
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
}