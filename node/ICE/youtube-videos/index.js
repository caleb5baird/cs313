var express = require("express");
var app = express();

app.set("port", 5000);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded( {extended:true} ));

app.get("/video/:id", getVideo);
app.get("/tags", getTags);
app.post("/video", postVideo);

app.listen(app.get("port"), function() {
	console.log("Listening on port" + app.get("port"));
});


function getVideo(req, res) {
	console.log("Getting video ... ");
	var id = req.params.id;
	console.log("Looking for video with id:" + id);

	// TODO: get the video from the DB here...
	var result = {title: "Charley bit my finger",
						id: id,
						link: "https://www.youtube.com/watch?v=_OBlgSz9sSM"};
	res.json(result);
}

function getTags(req, res) {
	console.log("Getting tags ... ");
	// var id = req.query.id;
	// console.log("Looking for video with id:" + id);

	// TODO: get the video from the DB here...
		var result = [{id: 1, name: "comedy"},
			{id: 1, name: "comedy"},
			{id: 2, name: "cat videos"},
			{id: 3, name: "action"}]

	res.json(result);
}

function postVideo(req, res) {
	console.log("Posting video ... ");
	var title = req.body.title;
	console.log("video title = " + title);

}
