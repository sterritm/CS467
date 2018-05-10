//const express = require("express");
//const app = express();

//app.use((req, res, next) => {
//	res.status(200).json({
//		message: "It Works"
//	});
//});

//module.exports = app;

const express = require("express");

const app = express();
const handlebars = require("express-handlebars").create({ defaultLayout: "main" });
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));	//for serving static files

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 8080);

app.get("/", function (req, res) {
	res.render("index");
	//res.send("hello world");
});

app.get("/force", function (req, res) {
	res.render("force");
});

app.get("/results", function (req, res) {
	res.render("results");
});

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

//const server = app.listen(8080, () => {
//	const host = server.address().address;
//	const port = server.address().port;

//	console.log(`Example app listening at http://${host}:${port}`);
//});