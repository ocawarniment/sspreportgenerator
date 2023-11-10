/**
 *
 * Name: report.js
 * Version: 1.0
 * Date: 8/11/2017
 *
 * Provides ability to update the generated report from values in storage.
 * Also, controls the extension and create new reports.
 * 
 */
 
 
 
////////// SHORTCUT DECLARATION //////////
// shortcut for local storage
var storage = chrome.storage.local;



////////// VARIABLES DECLARATION //////////
// status booleans
var plpDone = false;
var cohortDone = false;
var gradebookDone = false;
var truancyDone = false;



////////// CHROME MESSAGE LISTENERS //////////
// message listeners after report has loaded
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	// wait for all pages to load to prepare new report
	if (request.type = "pageComplete") {
		if (request.page == "plp") { plpDone = true; }
		if (request.page == "cohort") { cohortDone = true; }
		if (request.page == "gradebook") { gradebookDone = true; }
		if (request.page == "truancy") { truancyDone = true; }
	}
	// if all pages are loaded, prepare new report
	if (plpDone == true && cohortDone == true && gradebookDone == true && truancyDone == true) {
		updateReport();
		plpDone = false;
		cohortDone = false;
		gradebookDone = false;
		truancyDone = false;
	}
  }
);



////////// REPORT.HTML PAGE PREPARATION //////////
// assign the function to create a new report
//document.getElementById('newReportButton').onclick = sendNewReportMessage;
document.getElementById("overlay").style.display = "block";

////////// FUNCTIONS //////////
// send message to background to create a new report
function sendNewReportMessage() {
	// remporarily remove warning on leaving
	window.onbeforeunload = function() {};
	// reload the page
	location.reload();
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "newReport"});
};

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

// update report after all variables are gathered externally
function updateReport() {
	// set default date to today
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	var today = year + "-" + month + "-" + day;
	document.getElementById('currentMeetingDate').defaultValue = today;
	
	// update all values
	storage.get(null, function (result) {
		console.log(result);
		document.getElementById('studentName').innerText = result.studentName;
		document.getElementById('caretakerName').innerText = result.caretakerName;
		document.getElementById('currentGrade').innerText = result.currentGrade;
		document.getElementById('startYear').innerText = result.startYear;
		document.getElementById('cohortYear').innerText = result.cohortYear;
		document.getElementById('credits').innerText = result.credits;
		document.getElementById('comp_alg1').innerText = result.comp_alg1;
		document.getElementById('comp_eng2').innerText = result.comp_eng2;
		document.getElementById('sealsCount_local').innerText = result.sealsCount_local;
		document.getElementById('sealsCount_state').innerText = result.sealsCount_state;

		document.getElementById('afterHighSchoolPlans').innerText = result.afterHighSchoolPlans;
		document.getElementById('postGradPlans').innerText = result.postGradPlans;

		document.getElementById('contactNumbers').innerText = result.contactNumbers;
		document.getElementById('gradebook').innerHTML = result.gradebook;
		document.getElementById('overdueLessons').innerText = result.overdueLessons;
		document.getElementById('lastLesson').innerText = result.lastLesson;
		document.getElementById('lastAssessment').innerText = result.lastAssessment;
		document.getElementById('postGradPlans').innerText = result.postGradPlans;
		//document.getElementById('daysAbsent').innerText = result.daysAbsent;
		//document.getElementById('missingHours').innerText = result.missingHours;

		document.getElementById('reqHours_fall').innerText = result.reqHours_fall;
		document.getElementById('actHours_fall').innerText = result.actHours_fall;
		document.getElementById('difHours_fall').innerText = result.difHours_fall;

		document.getElementById('reqHours_spring').innerText = result.reqHours_spring;
		document.getElementById('actHours_spring').innerText = result.actHours_spring;
		document.getElementById('difHours_spring').innerText = result.difHours_spring;

		document.getElementById('strengthsPLP').innerText = result.strengthsPLP;
		document.getElementById('goalsPLP').innerText = result.goalsPLP;
		document.getElementById('interestsPLP').innerHTML = result.interestsPLP;

		// display all contact numbers
		var contactsStack = '';
		for(var i=0; i<result.contactNumbers.length; i++){
			contactsStack = contactsStack + result.contactNumbers[i];
			if(i+1 !== result.contactNumbers.length) { 
				// add a line break too 
				contactsStack = contactsStack + '\n';
			}
		}
		console.log(contactsStack);
		document.getElementById('contactNumbers').innerText = contactsStack;
	});

	// add the function to the buttons
	var initialBox = document.getElementById('initialBox');
	var reviewBox = document.getElementById('reviewBox');
	var finalBox = document.getElementById('finalBox');
	initialBox.onclick = function() {updateMeeting(this);};
	reviewBox.onclick = function() {updateMeeting(this);};
	finalBox.onclick = function() {updateMeeting(this);};

	// wait then copy the headers
	setTimeout(function() {
		// copy header 1 to page 2
		var headerTablePageOne = document.getElementById("headerTable").lastChild;
		var headerTablePageTwo = headerTablePageOne.cloneNode(true);
		document.getElementById("headerTableTwo").appendChild(headerTablePageTwo);
	}, 500);
	
	// Turn off the overlay
	setTimeout(function() {
		// turn off overlay
		document.getElementById("overlay").style.display = "none";
	}, 500);
	
	// Set title with student ID
	storage.get(null, function (result) {
		document.title = "SSP_" + result.studentID;
	});
	
	// notify the user of the reminder
	//alert("Print this page as a PDF before closing or everything will be lost!");
};
	
