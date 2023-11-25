// shortcut for local storage
var storage = chrome.storage.local;

if (document.querySelector('#EF_OCA_StateDiplomaSealCount') !== null) {
	// overdue lessons
	storage.set({'sealsCount_state': document.querySelector('#EF_OCA_StateDiplomaSealCount').innerText.trim()});
} else {
	storage.set({'sealsCount_state': "Not Found"});
}

if (document.querySelector('#EF_OCA_LocalDiplomaSealCount') !== null) {
	// last lesson complete date
	storage.set({'sealsCount_local': document.querySelector('#EF_OCA_LocalDiplomaSealCount').innerText.trim()});
} else {
	storage.set({'sealsCount_local': "Not Found"});
}

//EF_OHEOC_Alg_TestsTaken
if (document.querySelector('#EF_OHEOC_Alg_TestsTaken') !== null) {
	// last assessment complete date
	storage.set({'comp_alg1_attempts': document.querySelector('#EF_OHEOC_Alg_TestsTaken').innerText.trim()});
} else {
	storage.set({'comp_alg1_attempts': 0});
}

//EF_OHEOC_ELA2_TestsTaken
if (document.querySelector('#EF_OHEOC_ELA2_TestsTaken') !== null) {
	// last assessment complete date
	storage.set({'comp_eng2_attempts': document.querySelector('#EF_OHEOC_ELA2_TestsTaken').innerText.trim()});
} else {
	storage.set({'comp_eng2_attempts': 0});
}

if (document.querySelector('#EF_OCAGPcomp_MetENG2') !== null) {
	// last assessment complete date
	storage.set({'comp_eng2': document.querySelector('#EF_OCAGPcomp_MetENG2').innerText.trim()});
} else {
	storage.set({'comp_eng2': "Not Found"});
}

if (document.querySelector('#EF_OCAGPcomp_MetAlg1') !== null) {
	// total missing hours
	storage.set({'comp_alg1': document.querySelector('#EF_OCAGPcomp_MetAlg1').innerText.trim()});
} else {
	storage.set({'comp_alg1': "Not Found"});
}

//OCAGPcomp_DemComp[0]
if (document.getElementById("OCAGPcomp_DemComp[0]").checked == true) {
	// total missing hours
	storage.set({'comp_alg1': "Alternative"});
	storage.set({'comp_eng2': "Alternative"});
}

// check if page had error
if (document.title !== "Access Denied") {
	// send message to report to notify completion
	chrome.runtime.sendMessage({type: "pageComplete", page: "gradplan"});
	window.close();
} else {
	window.close();
}
