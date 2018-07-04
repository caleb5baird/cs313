function validateSignUp() {
	var passwords = $(':password')
	if (passwords[0].value == passwords[1].value)
		return true
	else {
		var el = document.getElementById("passwordMatch")
		el.style.visibility = "visible"
		return false
	}
}

function displayLoginError() {
	var el = document.getElementById("loginFailed")
	el.style.visibility = "visible"
}
//check box is checked or un checked
$(document).ready(function() {
	$(':checkbox').click(function() {
		var checkbox = $(this)
		var task = checkbox.parent()
		var taskId = task.attr('id').replace( /^\D+/g, '')
		var tasks = task.parent().children()
		var chore = task.parent().parent()
		var choreId = chore.attr('id').replace( /^\D+/g, '')
		var userId = chore.find(':hidden').attr('value')
		if (checkbox.is(':checked'))
			markTaskDone(checkbox, taskId, choreId)
		else
			markTaskNotDone(checkbox, taskId, choreId)

		if (chore.parent().attr('id') == userId + "-toDo"
					&& chore.find(':checked').length == tasks.length) {
				markChoreDone(chore, choreId, userId)
		}

		//If a chore that is marked as done has a task that is unchecked mark it as not done.
		else if (chore.parent().attr('id') == userId + "-done"
			&& chore.find(':checked').length != tasks.length) {
			markChoreNotDone(chore, choreId, userId, task)
		}
	})
})

//Done is clicked
$(document).ready(function() {
	$('a.button').click(function() {
		var chore = $(this).parent().parent()
		var choreId = chore.attr('id').replace( /^\D+/g, '')
		var userId = chore.find(':hidden').attr('value')
		if (chore.parent().attr('id') == userId + "-toDo") {
			markChoreDone(chore, choreId, userId)
		}
		else if (chore.parent().attr('id') == userId + "-done") {
			markChoreNotDone(chore, choreId, userId)
		}
		else if (chore.parent().attr('id') == userId + "-additionalChores") {
			takeChore(chore, choreId, userId)
		}
	})
})

function markChoreDone(chore, choreId, userId) {
	chore.find('a').toggleClass("done")
	var checkboxes = chore.find(':checkbox:not(:checked)')
	checkboxes.each(function(){
		markTaskDone(this, $(this).attr('id').replace( /^\D+/g, ''), choreId)
	})

	//update Database
	$.ajax({
		type: "POST",
		url: "php/finish-chore.php",
		data: { "choreId": choreId, "userId": userId },
		success: function() {
			$('#' + userId + '-done').append(chore)
		}
	})
}

function markChoreNotDone(chore, choreId, userId, specificTask) {
	chore.find('a').toggleClass("done")
	//if a specific task is provided only mark that task as not done
	if (specificTask)
		markTaskNotDone(specificTask.find(':checkbox'), specificTask.attr('id').replace( /^\D+/g, ), choreId)
	else { //otherwixe mark them all as not done
		var checkboxes = chore.find(':checkbox')
		checkboxes.each(function(){
			// this.checked=false
			markTaskNotDone(this, $(this).attr('id').replace( /^\D+/g, ''), choreId)
		})
	}
	$.ajax({
		type: "POST",
		url: "php/unfinish-chore.php",
		data: { "choreId": choreId, "userId": userId },
		success: function() {
			$('#' + userId + '-toDo').append(chore)
		}
	})
}

function markTaskDone(checkbox, taskId, choreId) {
	checkbox.checked=true

	//update Database
	$.ajax({
		type: "POST",
		url: "php/finish-task.php",
		data: { "taskId": taskId, "choreId": choreId },
		success: function() { } // do nothing
	})
}

function markTaskNotDone(checkbox, taskId, choreId) {
	checkbox.checked=false

	//update Database
	$.ajax({
		type: "POST",
		url: "php/unfinish-task.php",
		data: { "taskId": taskId, "choreId": choreId },
		success: function() { } // do nothing
	})
}

function takeChore(chore, choreId, userId) {
	var button = chore.find('a')
	button.text("Done")

	//update Database
	$.ajax({
		type: "POST",
		url: "php/take-chore.php",
		data: { "choreId": choreId, "userId": userId },
		success: function() {
			$('#' + userId + '-toDo').append(chore)
		}
	})
}

function logout() {

	console.log("Getting chores");

	$.ajax({
			 type: "GET",
			 url: "/chores/1",
			 data: {"userId": 1},
			 success: function() {
				 $('#TODO: insert userId-toDo').append(chore)
			 }
	})
}
