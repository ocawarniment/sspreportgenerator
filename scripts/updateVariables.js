// shortcut for local storage
var storage = chrome.storage.local;

// function to format dates to mmddyyyy
function formatDate(date, delim) {
	if (delim == null) { delim = "" }
	var dateObj = new Date(date);
	var day = dateObj.getDate()+1;
	if (day < 10) {
		day = "0" + day.toString();
	} else {
		day = day.toString();
	}
	var month = dateObj.getMonth()+1;
	if (month < 10) {
		month = "0" + month.toString();
	} else {
		month = month.toString();
	}
	var year = dateObj.getFullYear();
	var formattedDate = month + delim + day + delim + year;
	return formattedDate;
}

// Turn on overlay
document.getElementById("overlay").style.display = "block";

// Setup warning message for close
window.onbeforeunload = function(evt) {
	return "You have unsaved changes!";
 };
 
// status booleans
var plpDone = false;
var cohortDone = false;
var gradebookDone = false;
var truancyDone = false;
var killTime = false;

// kill switch
function killswitch() {
	alert("Student ID not found.");
	// Setup warning message for close
	window.onbeforeunload = function(evt) { };
	window.close();
};

function loadVariables() {

	// set default date to today
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	var today = year + "-" + month + "-" + day;
	document.getElementById('currentMeetingDate').defaultValue = today;
	
	// update student name
	chrome.storage.local.get('studentName', function (result) {
		document.getElementById('studentName').innerText = result.studentName;
	});
	
	// update CT name
	chrome.storage.local.get('caretakerName', function (result) {
		document.getElementById('caretakerName').innerText = result.caretakerName;
	});
	
	// update current grade
	chrome.storage.local.get('currentGrade', function (result) {
		document.getElementById('currentGrade').innerText = result.currentGrade;
	});
	
	// start year
	chrome.storage.local.get('startYear', function (result) {
		document.getElementById('startYear').innerText = result.startYear;
	});
	
	// cohort year
	chrome.storage.local.get('cohortYear', function (result) {
		document.getElementById('cohortYear').innerText = result.cohortYear;
	});
	
	// HS credits
	chrome.storage.local.get('credits', function (result) {
		document.getElementById('credits').innerText = result.credits;
	});
	
	// contact numbers
	chrome.storage.local.get('contactNumbers', function (result) {
		document.getElementById('contactNumbers').innerText = result.contactNumbers;
	});
	
	// section gradebook
	chrome.storage.local.get('gradebook', function (result) {
		document.getElementById('gradebook').innerHTML = result.gradebook;
	});
	
	// overdue lessons
	chrome.storage.local.get('overdueLessons', function (result) {
		document.getElementById('overdueLessons').innerHTML = result.overdueLessons;
	});
	
	// last lesson
	chrome.storage.local.get('lastLesson', function (result) {
		document.getElementById('lastLesson').innerHTML = result.lastLesson;
	});
	
	// last assessment
	chrome.storage.local.get(null, function (result) {
		document.getElementById('lastAssessment').innerHTML = result.lastAssessment;
	});
	
	// post graduation plans
	chrome.storage.local.get(null, function (result) {
		document.getElementById('postGradPlans').innerHTML = result.postGradPlans;
	});
	
	// days absent
	chrome.storage.local.get(null, function (result) {
		document.getElementById('daysAbsent').innerHTML = result.daysAbsent;
	});
	
	// missing hours
	chrome.storage.local.get(null, function (result) {
		document.getElementById('missingHours').innerHTML = result.missingHours;
	});
	
	// strengthsPLP
	chrome.storage.local.get(null, function (result) {
		document.getElementById('strengthsPLP').innerHTML = result.strengthsPLP;
	});
	
	// goalsPLP
	chrome.storage.local.get(null, function (result) {
		document.getElementById('goalsPLP').innerHTML = result.goalsPLP;
	});
	
	// interestsPLP
	chrome.storage.local.get(null, function (result) {
		document.getElementById('interestsPLP').innerHTML = result.interestsPLP;
	});
	
	// wait then copy the headers
	setTimeout(function() {
		// copy header 1 to page 2
		var headerTablePageOne = document.getElementById("headerTable").lastChild;
		var headerTablePageTwo = headerTablePageOne.cloneNode(true);
		document.getElementById("headerTableTwo").appendChild(headerTablePageTwo);
	}, 500);

	// add the function to the buttons
	var initialBox = document.getElementById('initialBox');
	var reviewBox = document.getElementById('reviewBox');
	var finalBox = document.getElementById('finalBox');
	initialBox.onclick = function() {updateMeeting(this);};
	reviewBox.onclick = function() {updateMeeting(this);};
	finalBox.onclick = function() {updateMeeting(this);};

	// Turn off the overlay
	setTimeout(function() {
		// turn off overlay
		document.getElementById("overlay").style.display = "none";
	}, 500);
	
	// Set title with student ID
	chrome.storage.local.get(null, function (result) {
		document.title = "SSP_" + result.studentID;
	});
	
	document.getElementById('saveButton').onclick = storeReport;
	
	alert("REMINDER: Only run one report at a time. Once you have entered all of the information, print the page as a PDF and save it. If you close the window without saving it as a PDF, everything will be lost!");
};
	
