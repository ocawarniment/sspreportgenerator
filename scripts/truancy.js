// shortcut for local storage
var storage = chrome.storage.local;

if (document.getElementById('EF_NumberLessonsBehind') !== null) {
	// overdue lessons
	storage.set({'lessonsBehind': document.getElementById('EF_NumberLessonsBehind').innerText.trim()});
} else {
	storage.set({'lessonsBehind': "Not Found"});
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

if (document.querySelector('[id^="Ohio_Truancy"][id$="_ReqInstHrs_F"') !== null) {
	storage.set({'reqHours_fall': Math.round(document.querySelector('[id^="Ohio_Truancy"][id$="_ReqInstHrs_F"').innerText.trim()*100)/100});
} else {
	storage.set({'reqHours_fall': 0});
}
if (document.querySelector('[id^="Ohio_Truancy"][id$="_ActuAttHrs_F"') !== null) {
	storage.set({'actHours_fall': Math.round(document.querySelector('[id^="Ohio_Truancy"][id$="_ActuAttHrs_F"').innerText.trim()*100)/100});
} else {
	storage.set({'actHours_fall': 0});
}
if (document.querySelector('[id^="Ohio_Truancy"][id$="_BankedHours_F"') !== null) {
	storage.set({'difHours_fall': Math.round(document.querySelector('[id^="Ohio_Truancy"][id$="_BankedHours_F"').innerText.trim()*100)/100});
} else {
	storage.set({'difHours_fall': 0});
}

if (document.querySelector('[id^="Ohio_Truancy"][id$="_ReqInstHrs_S"') !== null) {
	// days absent
	storage.set({'reqHours_spring': Math.round(document.querySelector('[id^="Ohio_Truancy"][id$="_ReqInstHrs_S"').innerText.trim()*100)/100});
} else {
	storage.set({'reqHours_spring': 0});
}
if (document.querySelector('[id^="Ohio_Truancy"][id$="_ActuAttHrs_S"') !== null) {
	storage.set({'actHours_spring': Math.round(document.querySelector('[id^="Ohio_Truancy"][id$="_ActuAttHrs_S"').innerText.trim()*100)/100});
} else {
	storage.set({'actHours_spring': 0});
}
if (document.querySelector('[id^="Ohio_Truancy"][id$="_BankedHours_S"') !== null) {
	storage.set({'difHours_spring': Math.round(document.querySelector('[id^="Ohio_Truancy"][id$="_BankedHours_S"').innerText.trim()*100)/100});
} else {
	storage.set({'difHours_spring': 0});
}

// check if page had error
if (document.title !== "Access Denied") {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "pageComplete", page: "truancy"});
	window.close();
} else {
	window.close();
}
