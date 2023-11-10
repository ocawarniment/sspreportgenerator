// shortcut for local storage
var storage = chrome.storage.local;

if (document.getElementById('PostHighSchoolPlans_2') !== null) {
	// store post grad plans
	storage.set({'afterHighSchoolPlans': document.getElementById('PostHighSchoolPlans_2').value});
} else {
	storage.set({'afterHighSchoolPlans': "Not Found"});
}

if (document.getElementById('PostGraduationPlans') !== null) {
	// store post grad plans
	storage.set({'postGradPlans': document.getElementById('PostGraduationPlans').value});
} else {
	storage.set({'postGradPlans': "Not Found"});
}

// check if page had error
if (document.title !== "Access Denied") {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "pageComplete", page: "futurefocus"});
	window.close();
} else {
	window.close();
}
