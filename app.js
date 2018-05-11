const express = require("express");

const app = express();
const handlebars = require("express-handlebars").create({ defaultLayout: "main" });
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));	//for serving static files

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 8080);

app.post("/results", function (req, res) {

	var payload = { page: null, method: null, limit: 2, keyword: null };
	payload.page = req.body.page;
	payload.limit = parseInt(req.body.limit);
	payload.method = req.body.method;
	payload.keyword = req.body.keyword;
	console.log(JSON.stringify(payload));
	//send json to server
	//var request = new XMLHttpRequest();
	//request.open('POST', 'http://cs467-test-server.appspot.com', false);
	//request.setRequestHeader('Content-Type', 'application/json');
	//request.send(JSON.stringify(payload));
	//var response = JSON.parse(request.responseText);
	//console.log(request.responseText);

	var response = '{"start": "0", "cookie": "test", "URLs": {"0": {"found": false, "edges": ["1"], "title": "title0"}, "1": {"found": false, "edges": [], "title": "title1"}}}';
	//if (response && request.status == 200) {
	if (response) {
		console.log(response);
		res.render("force", { "jsonObj": response });
	} else {
		alert('Error!');
	}


});

app.get("/", function (req, res) {
	res.render("index");
});

app.get("/force", function (req, res) {
	res.render("force");
});

//app.get("/results", function (req, res) {
//	res.render("results");
//});

app.get("/practice", function (req, res) {
	res.render("practice");
});

app.get("/llprac", function (req, res) {
	res.render("llprac");
});

app.use(function (req, res) {
	res.status(404);
	res.render("404");
});

//error handler function
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.type("plain/text");
	res.status(500);
	res.render("500");
});

app.listen(app.get("port"), function () {
	console.log('Express started on http://localhost:' + app.get("port"));
});
