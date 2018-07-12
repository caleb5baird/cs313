const express = require("express");
const PORT = process.env.PORT || 5000
const path = require('path')
const session = require('express-session');
const { Pool } = require("pg");
const pool = new Pool({connectionString: connectionString});
const connectionString = process.env.DATABASE_URL
	|| 'postgres://postgres:password@choreboard-pg:5432/postgres';

// custom modules
const dbAccess = require('./db-access.js');

// configure express
var app = express();
app
	.set('views', path.join(__dirname, 'views'))
	.set("port", PORT)
;

app
	.use(express.static(path.join(__dirname, 'public')))
	.use(express.urlencoded( {extended:true} ))
	.use(express.json())
	.use(session({
		secret: 'bicodetech',
		resave: false,
		saveUninitialized: true
	}))
;

/******************************************************************************\
 * routing rules
\******************************************************************************/
app
	.get("/user/:userId", getUser)
	.get("/user/:userId/chores/:category", getChores)
	.get("/chore/:choreId/tasks/", getTasks)
	.get("/user/:userId/account-history", getAccountHistory)
;

app
	.post("/users", addUser)
	.post("/login", login)
	.post("/logout", logout)
	.post("/chores", addChore)
	.post("/chore/:choreId/tasks", addTask)
;

app
	.put("/users/:userId", updateUser)
	.put("/chore/:choreId", updateChore)
	.put("/chore/:choreId/task/:taskId", updateTask)
;


/******************************************************************************\
 * start listening
\******************************************************************************/
app.listen(app.get("port"), function() {
	console.log("Listening on port" + app.get("port"));
});


//until I get login working I'll just use a global variable
var userId = 1;

/******************************************************************************\
 * route functions
\******************************************************************************/
function login(req, res) {
	// TODO: Set up Authentication.
	let username = req.body.username;
	let password = req.body.password;
	if(!req.session.username){
		req.session.username = username;
		console.log("setting username to: ", req.session.username)
		res.sendFile(path.join(__dirname+'/public/choreboard.html'))
		res.status(200).json({success: true});
	} else {
		res.status(500).json({success: false});
		console.log("failed username = ", username)
		console.log("failed password = ", password)
	}
	// for now just redirect to the dashboard.
	console.log("Logging in ...");
}

function logout(req, res) {
	// TODO: Log out
	// for now just redirect to the login page.
	console.log("Logging out ...");
	res.sendFile(path.join(__dirname+'/public/index.html'))
}

function getUser(req, res) {
	var userId = req.params.userId;
	console.log("userId = " + userId)
	dbAccess.getUserFromDb(userId, function(err, result) {
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var chores = result;
			res.status(200).json(chores);
			console.log(chores);
		}
	});
}

function getChores(req, res) {
	var category = req.params.category;
	var userId = req.params.userId;
	console.log("category = " + category)
	console.log("userId = " + userId)
	dbAccess.getChoreFromDb(userId, category, function(err, result) {
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var chores = result;
			res.status(200).json(chores);
			console.log(chores);
		}
	});
}

function getTasks(req, res) {
	var choreId = req.params.choreId;
	console.log("choreId = " + choreId)
	dbAccess.getTasksFromDb(choreId, function(err, result) {
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var tasks = result;
			res.status(200).json(tasks);
			console.log(tasks);
		}
	});
}

function getAccountHistory(req, res) {
	var userId = req.params.userId;
	console.log("userId = " + userId)
	dbAccess.getTransactionsFromDb(userId, function(err, result) {
		//TODO the .length check might be false
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var accountHistory = result;
			res.status(200).json(accountHistory);
		}
	});
}

function addUser(req, res) {
	var username = req.query.username;
	var password = req.query.password;
	var isAdmin  = req.query.isAdmin;
	console.log("Username = " + username);
	console.log("Password = " + password);
	console.log("isAdmin = " + isAdmin);
	dbAccess.addUserToDb(username, password, isAdmin, function(err, result) {
		//TODO the .length check might be false
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: err});
		} else {
			var user = result;
			res.status(200).json(user);
		}
	});
}

function addChore(req, res) {
}

function addTask(req, res) {
}

function updateUser(req, res) {
}

function updateChore(req, res) {
	let chore = {
		choreId : req.params.choreId,
		name : req.body.name,
		choredough : req.body.choredough,
		userId : req.body.userId,
		assignedDate : req.body.assignedDate,
		unassignedDate : req.body.unassignedDate,
	}
	dbAccess.updateChoreFromDb(chore, function(err, updatedChore) {
		if(err || updatedChore == null) {
			res.status(500).json({success: false, data: err});
		} else {
			var updatedChore = result;
			res.status(200).json(updatedChore);
		}
	});
}

function updateTask(req, res) {
}