// fuction for adapting report based on meeting
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




////////////////////////////////////////////
/////     Code for storage system.     /////
////////////////////////////////////////////


/////// BUTTONS
// update the save button
//document.getElementById('refreshList').onclick = updateReportList;
// update the save button
//document.getElementById('saveReportButton').onclick = storeReport;
// assign the function to check the selected index from the list
//document.getElementById('loadReportButton').onclick = function() {var list = document.getElementById("reportList"); var reportID = list.options[list.selectedIndex].id; loadReport(reportID)};
// update delete button
//document.getElementById('deleteReportButton').onclick = function() {var list = document.getElementById("reportList"); var reportID = list.options[list.selectedIndex].id; deleteReport(reportID)};
// update the settings button
//document.getElementById('settingsButton').onclick = showHideSettings;

///// EACH TIME Report LOADS, REVIEW THE LIST AND UPDATE WITH NEW SSP REPORTS
//updateReportList();

/////// FUNCTIONS
// function to hide top bar on report.html
//function showHideSettings() {
//    var x = document.getElementById('settingsBar');
//    if (x.style.display === 'none') {
//        x.style.display = 'block';
//    } else {
//        x.style.display = 'none';
//    }
//}
// fucntion to update report list on load or after a new report is saved
//function updateReportList() {
//	// clear prior reports
//	document.getElementById('reportList').options.length = 0;
//	// rebuild the list from storage
//	chrome.storage.local.get(null, function(items) {
//		i = 0;
//		for (key in items) {
//			//do stuffs here
//			if(key.match(/^SSP.*/g)) {
//				console.log(key);
//				// add new list item with the id as the reportID
//				//create new option
//				var newOption = document.createElement("option");
//				//set the ID
//				newOption.id = key;
//				//set the value to not overwrite when adding
//				newOption.value = key;
//				//Set the inner text
//				reportName = key.toString();
//				var meetingDate = items[reportName]['currentMeeting'];
//				meetingDate = meetingDate.slice(0, 2) + "/" + meetingDate.slice(2);
//				meetingDate = meetingDate.slice(0, 5) + "/" + meetingDate.slice(5);
//				var listTitle = items[reportName]['studentName'] + " (" + meetingDate + ") " + items[reportName]['meetingType'];
//				newOption.innerText = listTitle;
//
//				var reportList = document.getElementById('reportList');
///				reportList.add(newOption);
//			};
//		}
//		sortList('reportList');
//	});
//}
//function sortList(listID) {
//	var list = document.getElementById(listID);
///	var adjValues = new Array();
//	var oldValues = new Array();
//	var oldIDs = new Array();
//	// build the arrays from the current values
//	for(i=0; i<list.length; i++)  {
//	  adjValues[i] = list.options[i].text;
//	  oldValues[i] = list.options[i].text;
//	  oldIDs[i] = list.options[i].id;
//	}
//	// sort just the adjValues leaving the other two to get locations and ids
//	adjValues.sort();
//	// loop through sorted list
//	for(i=0; i<list.length; i++)  {
//		// update the html list text and value
//		list.options[i].text = adjValues[i];
//		list.options[i].value = adjValues[i];
//		// loop through the unsorted list
//		for(n=0; n<list.length; n++)  {
//		// if the new value matches the old value, take the old value loop location and get the id from the oldIDs array
//		if(adjValues[i] == oldValues[n]) { 
//			list.options[i].id = oldIDs[n];
//		}
//	  }
//	}
//}

