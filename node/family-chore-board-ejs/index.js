const express = require('express');
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 5050
const path = require('path')

// custom modules
const dbAccess = require('./db-access.js');

// configure express
var app = express();
app .get('/', (req, res) => res.render('pages/index'));
app
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.set('port', PORT)
;

app
	.use(express.static(path.join(__dirname, 'public')))
	.use(express.urlencoded( {extended:true} ))
	.use(express.json())
	.use(session({
		secret: 'bicodetech',
		resave: false,
		saveUninitialized: false
	}))
	.use(passport.initialize())
	.use(passport.session())
;

/******************************************************************************\
 * routing rules I have listed all of the endpoints that I can think of but
 * I only have stub functions for the endpoints that I am not useing yet.
\******************************************************************************/
app
	.get('/login-page', (req, res) => res.render('pages/login-page'))
	.get('/choreboard', (req, res) => res.render('pages/choreboard'))
	.get('/users', getUsers)
	.get('/user/:userId', getUser)
	.get('/user/:userId/account-history', getAccountHistory)
	.get('/user/:userId/transaction/:transactionId', getTransaction)
	.get('/user/:userId/category/:category/assignments', getAssignmentsByCategory)
	.get('/user/:userId/assignments', getAssignmentsByUser)
	.get('/assignments', getAssignments)
	.get('/assignment/:assignmentId', getAssignment)
	.get('/user/:userId/assignment/:choreId', getAssignment)
	.get('/chores', getChores)
	.get('/chore/:choreId', getChore)
	.get('/chore/:choreId/tasks', getChoreTasks)
	.get('/chore-task/:choreTaskId', getChoreTask)
	.get('/tasks', getTasks)
	.get('/task/:taskId', getTask)
;

app
	.post('/login', passport.authenticate('local'), (req, res) => res.render('pages/choreboard'))
	.post('/logout', logout)
	.post('/user', addUser)
	.post('/chore', addChore)
	.post('/task', addTask)
	.post('/user/:userId/chore', addAssignment)
	.post('/chore/:choreId/task', addChoreTask)
;

app
	.put('/user/:userId', updateUser)
	.put('/user/:userId/chore/:choreId', updateAssignment)
	.put('/assignment/:assignmentId', updateAssignment)
	.put('/chore/:choreId', updateChore)
	.put('/chore/:choreId/task/:taskId', updateChoreTask)
	.put('/chore-task/:choreTaskId', updateChoreTask)
	.put('/task/:taskId', updateTask)
;

/******************************************************************************\
 * start listening
\******************************************************************************/
app.listen(app.get('port'), function() {
	console.log('Listening on port' + app.get('port'));
});

function renderIndex(req, res){
	console.log('Entering funtion renderIndex')
	res.render('pages/index')
}

//until I get login working I'll just use a global variable
var userId = 1;

/*############################################################################*\
 *# GETTER FUNCTIONS
\*############################################################################*/
function getUsers(req, res) {
}

function getUser(req, res) {
	var userId = req.params.userId;
	console.log('userId = ' + userId)
	console.log('caleb = ' + userId)
	console.log('dbAccess: ', dbAccess);
	dbAccess.getUser(userId, function(err, result) {
		if(err || result === null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var user = result;
			res.status(200).json(user);
			console.log('user json from getUser in index.js', user);
		}
	});
}

function getAssignmentsByCategory(req, res) {
	console.log('Entering getAssignmentsByCategory in index.js');
	let category = req.params.category;
	let userId = req.params.userId;
	let date = req.query.date || Date.now();
	console.log('category = ' + category)
	console.log('userId = ' + userId)
	console.log('date = ' + date)
	dbAccess.getAssignmentsByCategory(userId, date, category, function(err, result) {
		if(err || result === null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var chores = result;
			res.status(200).json(chores);
			console.log('chores json from getAssignmentsByCategory in index.js', chores);
		}
	});
}

function getAssignmentsByUser(req, res) {
}

function getAssignments(req, res) {
	// console.log('Entering getAssignments in index.js');
	// let userId = req.params.userId;
	// let date = req.query.date || Date.now();
	// console.log('userId = ' + userId)
	// console.log('date = ' + date)
	// dbAccess.getAssigments(userId, date, function(err, result) {
	//   if(err || result === null) {
	//     // the data is false
	//     res.status(500).json({success: false, data: err});
	//   } else {
	//     var chores = result;
	//     res.status(200).json(chores);
	//     console.log('chores json from getAssignments in index.js', chores);
	//   }
	// });
}

