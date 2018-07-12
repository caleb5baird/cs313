function getUserFromDb(userId, callback) {
	console.log("Getting User from DB...");
	console.log("userId = " + userId)
	// set up the sql
	var query = "SELECT id, name, is_admin AS isAdmin, account_balance AS accountBalance, streak "
	+ " FROM users WHERE id=$1::int";
	console.log("query = " + query);
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

function getChoreFromDb(userId, category, callback) {
	console.log("Getting chores from DB...");
	console.log("category = " + category)
	console.log("userId = " + userId)
	// set up the sql
	var select = "SELECT c.name AS name, c.id AS userId, u.id As userId FROM users u "
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
			query = "SELECT id, name, choredough id FROM chores WHERE id NOT IN "
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

// function getChoreFromDb(chore, callback) {
//    let query = 'UPDATE chores c INNER JOIN chore_assignments ca ON c.id=ca.user_id '
//       + 'SET (c.name=$2::varchar(100), c.choredough=$3::real, ca.user_id=$4::int,'
//       + ' assigned=$5::date, unassigned=$6::date) '
//       + 'WHERE c.id=$1::int';
//    let params = [choreId, name, choredough, userId, assignedDate, unassignedDate];
//    pool.query(query, params, function(err, result) {
//       if(err) {
//          console.log("Error in query: ")
//          console.log(err)
//          callback(err, null);
//       }
//       // console.log("Found res: " + JSON.stringify(result.rows));
//       callback(null, result.rows);
//    });
// }

function getTasksFromDb(choreId, callback) {
	console.log("Getting tasks from DB...");
	console.log("choreId = " + choreId)
	// set up the sql
	var query = "SELECT t.description, t.id AS taskId, ttc.task_completed AS completed "
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
	var query = "SELECT date, type, description, amount, newBalance "
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

function addUserToDb(username, password, isAdmin, callback) {
	console.log("Adding User to DB...");
	console.log("Username = " + username);
	console.log("Password = " + password);
	console.log("isAdmin = " + is_admin);
	// set up the sql
	var query = "INSERT INTO users (name, password, is_admin) "
		+ " VALUES ($1::varchar(80), $2::varchar(80), $3::bool)";
	console.log("query = " + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	var params = [username, password, isAdmin];

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

module.export = {
	getUserFromDb: getUserFromDb,
	getChoreFromDb: getChoreFromDb,
	getTasksFromDb: getTasksFromDb,
	addUserToDb: addUserToDb,
	getTransactionsFromDb: getTransactionsFromDb
}
