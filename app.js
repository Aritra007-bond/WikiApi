//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
  title : String,
  content : String
};

const Article = mongoose.model("Article" , articleSchema);

/////////////request targeting all articles

app.route("/articles")

  .get(function(req,res){

    Article.find({},function(err , foundArticles){
      if(err){
        console.log("error in finding data of articles");
      }else{
          res.send(foundArticles);
      }
    })
  })
  .post(function(req,res){

      console.log();
      console.log();

      const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
      });

      newArticle.save(function(err){
        if (!err) {
          res.send("Succesfully added a new article")
        }else {
          res.send(err);
        }
      })
  })
  .delete(function(req,res){

    Article.deleteMany({}, function(err){
      if(!err){
        res.send("Deleted everything Succesfully");
      }else{
        res.send(err);
      }
    })
  });


///////// request targeting specific articles

app.route("/articles/:articleTitle")

    .get(function(req,res){

    Article.findOne({title: req.params.articleTitle}, function(err , foundArticle){
        if(foundArticle){
          res.send(foundArticle);
        }else{
          res.send("No Such article exist matching the title");
        }

    })

  })

    .put(function(req,res){
       Article.updateOne(
         {title: req.params.articleTitle},
         {title:req.body.title, content: req.body.content},//updates all so must pass all the parameters unlike Patch because it updates the whole array and not only the change
         function(err){
           if(!err){
             res.send("Succesfully updated the Data Set");
           }else{
             res.send(err);
           }
         }
       )
    })
    .patch(function(req,res){
      Article.updateOne(
        {title: req.params.articleTitle},{ $set : req.body},//need all the parameters of the input or existing array. $set finds the changes made in the array and updates that only        {$set : req.body},
        function(err){
          if(!err){
                res.send("Succesfully updated the particular Article");
          }else{
              res.send(err);
          }
        }
      );
    })
    .delete(function(req,res){
      Article.deleteOne({
        title: req.body.articleTitle},
        function(err){
          if(!err){
            res.send("Succesfully deleted the corresponding article");
          }else{
            res.send(err);
          }
        }
      );
    });




app.listen(3000, function(){
  console.log("server started at port 3000");



})
