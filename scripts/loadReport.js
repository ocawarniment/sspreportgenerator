
// shortcut for local storage
var storage = chrome.storage.local;

storage.get('currentReport', function(result) {
	var localArray = result;
	console.log(localArray);
	alert(result['studentName'] + "_" + result['currentMeeting']);	

	alert(result['studentName']);
	
	document.getElementById('studentName').innerText = result['studentName'];
	document.getElementById('caretakerName').innerText = result['caretakerName'];
	document.getElementById('currentGrade').innerText = result['currentGrade'];
	document.getElementById('startYear').innerText = result['startYear'];
	document.getElementById('cohortYear').innerText = result['cohortYear'];
	document.getElementById('credits').innerText = result['comp_alg1'];
	document.getElementById('comp_alg1').innerText = result['comp_alg1'];
	document.getElementById('comp_eng2').innerText = result['comp_eng2'];

	document.getElementById('gradebook').innerHTML = result['gradebook'];
	document.getElementById('overdueLessons').innerText = result['overdueLessons'];
	document.getElementById('lastLesson').innerText = result['lastLesson'];
	document.getElementById('lastAssessment').innerText = result['lastAssessment'];
	document.getElementById('postGradPlans').innerText = result['postGradPlans'];
	document.getElementById('daysAbsent').innerText = result['daysAbsent'];
	document.getElementById('missingHours').innerText = result['missingHours'];
	document.getElementById('strengthsPLP').innerText = result['strengthsPLP'];
	document.getElementById('goalsPLP').innerText = result['goalsPLP'];
	document.getElementById('interestsPLP').innerHTML = result['interestsPLP'];

	// display all contact numbers
	var contactsStack = '';
	for(var i=0; i<result['contactNumbers'].length; i++){
		contactsStack = contactsStack + result.contactNumbers[i];
		if(i+1 !== result['contactNumbers'].length) { 
			// add a line break too 
			contactsStack = contactsStack + '\n';
		}
	}
	console.log(contactsStack);
	document.getElementById('contactNumbers').innerText = contactsStack;
});