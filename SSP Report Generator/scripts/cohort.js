// shortcut for local storage
var storage = chrome.storage.local;

if (document.getElementById('EF_CohortGraduationYear') !== null) {
	// store cohort grad year
	storage.set({'cohortYear': document.getElementById('EF_CohortGraduationYear').innerHTML.trim()});
} else {
	storage.set({'cohortYear': "None"});
}

if (document.getElementById('EF_TotalCreditsEarned') !== null) {
	// store HS credits
	storage.set({'credits': document.getElementById('EF_TotalCreditsEarned').innerHTML.trim()});
} else { 
	storage.set({'credits': "0"});
}

// check if page had error
if (document.title !== "Access Denied") {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "pageComplete", page: "cohort"});
	window.close();
} else {
	window.close();
}
