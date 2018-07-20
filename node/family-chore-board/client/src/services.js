export function getAssignmentsByCategory(userId, category){
	return new Promise((resolve, reject) => {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					let chores = JSON.parse(this.responseText);
					let promises = [];
					for (let i=0; i < chores.length; ++i){
						chores[i].isCompleted=category.isCompleted;
						chores[i].isAssigned=category.isAssigned;
						promises.push(getChoreTasks(chores[i]));
					}
					Promise.all(promises)
						.then(() => resolve(chores))
						.catch(reject);
				} else if (this.status !== 200) {
					reject(this.status);
				}
			}
		};
		console.log(category);
		xhttp.open('GET', '/user/'+ userId + '/category/' + category.id + '/assignments/', true);
		xhttp.send();
	});
}

export function getChoreTasks(chore){
	return new Promise((resolve, reject) => {
		console.log("Entering getChoreTasks in services.js");
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					let tasks = JSON.parse(this.responseText);
					chore.tasks=tasks;
					resolve(chore);
				} else if (this.status !== 200) {
					reject(this.status);
				}
			}
		};
		let endpoint = '/chore/' + chore.choreid + '/tasks/' + chore.assignmentid;
		console.log('endpoint = ', endpoint);
		xhttp.open('GET', endpoint , true);
		xhttp.send();
	});
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
			console.log('Assignment *', result);
			callback(null, result);
		}
	};
	xhttp.open('POST', '/assignment/'+assignmentId+'/task/'+taskId, true);
	xhttp.send();
}

export function addAssignment(userId, choreId){
	return new Promise((resolve, reject) => {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4 ) {
				if(this.status === 200){
					let result = JSON.parse(this.responseText);
					console.log('Accomplishment *', result);
					resolve(result);
				} else {
					reject(this.status);
				}

			}
		};
		xhttp.open('POST', '/user/'+userId+'/chore/'+choreId, true);
		xhttp.send();
	});
}

export function removeAccomplishment(assignmentId, taskId, callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let result = JSON.parse(this.responseText);
			console.log('Accomplishment *', result);
			callback(null, result);
		}
	};
	xhttp.open('DELETE', '/assignment/'+assignmentId+'/task/'+taskId, true);
	xhttp.send();
}
