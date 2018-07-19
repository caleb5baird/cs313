function getChoreTasks(choreId, callback){
	console.log("Entering getChoreTasks in services.js");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let result = JSON.parse(this.responseText);
			console.log('TASKS', result);
			callback(null, result);
		}
	};
	let endpoint = '/chore/' + choreId + '/tasks';
	console.log('endpoint = ', endpoint);
	xhttp.open('GET', endpoint , true);
	xhttp.send();
}

function getAssignmentsByCategory(userId, category, callback){
	console.log("Entering getAssignmentsByCategory in services.js");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let result = JSON.parse(this.responseText);
			console.log('CHORES', result);
			callback(null, result);
		}
	};
	xhttp.open('GET', '/user/'+ userId + '/category/' + category + '/assignments/', true);
	xhttp.send();
}

function getChore(choreId, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let result = JSON.parse(this.responseText);
			console.log('CHORE *', result);
			callback(null, result);
		}
	};
	xhttp.open('GET', '/chore/'+ choreId, true);
	xhttp.send();
}

function getUser(callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let result = JSON.parse(this.responseText);
			console.log('CHORE *', result);
			callback(null, result);
		}
	};
	xhttp.open('GET', '/user/1', true);
	xhttp.send();
}
