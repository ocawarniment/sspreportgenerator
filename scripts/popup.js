// shortcut for local storage
var storage = chrome.storage.local;

function sendNewReportMessage() {
	var studentID = document.getElementById('studentIDInput').value.trim();
	if (studentID === "") {
		alert("Please enter a student ID!");
		return;
	}
	// send message to background with student ID
	chrome.runtime.sendMessage({type: "newReportWithID", studentID: studentID});
	window.close();
};

// assign the function to create a new report
document.getElementById('newReportButton').onclick = sendNewReportMessage;