///// Function for storing all information on page as a studentReport object
//function storeReport() {
///	// check if report is blank
//	if (document.getElementById('studentName').innerText !== "") {
//		// Create studentReport object
//		var studentReport = [];
//		// collect local storage variables
//		storage.get(null, function(result) {
//					
//			var studentArray = {};
//			
//			// declare variables within the nested array with the unique names
//			studentArray['studentID'] = result.studentID;	
//			studentArray['studentName'] = result.studentName;
//			studentArray['caretakerName'] = result.caretakerName;
//			studentArray['currentGrade'] = result.currentGrade;
//			studentArray['startYear'] = result.startYear;
//			studentArray['cohortYear'] = result.cohortYear;
//			studentArray['credits'] = result.credits;
//			studentArray['contactNumbers'] = result.contactNumbers;
//			studentArray['gradebook'] = result.gradebook;
//			studentArray['overdueLessons'] = result.overdueLessons;
//			studentArray['lastLesson'] = result.lastLesson;
//			studentArray['lastAssessment'] = result.lastAssessment;
//			studentArray['postGradPlans'] = result.postGradPlans;
//			studentArray['daysAbsent'] = result.daysAbsent;
//			studentArray['missingHours'] = result.missingHours;
//			studentArray['strengthsPLP'] = result.strengthsPLP;
//			studentArray['goalsPLP'] = result.goalsPLP;
//			studentArray['interestsPLP'] = result.interestsPLP;
//			
//			// Values to pull from report.html : reportType, currentMeetingDate, sspGoal, actionPlan, goalProgress, nextSteps, nextMeetingDate, addNotes
//			// get current date
//			studentArray['currentMeeting'] = formatDate(document.getElementById("currentMeetingDate").value);
//			// get reportType
//			var initialBox = document.getElementById('initialBox');
//			var reviewBox = document.getElementById('reviewBox');
//			var finalBox = document.getElementById('finalBox');
//			if (initialBox.checked == true) { studentArray['meetingType'] = 'Initial'; }
//			if (reviewBox.checked == true) { studentArray['meetingType'] = 'Review'; }
//			if (finalBox.checked == true) { studentArray['meetingType'] = 'Final'; }
//			// get user input for textareas and next meeting date in report
//			studentArray['sspGoal'] = document.getElementById('goalTA').value;
//			studentArray['sspPlan'] = document.getElementById('planTA').value;
//			studentArray['sspProgress'] = document.getElementById('progressTA').value;
//			studentArray['sspNextSteps'] = document.getElementById('nextStepsTA').value;
//			studentArray['nextMeeting'] = formatDate(document.getElementById('nextMeetingDate').value);
//			studentArray['sspNotes'] = document.getElementById('notesTA').value;
//
//			// give the report a unique id name
//			reportName = 'SSP' + result.studentID + formatDate(document.getElementById('currentMeetingDate').value);
//			// Make sure a report that matches is deleted first
//			deleteReport(reportName);
//			// store the new report
//			storage.set({['SSP' + result.studentID + formatDate(document.getElementById('currentMeetingDate').value)] : studentArray});
//			// update and refresh the list
//			updateReportList();
//		});
//	} else {
//		alert("please load report!");
//	}
//}

