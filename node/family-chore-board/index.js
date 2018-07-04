const express = require("express");
const PORT = process.env.PORT || 5000
const path = require('path')
const { Pool } = require("pg");
//TODO: fix this
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@choreboard-pg:5432/postgres';
const pool = new Pool({connectionString: connectionString});

// configure express
var app = express();
app.set("port", PORT)
	.set('view engine', 'ejs')
	.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
	.use(express.json())
	// .use(session)
	.use(express.urlencoded( {extended:true} ));

// routing rules
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/public/index.html')))
	.get("/chores/:category/:userId", getChores)
	.get("/tasks/:choreId", getTasks)
	.get("/account-history/:userId", getAccountHistory);

app.post("/user/:id", addUser)
	.post("/login", login)
	.post("/chore/:id", addChore)
	.post("/task/:id", addTask);

app.put("/user/:id", updateUser)
	.put("/chore/:id", updateChore)
	.put("/task/:id", updateTask);

// app.delete("/" logout);

// catchall
// app.all('*', function(req, res))

// start listening
app.listen(app.get("port"), function() {
	console.log("Listening on port" + app.get("port"));
})

//until I get login working I'll just use a global variable
var userId = 1;

function login(req, res) {
	// TODO: Set up Authentication.
	// for now just redirect to the dashboard.
	console.log("Logging in ...");
	res.sendFile(path.join(__dirname+'/public/choreboard.html'))
}

function logout(req, res) {
	// TODO: Log out
	// for now just redirect to the login page.
	console.log("Logging out ...");
	res.sendFile(path.join(__dirname+'/public/index.html'))
}

function getChores(req, res) {
	var category = req.params.category;
	var userId = req.params.userId;
	console.log("category = " + category)
	console.log("userId = " + userId)
	getChoreFromDb(userId, category, function(err, result) {
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: error});
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
	getTasksFromDb(choreId, function(err, result) {
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: error});
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
	getTransactionsFromDb(userId, function(err, result) {
		//TODO the .length check might be false
		if(err || result == null) {
			// the data is false
			res.status(500).json({success: false, data: error});
		} else {
			var accountHistory = result;
			res.status(200).json(accountHistory);
		}
	});
}

function addUser(req, res) {
}

function addChore(req, res) {
}

function addTask(req, res) {
}

function updateUser(req, res) {
}

function updateChore(req, res) {
}

function updateTask(req, res) {
}

function getChoreFromDb(userId, category, callback) {
	console.log("Getting chores from DB...");
	console.log("category = " + category)
	console.log("userId = " + userId)
	// set up the sql
	var select = "SELECT c.name AS name, c.id, u.id As userId FROM users u "
		+ "INNER JOIN chore_assignments ca ON u.id=ca.user_id "
		+ "INNER JOIN chores c ON ca.chore_id=c.id";
	var query;
	var params;
	// handle the difforent category requests
	switch (category) {
		case 'to-do':
			query = select + " WHERE u.id=$1::int ORDER BY c.id"
			params = [userId];
			break;
		case 'done':
			query = select + " WHERE u.id=$1::int ORDER BY c.id"
			params = [userId];
			break;
		case 'unassigned':
			query = "SELECT name, id FROM chores WHERE id NOT IN "
				+ "(SELECT chore_id FROM chore_assignments)";
			break;
		default:
	}
	console.log("query = " + query);

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log("Error in query: ")
			console.log(err)
			callback(err, null);
		}
		// console.log("Found res: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getTasksFromDb(choreId, callback) {
	console.log("Getting tasks from DB...");
	console.log("choreId = " + choreId)
	// set up the sql
	var query = "SELECT t.description AS task, t.id AS taskId, ttc.task_completed AS completed "
		+ "FROM tasks t "
		+ "INNER JOIN task_to_chore ttc ON t.id = ttc.task_id "
		+ "INNER JOIN chores c ON ttc.chore_id = c.id "
		+ "WHERE c.id=$1::int ORDER BY t.id";
	console.log("query = " + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	var params = [choreId];

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log("Error in query: ")
			console.log(err)
			callback(err, null);
		}
		// console.log("Found res: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getTransactionsFromDb(userId, callback) {
	console.log("Getting transactions from DB...");
	console.log("userId = " + userId)
	// set up the sql
	var query = "SELECT date, type, description, amount, new_balance "
		+ "FROM transactions WHERE user_id=$1::int ORDER BY date DESC, id DESC";
	console.log("query = " + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	var params = [userId];

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log("Error in query: ")
			console.log(err)
			callback(err, null);
		}
		// console.log("Found res: " + JSON.stringify(result.rows));
		callback(null, result.rows);
	});

}
