// setting up
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var mysql = require('mysql');
// connect to the database
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'rateMyTeammate'
});




app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;
var router = express.Router();

router.use(function(req, res, next){
    console.log('sth is happening');
    next();
});

router.get('/',function(req,res){
    res.json({message: 'welcome to our api'});
});

/*
app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
 })

 */

app.get('/api/fetchdata',function(req,res){
    var data = {
        "Data":""
    };
    connection.query("SELECT * from rmt",function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
});

app.post('/login',function(req,res){
    var name = req.body.name;
    var subject = req.body.subject;
    var comment = req.body.comment;

    var data = {
        "Data":""
    };
    connection.query("SELECT * from login WHERE name=? and subject=? and comment=? LIMIT 1",[name,subject,comment],function(err, rows, fields){
        //if(rows.length != 0){
            data["Data"] = "Getting comments for you..";
            res.json(data);
       // }else{
       //     data["Data"] = "Email or password is incorrect.";
       //     res.json(data);
       // }
    });
});



app.use('/api',router);

// start the server

app.listen(port);
console.log('magic happens on port' + port);