///// fuction for adapting report based on meeting
function updateMeeting(box) {
	// collect all the check boxes
	var initialBox = document.getElementById('initialBox');
	var reviewBox = document.getElementById('reviewBox');
	var finalBox = document.getElementById('finalBox');
	// on check click uncheck the other two boxes
	if (box !== initialBox) {
		if (initialBox.checked == true) { initialBox.checked = false; }
	} else {
		// Show only the necessary textareas
		document.getElementById("planOfAction").style.display = "block";
		document.getElementById("progressTowardsGoal").style.display = "none";
		document.getElementById("nextSteps").style.display = "none";
		document.getElementById("nextMeeting").style.display = "block";
	}
	if (box !== reviewBox) {
		if (reviewBox.checked == true) { reviewBox.checked = false; }
	} else {
		// Show only the necessary textareas
		document.getElementById("planOfAction").style.display = "block";
		document.getElementById("progressTowardsGoal").style.display = "block";
		document.getElementById("nextSteps").style.display = "block";
		document.getElementById("nextMeeting").style.display = "block";
	}
	if (box !== finalBox) {
		if (finalBox.checked == true) { finalBox.checked = false; }
	} else {
		// Show only the necessary textareas
		document.getElementById("planOfAction").style.display = "block";
		document.getElementById("progressTowardsGoal").style.display = "block";
		document.getElementById("nextSteps").style.display = "none";
		document.getElementById("nextMeeting").style.display = "none";
	}
	// update the title
	storage.get(null, function(result) {
		var meetingType;
		if (box == initialBox) { meetingType = "INITIAL"; };
		if (box == reviewBox) { meetingType = "REVIEW"; };
		if (box == finalBox) { meetingType = "FINAL"; };
		document.title = "SSP_" + meetingType + "_" + result.studentID + "_" + formatDate(document.getElementById("currentMeetingDate").value, "-");
	});
}

