		// Code to get values from sotrage
		storage.get(null, function(variables) {
			storage.get(null, function(result) {
				console.log(result);
			});
			// Attempt to pull from local storage LOOK AT CONSOLE
			var reportName = "SSP" + variables.studentID  + formatDate(document.getElementById("currentMeetingDate").value);
			storage.get([reportName], function(result) {
				var localArray = result;
				console.log(localArray);
				alert(result[reportName]['studentName'] + " Report Stored!");
			});
		});