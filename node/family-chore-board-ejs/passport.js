const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy((username, password, callback) => {
	dbAccess.getUserCredentials(username, (err, result) => {
		if(err) {
			winston.error('Error when selecting user on login', err)
			return callback(err)
		}

		if(result.rows.length > 0) {
			const first = result.rows[0]
			bcrypt.compare(password, first.password, function(err, res) {
				if(res) {
					callback(null, { id: first.id, username: first.username, type: first.type })
				} else {
					callback(null, false)
				}
			})
		} else {
			callback(null, false)
		}
	})
}))

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser((id, callback) => {
	dbAccess.getUser(id, (err, results) => {
		if(err) {
			winston.error('Error when selecting user on session deserialize', err)
			return callback(err)
		}
		callback(null, results.rows[0])
	})
})