function getAssignment(req, res) {
	// console.log('Entering getAssignment in index.js');
	// // ther are two ways to get to this function I will either have the
	// // assignmentId or both the user and chore id's
	// let assignmentId = req.params.assignmentId;
	// let userId = req.params.userId;
	// let choreId = req.params.choreId;
	// let date = req.query.date || Date.now();
	// console.log('assignmentId = ' + assignmentId)
	// console.log('userId = ' + userId)
	// console.log('choreId = ' + choreId)
	// console.log('date = ' + date)
	// dbAccess.getAssigment(assignmentId, userId, choreId, date, function(err, result) {
	//   if(err || result === null) {
	//     // the data is false
	//     res.status(500).json({success: false, data: err});
	//   } else {
	//     var chores = result;
	//     res.status(200).json(chores);
	//     console.log('chores json from getAssignment in index.js', chores);
	//   }
	// });
}

function getChores(req, res) {
}

function getAccountHistory(req, res) {
	var userId = req.params.userId;
	console.log('userId = ' + userId)
	dbAccess.getTransactions(userId, function(err, result) {
		//TODO the .length check might be false
		if(err || result === null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var accountHistory = result;
			res.status(200).json(accountHistory);
		}
	});
}

function getTransaction(req, res) {
}

function getChore(req, res) {
	let choreId = req.params.choreId;
	console.log('choreId = ' + choreId);
	dbAccess.getChore(choreId, function(err, result) {
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var chore = result;
			res.status(200).json(chore);
			console.log(chore);
		}
	});
}

function getChoreTasks(req, res) {
	console.log('Entering getChoreTasks in index.js');
	let choreId = req.params.choreId;
	let date = req.query.date || Date.now();
	console.log('choreId = ', choreId)
	console.log('date = ', date)
	dbAccess.getChoreTasks(choreId, date, function(err, result) {
		if(err || result === null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var tasks = result;
			res.status(200).json(tasks);
			console.log('Tasks json from getChoreTasks in index.js', tasks);
		}
	});
}

function getChoreTask(req, res) {
}

function getTask(req, res) {
}

function getTasks(req, res) {
}

/*############################################################################*\
 *# POST FUNCTIONS
\*############################################################################*/
function login(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if(!req.session.username){
		req.session.username = username;
		console.log('setting username to: ', req.session.username)
		res.locals.username = username;
		res.render('pages/choreboard');
	} else {
		res.locals.failedLogin = true;
		res.render('pages/login-page');
		console.log('failed username = ', username)
		console.log('failed password = ', password)
	}
	console.log('Logging in ...');
}

function logout(req, res) {
	// TODO: Log out
	// for now just redirect to the login page.
	console.log('Logging out ...');
	res.sendFile(path.join(__dirname+'/public/index.html'))
}

function addUser(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	let isAdmin  = req.body.isAdmin;
	console.log('Username = ' + username);
	console.log('Password = ' + password);
	console.log('isAdmin = ' + isAdmin);
	dbAccess.addUserToDb(username, password, isAdmin, function(err, result) {
		if(err || result === null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var user = result;
			res.status(200).json(user);
		}
	});
}

function addChore(req, res) {
	// let username = req.body.username;
	// let password = req.body.password;
	// let isAdmin  = req.body.isAdmin;
	// console.log('Username = ' + username);
	// console.log('Password = ' + password);
	// console.log('isAdmin = ' + isAdmin);
	// dbAccess.addUserToDb(username, password, isAdmin, function(err, result) {
	//   if(err || result === null) {
	//     // the data is false
	//     res.status(500).json({success: false, data: err});
	//   } else {
	//     var user = result;
	//     res.status(200).json(user);
	//   }
	// });
}

function addTask(req, res) {
}

function addAssignment(req, res) {
}

function addChoreTask(req, res) {
}

/*############################################################################*\
 *# PUT FUNCTIONS
\*############################################################################*/
function updateUser(req, res) {
}

function updateChore(req, res) {
	// let chore = {
	//   'choreId': req.params.choreId,
	//   'name': req.body.name,
	// }
	// dbAccess.updateChoreInDb(chore, function(err, updatedChore) {
	//   if(err || updatedChore === null) {
	//     res.status(500).json({success: false, data: err});
	//   } else {
	//     var updatedChore = result;
	//     res.status(200).json(updatedChore);
	//   }
	// });
}

function updateAssignment(req, res) {
		// 'choredough': req.body.choredough,
		// 'userId': req.body.userId,
		// 'assignedDate': req.body.assignedDate,
		// 'unassignedDate': req.body.unassignedDate,
}

function updateChoreTask(req, res) {
}

function updateTask(req, res) {
}

