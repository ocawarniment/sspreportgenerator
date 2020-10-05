// shortcut for local storage
var storage = chrome.storage.local;

if (document.getElementById('EF_NumberLessonsBehind') !== null) {
	// overdue lessons
	storage.set({'overdueLessons': document.getElementById('EF_NumberLessonsBehind').innerText.trim()});
} else {
	storage.set({'overdueLessons': "Not Found"});
}

if (document.querySelector('[id*="EF_LastLessonComplete"]') !== null) {
	// last lesson complete date
	storage.set({'lastLesson': document.querySelector('[id*="EF_LastLessonComplete"]').innerText.trim()});
} else {
	storage.set({'lastLesson': "Not Found"});
}

if (document.querySelector('[id*="EF_LastAssessmentCompleted"]') !== null) {
	// last assessment complete date
	storage.set({'lastAssessment': document.querySelector('[id*="EF_LastAssessmentCompleted"]').innerText.trim()});
} else {
	storage.set({'lastAssessment': "Not Found"});
}

if (document.querySelector('[id^="OCA_Truancy"][id$="_HrsMissedYTD"') !== null) {
	// total missing hours
	storage.set({'missingHours': Math.round(document.querySelector('[id^="OCA_Truancy"][id$="_HrsMissedYTD"').innerText.trim()*100)/100});
} else {
	storage.set({'missingHours': "Not Found"});
}

if (document.querySelector('[id^="OCA_Truancy"][id$="_ReqInstrucHrs"') !== null) {
	// days absent
	storage.set({'daysAbsent': Math.round(document.querySelector('[id^="OCA_Truancy"][id$="_ReqInstrucHrs"').innerText.trim()*100)/100});
} else {
	storage.set({'daysAbsent': "Not Found"});
}

// check if page had error
if (document.title !== "Access Denied") {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "pageComplete", page: "truancy"});
	window.close();
} else {
	window.close();
}
