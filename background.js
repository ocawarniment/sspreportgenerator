// shortcut for local storage
var storage = chrome.storage.local;

// open the report on icon click
chrome.browserAction.onClicked.addListener(function(activeTab)
{
	var answer = confirm("Would you like to create a new report? This will close all previous reports so make sure you have saved!")
	if (answer == true){
		closeOpenReports();
		createReport();
	}
	else{
		// do nothing
	}
	
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	// Listen for studentID error message
	if (request.type == "endEarly") {
		window.close();
	}
	// Listen for create new report
	if (request.type == "newReport") {
		createReport();
	}
	// Listen for close current reports
	if (request.type == "closeReports") {
		closeOpenReports();
	}
	// listen for noStudentFound
	if (request.type == "noStudentFound") {alert("No Student Found"); chrome.runtime.sendMessage({type: "hideOverlay"});}
  }
);

///// New Report Function
function createReport() {
	// clear all prior variables to ensure everything is new
	storage.remove([
		'caretakerName', 
		'cohortYear', 
		'contactNumbers',
		'credits',
		'currentGrade',
		'daysAbsent',
		'goalsPLP',
		'gradebook',
		'interestsPLP',
		'lastAssessment',
		'lastLesson',
		'missingHours',
		'overdueLessons',
		'postGradPlans',
		'startYear',
		'statusPLP',
		'strengthsPLP',
		'studentID',
		'studentName'
	]);
	
	// Get the new student ID
	var studentID = prompt("Please enter the student ID.");
	storage.set({'studentID': studentID});
	
	// break if blank student ID
	if (studentID == "") {alert("Please enter a student ID!"); return;}

	// Check if student exists
	chrome.tabs.create({ url: 'https://www.connexus.com/webuser/overview.aspx?idWebuser=' + studentID }, function(tab) {
		chrome.tabs.executeScript(tab.id, {
			file: '/scripts/checkStudent.js',
			runAt: 'document_idle'
		});
	});
	// Load PLP DV
	chrome.tabs.create({ url: 'https://www.connexus.com/dataview/14563?idWebuser=' + studentID }, function(tab) {
		chrome.tabs.executeScript(tab.id, {
			file: '/scripts/plp.js',
			runAt: 'document_idle'
		});
	});
	// Load Cohort DV
	chrome.tabs.create({ url: 'https://www.connexus.com/dataview/115?idWebuser=' + studentID }, function(tab) {
		chrome.tabs.executeScript(tab.id, {
			file: '/scripts/cohort.js',
			runAt: 'document_idle'
		});
	});
	// Load gradebook
	chrome.tabs.create({ url: 'https://www.connexus.com/gradeBook/default.aspx?idWebuser=' + studentID}, function(tab) {
		chrome.tabs.executeScript(tab.id, {
			file: '/scripts/gradebook.js',
			runAt: 'document_idle'
		});
	});
	// Load truancy DV
	chrome.tabs.create({ url: 'https://www.connexus.com/webuser/dataview.aspx?idWebuser=' + studentID + '&idDataview=14661'}, function(tab) {
		chrome.tabs.executeScript(tab.id, {
			file: '/scripts/truancy.js',
			runAt: 'document_idle'
		});
	});	
	
	// create the report page
	chrome.tabs.create({ url: "report.html" });	
}

// focus on report window
function focusReport() {
	chrome.windows.getAll({populate:true},function(windows){
	  windows.forEach(function(window){
		window.tabs.forEach(function(tab){
			// if the url matches, remove the warning using a message then close the tab
			if (tab.url.match(/\bchrome-extension.*report\.html/g)) {
				// remove the close window warning 
				chrome.tabs.update(tab.id, {selected: true});
			};
		});
	  });
	});
}

// Close reports function
function closeOpenReports() {
	// scan all windows and find urls that match as report
	chrome.windows.getAll({populate:true},function(windows){
	  windows.forEach(function(window){
		window.tabs.forEach(function(tab){
			// if the url matches, remove the warning using a message then close the tab
			if (tab.url.match(/\bchrome-extension.*report\.html/g)) {
				// remove the close window warning 
				chrome.runtime.sendMessage({type: "removeCloseWarning"});
				// close the tab
				chrome.tabs.remove(tab.id);
			};
		});
	  });
	});
}
