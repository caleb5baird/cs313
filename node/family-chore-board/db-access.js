const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL
	|| 'postgres://postgres:password@choreboard-pg:5432/postgres';
const pool = new Pool({connectionString: connectionString});

function getUserFromDb(userId, callback) {
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

function getAssignmentsByCategoryFromDb(userId, date, category, callback) {
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
			query = 'SELECT c.id AS choreid, a.id AS assignmentid, c.name, a.assigned, a.unassigned FROM chore c '
				+ 'INNER JOIN assignment a ON a.chore_id=c.id AND a.person_id=$1::int '
				+ 'LEFT OUTER JOIN chores_done_by_person cdbp on cdbp.chore_id=c.id '
				+ 'WHERE a.assigned <= $2::date '
				+ 'AND cdbp.chore_id IS NULL '
				+ 'AND (a.unassigned is NULL OR $2::date < unassigned) ORDER BY c.id';
			params = [userId, pgDate];
			break;
		case 'done':
			// TODO: fix this query
			query = 'SELECT name, cdbp.chore_id AS choreid, a.id AS assignmentid FROM chores_done_by_person cdbp '
			+ 'INNER JOIN assignment a ON a.chore_id=cdbp.chore_id AND a.person_id=cdbp.person_id '
			+ 'WHERE a.person_id = $1::int'
			params = [userId];
			break;
		case 'unassigned':
			query = 'SELECT c.id as choreid, c.name FROM chore c LEFT OUTER JOIN assignment a '
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

function getChoreFromDb(choreId, callback) {
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

function getChoreTasksFromDb(choreId, date, assignmentId, callback) {
	console.log('Entering getChoreTasksFromDb in dbAccess');
	console.log('Getting task from DB...');
	console.log('choreId = ' + choreId)
	pgDate = pgFormatDate(date);
	console.log('pgDate = ' + pgDate);

	let params = [choreId, pgDate];
	let assignmentJoin = '';
	let assignmentWhere = '';
	let assignmentSelect= '';
	console.log('assignmentId = ', assignmentId);
	if(assignmentId && assignmentId !== 'undefined'){
		params.push(assignmentId);
		assignmentSelect = ', a.id AS isCompleted '
		assignmentJoin = 'LEFT JOIN accomplishment a ON a.task_id=t.id AND a.assignment_id=$3::int ';
	}
	var query = 'SELECT t.description, t.id AS taskId, tc.task_minute_estimate, '
		+ 'tc.time_estimate_is_fixed, tc.linked, tc.unlinked ' + assignmentSelect
		+ 'FROM task t '
			+ 'INNER JOIN chore_task tc ON t.id = tc.task_id '
			+ 'INNER JOIN chore c ON tc.chore_id = c.id '
			+ assignmentJoin
		+ 'WHERE 1=1 '
			+ 'AND c.id=$1::int '
			+ 'AND tc.linked <= $2::date '
			+ 'AND (tc.unlinked is NULL OR $2::date < unlinked) '
		+ 'ORDER BY t.id';
	console.log('query = ' + query);
	// populate the parameteres we wil use to fill the placehoders in the query

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

function getTransactionsFromDb(userId, callback) {
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

function addAccomplishment(assignmentId, taskId, callback) {
	console.log('Adding accomplishment to DB...');
	console.log('assignmentId = ' + assignmentId);
	console.log('taskId = ' + taskId);
	// set up the sql
	var query = 'INSERT INTO accomplishment (assignment_id, task_id) '
		+ 'VALUES ($1::int, $2::int)';
	console.log('query = ' + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	let params = [assignmentId, taskId];
	console.log('params: [',assignmentId,taskId,']');

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		callback(null, result.rows);
	});
}

function addAssignment(userId, choreId, callback) {
	console.log('Adding assignment to DB...');
	console.log('userId = ' + userId);
	console.log('choreId = ' + choreId);
	// set up the sql
	var query = 'INSERT INTO assignment (person_id, chore_id) '
		+ 'VALUES ($1::int, $2::int) RETURNING id ';
	console.log('query = ' + query);
	// populate the parameteres we wil use to fill the placehoders in the query
	let params = [userId, choreId];

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
		callback(null, result.rows);
	});
}

function addUser(username, password, isAdmin, callback) {
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

function removeAccomplishment(assignmentId, taskId, callback) {
	console.log('Removeing accomplishment to DB...');
	console.log('assignmentId = ' + assignmentId);
	console.log('taskId = ' + taskId);
	// set up the sql
	var query = 'DELETE FROM accomplishment WHERE assignment_id=$1::int AND task_id=$2::int'
	console.log('query = ' + query);
	let params = [assignmentId, taskId];
	console.log('params: [',assignmentId,taskId,']');

	// make the database request
	pool.query(query, params, function(err, result) {
		if(err) {
			console.log('Error in query: ')
			console.log(err)
			callback(err, null);
		}
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
	getUserFromDb: getUserFromDb,
	getAssignmentsByCategoryFromDb: getAssignmentsByCategoryFromDb,
	getChoreFromDb: getChoreFromDb,
	getChoreTasksFromDb: getChoreTasksFromDb,
	addUser: addUser,
	addAccomplishment: addAccomplishment,
	addAssignment: addAssignment,
	removeAccomplishment: removeAccomplishment,
	getTransactionsFromDb: getTransactionsFromDb
}
