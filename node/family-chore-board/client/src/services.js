export function getChoreTasks(chore, callback){
	console.log("Entering getChoreTasks in services.js");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let tasks = JSON.parse(this.responseText);
			for (let j=0; j < tasks.length; ++j){
				tasks[j].isCompleted=chore.isCompleted;
				tasks[j].isAssigned=chore.isAssigned;
			}
			chore.tasks=tasks;
			callback(null, chore);
		}
	};
	let endpoint = '/chore/' + chore.choreid + '/tasks';
	console.log('endpoint = ', endpoint);
	xhttp.open('GET', endpoint , true);
	xhttp.send();
}

export function getAssignmentsByCategory(userId, category, callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let chores = JSON.parse(this.responseText);
			for (let i=0; i < chores.length; ++i){
				chores[i].isCompleted=category.isCompleted;
				chores[i].isAssigned=category.isAssigned;
				getChoreTasks(chores[i], callback);
			}
		}
	};
	xhttp.open('GET', '/user/'+ userId + '/category/' + category.id + '/assignments/', true);
	xhttp.send();
}

export function getChore(choreId, callback) {
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

export function getUser(callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let result = JSON.parse(this.responseText);
			console.log('CHORE *', result);
			callback(null, result[0]);
		}
	};
	xhttp.open('GET', '/user/1', true);
	xhttp.send();
}

export function addAccomplishment(assignmentId, taskId, callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let result = JSON.parse(this.responseText);
			console.log('Accomplishment *', result);
			callback(null, result);
		}
	};
	xhttp.open('POST', '/assignment/'+assignmentId+'/task/'+taskId, true);
	xhttp.send();
}
