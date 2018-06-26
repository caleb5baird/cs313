const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/calculate-mail', calculateRate)

function calculateRate(req, res) {
	var weight = req.query["weight"];
	var mailType = req.query["mailType"];
	console.log(weight);
	console.log(mailType);
	switch (mailType) {
		case 'Letters(Stamped)':
			var rate = stampedLettersRate(weight);
			break;
		case 'Letters(Metered)':
			var rate = meteredLettersRate(weight);
			break;
		case 'Large Envelopes(Flats)':
			var rate = flatsRate(weight);
			break;
		case 'First-Class Package Service—Retail':
			var rate = packageRate(weight);
			break;
		default:
			var rate;
	}

	res.locals.rate = rate;
	res.render('pages/postal-rate');
}

/**********************************************************************\
 * returns the rate of a stamped letter based on the wieght.
 * 	returns undefined if the weight is not valid
\**********************************************************************/
function stampedLettersRate(weight) {
	var rate;
	if (0 < weight && weight <= 1)
		rate = .5;
	else if (weight <= 2)
		rate = .71;
	else if (weight <= 3)
		rate = .92;
	else if (weight <= 3.5)
		rate = 1.13;
	return rate;
}

/**********************************************************************\
 * returns the rate of a metered letter based on the wieght.
 * 	returns undefined if the weight is not valid
\**********************************************************************/
function meteredLettersRate(weight) {
	var rate;
	if (0 < weight && weight <= 1)
		rate = .47;
	else if (weight <= 2)
		rate = .68;
	else if (weight <= 3)
		rate = .89;
	else if (weight <= 3.5)
		rate = 1.1;
	return rate;
}

/**********************************************************************\
 * returns the rate of a large envelope (Flats) based on the wieght.
 * 	returns undefined if the weight is not valid
\**********************************************************************/
function flatsRate(weight) {
	var rate;
	if (0 < weight && weight <= 1)
		rate = 1;
	else if (weight <= 2)
		rate = 1.2;
	else if (weight <= 3)
		rate = 1.42;
	else if (weight <= 4)
		rate = 1.63;
	else if (weight <= 5)
		rate = 1.84;
	else if (weight <= 6)
		rate = 2.05;
	else if (weight <= 7)
		rate = 2.26;
	else if (weight <= 8)
		rate = 2.47;
	else if (weight <= 9)
		rate = 2.68;
	else if (weight <= 10)
		rate = 2.89;
	else if (weight <= 11)
		rate = 3.1;
	else if (weight <= 12)
		rate = 3.31;
	else if (weight <= 13)
		rate = 3.52;
	return rate;
}

/**********************************************************************\
 * returns the rate of a first-class package based on the wieght.
 * 	returns undefined if the weight is not valid
\**********************************************************************/
function packageRate(weight) {
	var rate;
	if (0 < weight && weight <= 4)
		rate = 3.5;
	else if (weight <= 8)
		rate = 3.75;
	else if (weight <= 9)
		rate = 4.1;
	else if (weight <= 10)
		rate = 4.45;
	else if (weight <= 11)
		rate = 4.8;
	else if (weight <= 12)
		rate = 5.15;
	else if (weight <= 13)
		rate = 5.5;
	return rate;
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
