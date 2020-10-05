// shortcut for local storage
var storage = chrome.storage.local;

///// EACH TIME POPUP LOADS, REVIEW THE LIST AND UPDATE WITH NEW SSP REPORTS
// clear prior reports
var reportList = document.getElementById('reportList');
var length = reportList.options.length;
for (i = 0; i < length; i++) {
  reportList.options[i] = null;
}

// rebuild the list from storage
chrome.storage.local.get(null, function(items) {
	console.log(items);
	i = 0;
	for (key in items) {
		//do stuffs here
		if(key.match(/^SSP.*/g)) {
			// add new list item with the id as the reportID
			//create new option
			var newOption = document.createElement("option");
			//set the ID
			newOption.id = key;
			//set the value to not overwrite when adding
			newOption.value = key;
			//Set the inner text
			reportName = key.toString();
			var meetingDate = items[reportName]['currentMeeting'];
			meetingDate = meetingDate.slice(0, 2) + "/" + meetingDate.slice(2);
			meetingDate = meetingDate.slice(0, 5) + "/" + meetingDate.slice(5);
			var listTitle = items[reportName]['studentName'] + " (" + meetingDate + ") " + items[reportName]['meetingType'];
			newOption.innerText = listTitle;

			//storage.get([reportName], function(result) {
			//	var localArray = result;
			//	console.log(localArray);
			//	var listTitle = result[reportName]['studentName'] + " (" + result[reportName]['currentMeeting'] + ") " + result[reportName]['meetingType'];
			//	newOption.innerText = listTitle;
			//});
			// add to the select box
			var reportList = document.getElementById('reportList');
			reportList.add(newOption);
		};
	}
	sortList('reportList');
});

// sort the select report list alphabetically
function sortList(listID) {
	var list = document.getElementById(listID);
	var adjValues = new Array();
	var oldValues = new Array();
	var oldIDs = new Array();
	// build the arrays from the current values
	for(i=0; i<list.length; i++)  {
	  adjValues[i] = list.options[i].text;
	  oldValues[i] = list.options[i].text;
	  oldIDs[i] = list.options[i].id;
	}
	// sort just the adjValues leaving the other two to get locations and ids
	adjValues.sort();
	// loop through sorted list
	for(i=0; i<list.length; i++)  {
		// update the html list text and value
		list.options[i].text = adjValues[i];
		list.options[i].value = adjValues[i];
		// loop through the unsorted list
		for(n=0; n<list.length; n++)  {
		// if the new value matches the old value, take the old value loop location and get the id from the oldIDs array
		if(adjValues[i] == oldValues[n]) { 
			list.options[i].id = oldIDs[n];
		}
	  }
	}
}

function sendNewReportMessage() {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "newReport"});
};

function sendLoadReportMessage(reportName) {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "loadReport", reportID: reportName});
};

// assign the function to create a new object
document.getElementById('newReportButton').onclick = sendNewReportMessage;
// assign the function to check the selected index from the list
document.getElementById('loadReportButton').onclick = function() {var list = document.getElementById("reportList"); var reportID = list.options[list.selectedIndex].id; sendLoadReportMessage(reportID)};
