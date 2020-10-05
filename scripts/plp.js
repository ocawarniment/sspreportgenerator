// shortcut for local storage
var storage = chrome.storage.local;

if (document.getElementById('EF_Student_Name') !== null) {
	// store ST name
	storage.set({'studentName': document.getElementById('EF_Student_Name').innerText.trim()});
} else {
	storage.set({'studentName': "Not Found"});
}
	
if (document.getElementById('EF_AllCaretakersInHousehold') !== null) {
	// store CT name(s)
	storage.set({'caretakerName': document.getElementById('EF_AllCaretakersInHousehold').innerHTML.trim()});
} else {
	storage.set({'caretakerName': "Not Found"});
}
	
if (document.getElementById('EF_Final_Grade') !== null) {
	// store current grade
	storage.set({'currentGrade': document.getElementById('EF_Final_Grade').innerHTML.trim()});
} else {
	storage.set({'currentGrade': "-"});
}
	
if (document.getElementById('EF_StartYear') !== null) {
	// store start year
	storage.set({'startYear': document.getElementById('EF_StartYear').innerHTML.trim()});
} else {
	storage.set({'startYear': "Not Found"});
}
	
if (document.getElementById('EF_PhoneNumbers') !== null) {
	// store contact info after converting <br>
	storage.set({'contactNumbers': document.getElementById('EF_PhoneNumbers').innerHTML.trim().split('<br>')});
} else {
	storage.set({'contactNumbers': ["No Contact Information"]});
}
	
if (document.getElementById('PostHighSchoolPlans_2') !== null) {
	// store post grad plans
	storage.set({'postGradPlans': document.getElementById('PostHighSchoolPlans_2').value});
} else {
	storage.set({'postGradPlans': "Not Found"});
}
	
if (document.getElementById('InitiateWelcomeCall_Strengths') !== null) {
	// store strengths
	storage.set({'strengthsPLP': document.getElementById('InitiateWelcomeCall_Strengths').value});
} else {
	storage.set({'strengthsPLP': "Not Found"});
}
	
if (document.getElementById('InitiateWelcomeCall_Weaknesses') !== null) {
	// store goals
	storage.set({'goalsPLP': document.getElementById('InitiateWelcomeCall_Weaknesses').value});
} else {
	storage.set({'goalsPLP': "Not Found"});
}
	
if (document.getElementById('InitiateWelcomeCall_Interests') !== null) {
	// store interests
	storage.set({'interestsPLP': document.getElementById('InitiateWelcomeCall_Interests').value});
} else {
	storage.set({'interestsPLP': "Not Found"});
}

// check if page had error
if (document.title !== "Access Denied") {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "pageComplete", page: "plp"});
	window.close();
} else {
	window.close();
}






