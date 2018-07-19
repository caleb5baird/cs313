const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL
	|| 'postgres://postgres:password@choreboard-pg:5432/postgres';
const pool = new Pool({connectionString: connectionString});

function getUserCredentials(name, callback) {

	console.log('Getting credentials for user: ', name, ' from DB...');
	// set up the sql
	var query = 'SELECT id, username, password, is_admin FROM users WHERE username=$1::text'
	console.log('query = ' + query);
	let params = [name];
	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		// console.log('Found res: ' + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getUser(userId, callback) {
	console.log('Getting User from DB...');
	console.log('userId = ' + userId)
	// set up the sql
	var query = 'SELECT id, name, is_admin AS isAdmin, account_balance AS accountBalance, streak '
	+ ' FROM person WHERE id=$1::int';
	console.log('query = ' + query);
	let params = [userId];
	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		// console.log('Found res: ' + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getAssignmentsByCategory(userId, date, category, callback) {
	console.log('Entering getChoresFromDB in dbAccess');
	console.log('Getting chore from DB...');
	console.log('category = ' + category);
	console.log('userId = ' + userId);
	pgDate = pgFormatDate(date);
	console.log('pgDate = ' + pgDate);

	// set up the sql
	var query;
	let params;
	// handle the difforent category requests
	switch (category) {
		case 'to-do':
			query = 'SELECT c.id AS choreId, c.name, a.assigned, a.unassigned FROM chore c '
				+ 'INNER JOIN assignment a ON a.chore_id=c.id AND a.person_id=$1::int '
				+ 'WHERE a.assigned <= $2::date '
				+ 'AND (a.unassigned is NULL OR $2::date < unassigned) ORDER BY c.id';
			params = [userId, pgDate];
			break;
		case 'done':
			// TODO: fix this query
			query = 'SELECT name, chore_id FROM chores_done_by_person WHERE person_id = $1::int'
			params = [userId];
			break;
		case 'unassigned':
			query = 'SELECT c.id, c.name FROM chore c LEFT OUTER JOIN assignment a '
				+ 'ON c.id=a.chore_id AND a.assigned <= $1::date '
				+ 'AND (a.unassigned is NULL OR $1::date < unassigned) '
				+ 'WHERE a.id IS NULL ORDER BY c.id'
			params = [pgDate];
			break;
		default:
			let error = 'Incorrect category: ' + category;
			console.log(error);
			callback(error, null);
			return;
	}
	console.log('query = ' + query);

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		// console.log('Found res: ' + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getChore(choreId, callback) {
	var query = 'SELECT name, id AS choreId FROM chore WHERE id=$1::int'
	let params = [choreId];
	pool.query(query, params, function(err, result) {
			if(err) {
				console.log('Error in query: ')
				console.log(err)
				callback(err, null);
			}
			callback(null, result.rows);
	});
}

function getChoreTasks(choreId, date, callback) {
	console.log('Entering getChoreTasks in dbAccess');
	console.log('Getting task from DB...');
	console.log('choreId = ' + choreId)
	pgDate = pgFormatDate(date);
	console.log('pgDate = ' + pgDate);

	//TODO:: figure out how to return weather the task is completed or not.
	// set up the sql
	var query = 'SELECT t.description, t.id AS taskId, tc.task_minute_estimate, '
		+ 'tc.time_estimate_is_fixed, tc.linked, tc.unlinked '
		+ 'FROM task t '
			+ 'INNER JOIN chore_task tc ON t.id = tc.task_id '
			+ 'INNER JOIN chore c ON tc.chore_id = c.id '
		+ 'WHERE 1=1 '
			+ 'AND c.id=$1::int '
			+ 'AND tc.linked <= $2::date '
			+ 'AND (tc.unlinked is NULL OR $2::date < unlinked) '
		+ 'ORDER BY t.id';
	console.log('query = ' + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	let params = [choreId, pgDate];

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		// console.log('Found res: ' + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

function getTransactions(userId, callback) {
	console.log('Getting transaction from DB...');
	console.log('userId = ' + userId)
	// set up the sql
	var query = 'SELECT transaction_date, transaction_type, description, amount, new_balance '
		+ 'FROM transaction WHERE person_id=$1::int ORDER BY transaction_date DESC, id DESC';
	console.log('query = ' + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	let params = [userId];

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		// console.log('Found res: ' + JSON.stringify(result.rows));
		callback(null, result.rows);
	});

}

function addUserToDb(username, password, isAdmin, callback) {
	console.log('Adding User to DB...');
	console.log('Username = ' + username);
	console.log('Password = ' + password);
	console.log('isAdmin = ' + isAdmin);
	// set up the sql
	var query = 'INSERT INTO person (name, password, is_admin) '
		+ ' VALUES ($1::varchar(80), $2::varchar(80), $3::bool)';
	console.log('query = ' + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	let params = [username, password, isAdmin];

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		// console.log('Found res: ' + JSON.stringify(result.rows));
		callback(null, result.rows);
	});
}

/******************************************************************************\
 * convert js dates to pq dates
\******************************************************************************/
function pgFormatDate(date) {
	/* Via http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date */
	function zeroPad(d) {
		return ("0" + d).slice(-2)
	}

	var parsed = new Date(date)

	return [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate())].join("-");
}

module.exports = {
	getUser: getUser,
	getAssignmentsByCategory: getAssignmentsByCategory,
	getChore: getChore,
	getChoreTasks: getChoreTasks,
	addUserToDb: addUserToDb,
	getTransactions: getTransactions
}
