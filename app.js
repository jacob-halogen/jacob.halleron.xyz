#! /usr/bin/env node

const path = require("path")
const fs = require("fs")
const express = require("express")
const app = express()
const marked = require("marked")

app.engine("html", require("ejs").renderFile)

app.use("/css", express.static("public/css"))
app.use("/img", express.static("public/img"))

app.use("/", function (req, res, next) {
	console.log(`${req.method} req from ${req.ip} for ${req.path}`)
	next()
})

function loadContent(id) {
	let md
	let mdPath = path.join(__dirname, "/public/md", id)
	try {
		md = fs.readFileSync(mdPath + ".md").toString()
	} catch (e) {
		if (e.name = "EISDR") {
			md = fs.readFileSync(path.join(mdPath, "index.md")).toString()
			console.info(`${id} is a dir, sending its index.md`)
		} else {
			console.error(error)
		}
	}
	let content = marked.parse(md)
	return {content: content}
}

app.get("/", function (req, res) {
	res.render(path.join(__dirname, "/public/html/index.html"))
})

app.get("/about", function(req, res) {
	res.render(
		path.join(__dirname, "/public/html/post.html"),
		loadContent("about")
	)
})

app.get("/others", function(req, res) {
	res.render(
		path.join(__dirname, "/public/html/post.html"),
		loadContent("others")
	)
})

app.get("/posts:postId(*)", function (req, res) {
	res.render(
		path.join(__dirname, "/public/html/post.html"),
		loadContent("posts/" + req.params.postId)
	)
})

app.listen(80)
console.info("server alive")





