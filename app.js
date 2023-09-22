const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(express.static("public"));

mongoose.set("strictQuery",true);

const url="";
mongoose.connect(url).then(()=>
{
  console.log("You have Successfully Setup your mongo db");
}).catch((err)=>{console.log(err)});

const APISchema=new mongoose.Schema({
    title:String,
    content:String
});

const API=new mongoose.model("API",APISchema);


//////////////////////////////////////////////////////////////////  API calls FOR /articles  ///////////////////////////////////////////////////////////////////////

app.route('/articles')
.get(function(req,res){
    API.find({}).then(function(err,data){
        if(!err)
        {
            res.send(data);
        }
        else{
            res.send(err);
        }
    });
})

.post(function(req,res){

    // console.log(req.query);
    const article=new API({
        title:req.query.title,
        content:req.query.content
    });

    article.save();
})
.delete(function(req,res){
    API.deleteMany({}).then(function(err,data){
        if(!err){
            res.send("Successfully Deleted all data");
        }
        else{
            res.send(err);
        }
    })
});


//////////////////////////////////////////////////////////////////  API calls FOR /articles/item-name  ///////////////////////////////////////////////////////////////////////

app.route('/articles/:item')

.get(function(req,res){
    // console.log(req.params.item);
    API.find({title:req.params.item}).then(function(err,data){
        if(!err){
            res.send(data);
        }
        else{
            res.send(err);
        }
    });
})

.put( function (req, res) {
    API.findOneAndUpdate(
        { title: req.params.item },
        { title: req.query.title, content: req.query.content },
        { new: true }
    ).then(function (doc) {
        if (doc) {
            res.send("Updated file");
        } else {
            res.status(404).send("Item not found");
        }
    }).catch(function (err) {
        res.status(500).send(err);
    });
})
.patch(function(req,res){
    API.findOneAndUpdate(
        {title:req.params.item},
        {$set:req.query},
        
    ).then(function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      });
})
.delete(function(req,res){
    API.deleteOne({title:req.params.item}).then(function(err,data){
        if(!err){
            res.send("Successfully Delete");
        }
        else{
            res.send(err);
        }
    });
});

app.listen(3000,function(){
    console.log("Your server is listening in port 3000");
})