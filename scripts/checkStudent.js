// shortcut for local storage
var storage = chrome.storage.local;

var error;
error = false;

checkID();
checkLogin();

if (error == true) {window.close();}

function checkID() {
	try {
		// Check for access denied
		var headerText;
		headerText = document.getElementById('pageTitleHeaderTextSpan').innerText.trim();
		if (headerText == "Access Denied") {
			// send message to close background.html
			alert("No student found! Please check the ID number.");
			chrome.runtime.sendMessage({type: "endEarly"});
			error = true;
		}
	} catch(err) { }
}

function checkLogin() {
	// Check for login form
	var loginForm;
	loginForm = document.getElementById("loginOptions");
	if ( loginForm !== null ) {
		alert("Please login to Connexus first!");
		// send message to end early
		chrome.runtime.sendMessage({type: "endEarly"});
		error = true;
	}
}