// Update all the values on the report with the called report
//function loadReport(reportName) {
//	// send message to report to notify completion
//	storage.get([reportName], function(result) {
//		document.getElementById('studentName').innerText = result[reportName]['studentName'];
//		document.getElementById('studentName').innerText = result[reportName]['studentName'];
//		document.getElementById('caretakerName').innerText = result[reportName]['caretakerName'];
//		document.getElementById('currentGrade').innerText = result[reportName]['currentGrade'];
//		document.getElementById('startYear').innerText = result[reportName]['startYear'];
//		document.getElementById('cohortYear').innerText = result[reportName]['cohortYear'];
//		document.getElementById('credits').innerText = result[reportName]['credits'];
//		document.getElementById('contactNumbers').innerText = result[reportName]['contactNumbers'];
//		document.getElementById('gradebook').innerHTML = result[reportName]['gradebook'];
//		document.getElementById('overdueLessons').innerText = result[reportName]['overdueLessons'];
//		document.getElementById('lastLesson').innerText = result[reportName]['lastLesson'];
//		document.getElementById('lastAssessment').innerText = result[reportName]['lastAssessment'];
//		document.getElementById('postGradPlans').innerText = result[reportName]['postGradPlans'];
//		document.getElementById('daysAbsent').innerText = result[reportName]['daysAbsent'];
//		document.getElementById('missingHours').innerText = result[reportName]['missingHours'];
//		document.getElementById('strengthsPLP').innerText = result[reportName]['strengthsPLP'];
//		document.getElementById('goalsPLP').innerText = result[reportName]['goalsPLP'];
//		document.getElementById('interestsPLP').innerHTML = result[reportName]['interestsPLP'];
//		// set meeting report date in the correct form
//		var currentDate = result[reportName]['currentMeeting'];
//		currentDate = currentDate.slice(4) + "-" + currentDate.slice(0, 2) + "-" + currentDate.slice(2, 4);
//		document.getElementById("currentMeetingDate").value = currentDate;
//		// set next meeting report date in the correct form
//		var nextMeetingDate = result[reportName]['nextMeeting'];
//		nextMeetingDate = nextMeetingDate.slice(4) + "-" + nextMeetingDate.slice(0, 2) + "-" + nextMeetingDate.slice(2, 4);
//		document.getElementById("nextMeetingDate").value = nextMeetingDate;
//		document.getElementById('goalTA').value = result[reportName]['sspGoal'];
//		document.getElementById('planTA').value = result[reportName]['sspPlan'];
//		document.getElementById('progressTA').value = result[reportName]['sspProgress'];
//		document.getElementById('nextStepsTA').value = result[reportName]['sspNextSteps'];
//		document.getElementById('notesTA').value = result[reportName]['sspNotes'];
//		// load meeting type
//		var initialBox = document.getElementById('initialBox');
//		var reviewBox = document.getElementById('reviewBox');
//		var finalBox = document.getElementById('finalBox');
//		// uncheck them all
//		initialBox.checked = false;
//		reviewBox.checked = false;
//		finalBox.checked = false;
//		// check the correct box
//		if(result[reportName]['meetingType'] == 'Initial') { initialBox.checked = true; updateMeeting(initialBox);}
//		if(result[reportName]['meetingType'] == 'Review') { reviewBox.checked = true; updateMeeting(reviewBox);}
//		if(result[reportName]['meetingType'] == 'Final') { finalBox.checked = true; updateMeeting(finalBox);}
//		
//		// update single variables allowing for an updated "save"
//		storage.set({'studentName': result[reportName]['studentName']});
//		storage.set({'caretakerName': result[reportName]['caretakerName']});
//		storage.set({'currentGrade': result[reportName]['currentGrade']});
//		storage.set({'startYear': result[reportName]['startYear']});
//		storage.set({'cohortYear': result[reportName]['cohortYear']});
//		storage.set({'credits': result[reportName]['credits']});
//		storage.set({'contactNumbers': result[reportName]['contactNumbers']});
//		storage.set({'gradebook': result[reportName]['gradebook']});
//		storage.set({'overdueLessons': result[reportName]['overdueLessons']});
//		storage.set({'lastLesson': result[reportName]['lastLesson']});
//		storage.set({'lastAssessment': result[reportName]['lastAssessment']});
//		storage.set({'postGradPlans': result[reportName]['postGradPlans']});
//		storage.set({'daysAbsent': result[reportName]['daysAbsent']});
//		storage.set({'missingHours': result[reportName]['missingHours']});
//		storage.set({'strengthsPLP': result[reportName]['strengthsPLP']});
//		storage.set({'goalsPLP': result[reportName]['goalsPLP']});
//		storage.set({'interestsPLP': result[reportName]['interestsPLP']});
//		storage.set({'interestsPLP': result[reportName]['interestsPLP']});
//		storage.set({'interestsPLP': result[reportName]['interestsPLP']});
//	});
//};
//
//// Update all the values on the report with the called report
//function deleteReport(reportName) {
//	// send message to report to notify completion
//	storage.remove([reportName]);
//	updateReportList();
//};

// Load reports function
//function loadReport(reportName) {
//	// store the sent report allowing the report.html page to collect the values
//	storage.get([reportName], function(result) {
//		storage.set({'currentReport': result[reportName]});
//	});
//	// open the page and run the script
//	chrome.tabs.create({url: 'report.html'}, function(tab) {
//		chrome.tabs.executeScript(tab.id, {
//			file: '/scripts/loadReport.js',
//			runAt: 'document_end'
//		});
//	});	
//};