const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser : true});

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Article = mongoose.model("Article", articleSchema);

app.use(express.static("public"));

app.get("/articles", function(req, res){
   Article.find(function(err, results){
       if(!err){
           res.send(results);
       } else {
           res.send(err);
       }
   }) 
});

app.post("/articles", function(req, res){

    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    })

    newArticle.save();

    console.log("added article to db")
})

app.listen(3000, function(req, res){
    console.log("Server started on port 3000")
});



