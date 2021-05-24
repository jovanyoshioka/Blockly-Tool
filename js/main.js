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
      displayFormMsg(msgNode, "Login successful!<br />Redirecting you momentarily.", 1);
      // Login was successful, redirect to dashboard with delay so user can view success msg.
      setTimeout(function() {
        window.location.href = "dashboard.php";
      }, 1000);
    }
    else
    {
      displayFormMsg(msgNode, "Login unsuccessful!<br />" + data.msg, 2);
    }
  }, "json")
    .fail(function(jqXHR, status, error) {
      displayFormMsg(msgNode, "Login unsuccessful!<br />Please try again later.", 2);
    });
}
/**
 * Verify fields of set password form and authenticate.
 */
function setPassword()
{
  
}