///// Function for storing all information on page as a studentReport object
function storeReport() {
	// Create studentReport object
	var studentReport = [];
	// collect local storage variables
	storage.get(null, function(result) {
		// get current reportsArray
		//if (result.reportsArray == null) {
		//	var loadedReportsArray = new Array();
		//} else {
		//	var loadedReportsArray = result.reportsArray;
		//};
				
		var studentArray = {};
		
		// declare variables within the nested array with the unique names
		studentArray['studentID'] = result.studentID;	
		studentArray['studentName'] = result.studentName;
		studentArray['caretakerName'] = result.caretakerName;
		studentArray['currentGrade'] = result.currentGrade;
		studentArray['startYear'] = result.startYear;
		studentArray['cohortYear'] = result.cohortYear;
		studentArray['credits'] = result.credits;
		studentArray['contactNumbers'] = result.contactNumbers;
		studentArray['gradebook'] = result.gradebook;
		studentArray['overdueLessons'] = result.overdueLessons;
		studentArray['lastLesson'] = result.lastLesson;
		studentArray['lastAssessment'] = result.lastAssessment;
		studentArray['postGradPlans'] = result.postGradPlans;
		studentArray['daysAbsent'] = result.daysAbsent;
		studentArray['missingHours'] = result.missingHours;
		studentArray['strengthsPLP'] = result.strengthsPLP;
		studentArray['goalsPLP'] = result.goalsPLP;
		studentArray['interestsPLP'] = result.interestsPLP;
		
		// Values to pull from report.html : reportType, currentMeetingDate, sspGoal, actionPlan, goalProgress, nextSteps, nextMeetingDate, addNotes
		// get current date
		studentArray['currentMeeting'] = formatDate(document.getElementById("currentMeetingDate").value);
		// get reportType
		var initialBox = document.getElementById('initialBox');
		var reviewBox = document.getElementById('reviewBox');
		var finalBox = document.getElementById('finalBox');
		if (initialBox.checked == true) { studentArray['meetingType'] = 'Initial'; }
		if (reviewBox.checked == true) { studentArray['meetingType'] = 'Review'; }
		if (finalBox.checked == true) { studentArray['meetingType'] = 'Final'; }
		// get user input for textareas and next meeting date in report
		studentArray['sspGoal'] = document.getElementById('goalTA').value;
		studentArray['sspPlan'] = document.getElementById('planTA').value;
		studentArray['sspProgress'] = document.getElementById('progressTA').value;
		studentArray['sspNextSteps'] = document.getElementById('nextStepsTA').value;
		studentArray['nextMeeting'] = formatDate(document.getElementById('nextMeetingDate').value);
		studentArray['sspNotes'] = document.getElementById('notesTA').value;

		storage.set({['SSP' + result.studentID + formatDate(document.getElementById('currentMeetingDate').value)] : studentArray});
	});
	
	// Code to get values from sotrage
	storage.get(null, function(variables) {
		storage.get(null, function(result) {
			console.log(result);
		});
		// Attempt to pull from local storage LOOK AT CONSOLE
		var reportName = "SSP" + variables.studentID  + formatDate(document.getElementById("currentMeetingDate").value);
		storage.get([reportName], function(result) {
			var localArray = result;
			console.log(localArray);
			alert(result[reportName]['studentName'] + " Report Stored!");
		});
		
	});
	
	// update popup with new student in list
	///////
	///////   Create New SSP Report
	///////
	///////   CURRENT REPORTS
	///////   \/ Adam Warniment (123456)
	///////       - SSP_INITIAL_123456_8-9-17     X
	///////       - SSP_REVIEW_1234568_8-10-17    X
	///////   \/ Bill Braski (9875623)
	///////       - SSP_INITIAL_9875623_4-8-17    X
	///////
	
	// Clear local storage
}

// Load report
function loadReport() {
	
}

// text area resize
function adjust(e) {
  var style = this.currentStyle || window.getComputedStyle(this);
  var boxSizing = style.boxSizing === 'border-box'
      ? parseInt(style.borderBottomWidth, 10) +
        parseInt(style.borderTopWidth, 10)
      : 0;
  this.style.height = '';
  this.style.height = (this.scrollHeight + boxSizing) + 'px';
};

// make any textarea within the dynamicTA class resize automatically
var textAreas = document.getElementsByClassName("dynamicTA");
for (var i = 0, len = textAreas.length; i < len; i++) {
	if ('onpropertychange' in textAreas[i]) { // IE
	  textAreas[i].onpropertychange = adjust;
	} else if ('oninput' in textAreas[i]) {
	  textAreas[i].oninput = adjust;
	}
	adjust.call(textAreas[i]);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (plpDone == true && cohortDone == true && gradebookDone == true && truancyDone == true) {
		loadVariables();
	}
	if (killTime == true) {
		killswitch();
	}
	if (request.type == "plpDone")
      plpDone = true;
	if (request.type == "cohortDone")
      cohortDone = true;
	if (request.type == "gradebookDone")
      gradebookDone = true;
	if (request.type == "truancyDone")
      truancyDone = true;
	if (request.type == "killswitch") {
		killTime = true;
	}
	// remove the close window warning
	if (request.type == "removeCloseWarning") {
		window.onbeforeunload = function() {};
	}
  }
);