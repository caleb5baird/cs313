var http = require('http')
var url = require('url')

http.createServer(onRequest).listen(8888);

function onRequest(req, res) {
	console.log(req.url);
	console.log(url.parse(req.url).path);
	if (req.url == "/home") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("<h1>Welcome to the Home Page</h1>");
	}
	else if (req.url == "/getData") {
		res.writeHead(200, {"Content-Type": "application/json"});
		res.write('{"name":"Caleb Baird","class":"cs313"}');
	}
	else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write('<h1>Page Not Found</h1>');
	}
	res.end();
}
