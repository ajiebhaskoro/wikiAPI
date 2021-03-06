const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.use(express.static("public"));

// App Route

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, results) {
            if (!err) {
                res.send(results);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            if (!err) {
                res.send("Succesfully added an entry");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err, results) {
            if (!err) {
                res.send("Cleared all entries")
            } else {
                res.send(err);
            }
        });
    });

// Specific Article Route

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function (err, results) {
            if (!err) {
                res.send(results);
            } else {
                res.send(err);
            }
        });
    })
    .put(function(req, res){
        Article.replaceOne(
            {title : req.params.articleTitle},
            {title : req.body.title, content : req.body.content},
            {overwrite : true},
            function (err, results){
                if(!err){
                    res.send("Updated One Entry");
                } else {
                    res.send(err);
                }
        });
    })
    .patch(function(req, res){
        Article.updateOne(
            {title : req.params.articleTitle},
            {title : req.body.title, content : req.body.content},
            function (err, results){
                if(!err){
                    res.send("Patched One Entry");
                } else {
                    res.send(err);
                }
        });
    })
    .delete(function (req, res) {
        Article.deleteOne({
            title: req.params.articleTitle
        }, function (err, results) {
            if (!err) {
                res.send("Deleted one entry")
            } else {
                res.send(err);
            }
        });
    });


app.listen(3000, function (req, res) {
    console.log("Server started on port 3000")
});