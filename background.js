// DV ID
const dvid_truancy = '19335'; //2025-26
const dvid_focus = '17735';
const dvid_gradplan = '14230';

// shortcut for local storage
var storage = chrome.storage.local;

// Popup handles the UI interaction now, no need for click listener

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		// Listen for studentID error message
		if (request.type == "endEarly") {
			if (sender.tab) {
				chrome.tabs.remove(sender.tab.id);
			}
		}
		// Listen for create new report
		if (request.type == "newReport") {
			createReport();
		}
		// Listen for create new report with student ID
		if (request.type == "newReportWithID") {
			createReport(request.studentID);
		}
		// Listen for close current reports
		if (request.type == "closeReports") {
			closeOpenReports();
		}
		// listen for noStudentFound
		if (request.type == "noStudentFound") {
			console.error("No Student Found");
			chrome.runtime.sendMessage({ type: "hideOverlay" });
		}
	}
);

///// New Report Function
function createReport(studentID = null) {
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

	// If no student ID provided, don't proceed
	if (!studentID) {
		console.error("Student ID is required");
		return;
	}

	storage.set({ 'studentID': studentID });

	// break if blank student ID
	if (studentID == "") {
		console.error("Please enter a student ID!");
		return;
	}

	// Check if student exists
	chrome.tabs.create({ url: 'https://www.connexus.com/webuser/overview.aspx?idWebuser=' + studentID }, function (tab) {
		chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(listener);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['/scripts/checkStudent.js']
				}).catch(err => console.error('Script injection failed:', err));
			}
		});
	});
	// Load PLP DV
	chrome.tabs.create({ url: 'https://www.connexus.com/dataview/14563?idWebuser=' + studentID }, function (tab) {
		chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(listener);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['/scripts/plp.js']
				}).catch(err => console.error('Script injection failed:', err));
			}
		});
	});
	// Load Cohort DV
	chrome.tabs.create({ url: 'https://www.connexus.com/dataview/115?idWebuser=' + studentID }, function (tab) {
		chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(listener);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['/scripts/cohort.js']
				}).catch(err => console.error('Script injection failed:', err));
			}
		});
	});
	// Load gradebook
	chrome.tabs.create({ url: 'https://www.connexus.com/gradeBook/default.aspx?idWebuser=' + studentID }, function (tab) {
		chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(listener);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['/scripts/gradebook.js']
				}).catch(err => console.error('Script injection failed:', err));
			}
		});
	});
	// Load truancy DV
	chrome.tabs.create({ url: 'https://www.connexus.com/webuser/dataview.aspx?idWebuser=' + studentID + '&idDataview=' + dvid_truancy }, function (tab) {
		chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(listener);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['/scripts/truancy.js']
				}).catch(err => console.error('Script injection failed:', err));
			}
		});
	});

	// Load Ohio Grad Plan
	chrome.tabs.create({ url: 'https://www.connexus.com/webuser/dataview.aspx?idWebuser=' + studentID + '&idDataview=' + dvid_gradplan }, function (tab) {
		chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(listener);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['/scripts/gradplan.js']
				}).catch(err => console.error('Script injection failed:', err));
			}
		});
	});

	// Load FF
	chrome.tabs.create({ url: 'https://www.connexus.com/webuser/dataview.aspx?idWebuser=' + studentID + '&idDataview=' + dvid_focus }, function (tab) {
		chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(listener);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: ['/scripts/futurefocus.js']
				}).catch(err => console.error('Script injection failed:', err));
			}
		});
	});

	// create the report page
	chrome.tabs.create({ url: "report.html" });
}

// focus on report window
function focusReport() {
	chrome.windows.getAll({ populate: true }, function (windows) {
		windows.forEach(function (window) {
			window.tabs.forEach(function (tab) {
				// if the url matches, remove the warning using a message then close the tab
				if (tab.url.match(/\bchrome-extension.*report\.html/g)) {
					// remove the close window warning 
					chrome.tabs.update(tab.id, { active: true });
				};
			});
		});
	});
}

// Close reports function
function closeOpenReports() {
	// scan all windows and find urls that match as report
	chrome.windows.getAll({ populate: true }, function (windows) {
		windows.forEach(function (window) {
			window.tabs.forEach(function (tab) {
				// if the url matches, remove the warning using a message then close the tab
				if (tab.url.match(/\bchrome-extension.*report\.html/g)) {
					// remove the close window warning 
					chrome.runtime.sendMessage({ type: "removeCloseWarning" });
					// close the tab
					chrome.tabs.remove(tab.id);
				};
			});
		});
	});
}
