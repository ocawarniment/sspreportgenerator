// shortcut for local storage
var storage = chrome.storage.local;

if (document.getElementById("sectionsArea") !== null) {
	///// REMOVE UNWANTED VALUES AND TEXT
	// collect the table by rows
	var tableRows = document.getElementById("sectionsArea").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");

	// delete the "section summary" title
	document.getElementById("sectionsArea").getElementsByTagName("span")[0].remove();
	document.getElementById("sectionsArea").getElementsByTagName("span")[0].remove();

	// remove cells from the first row
	tableRows[0].getElementsByTagName("th")[0].remove();
	tableRows[0].getElementsByTagName("th")[5].remove();
	tableRows[0].getElementsByTagName("th")[7].remove();

	// loop through, update links and remove cells from the remaining rows
	for (var i = 1, len = tableRows.length; i < len; i++) {
		// remove unwanted cells
		tableRows[i].getElementsByTagName("td")[0].remove();
		tableRows[i].getElementsByTagName("td")[5].remove();
		tableRows[i].getElementsByTagName("td")[7].remove();
	}
}

// Only continue checking gradbook if table is found
if (document.getElementById('sectionsArea') !== null) {
	// scan HTML replace 'default' with full link beginning
	document.getElementById('sectionsArea').innerHTML = document.getElementById('sectionsArea').innerHTML.replace(/default/g, 'https://www.connexus.com/gradeBook/default');
	// open new tabs on links
	document.getElementById('sectionsArea').innerHTML = document.getElementById('sectionsArea').innerHTML.replace(/href/g, 'target="_blank" href');
	// store gradebook table
	storage.set({'gradebook': document.getElementById('sectionsArea').innerHTML});
} else {
	storage.set({'gradebook': "No Courses Found!"});
}
	
// check if page had error
if (document.title !== "Access Denied") {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "pageComplete", page: "gradebook"});
	window.close();
} else {
	window.close();
}
