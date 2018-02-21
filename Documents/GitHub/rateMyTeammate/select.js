var mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'rateMyTeammate'
});
connection.connect();



var query = connection.query("select comment from rmt WHERE userName = 'mary' " , function(err, result){
   /* if (err){
        console.error(err);
        return;
    }
    console.error(err);
    */
    console.log(result);
   
});

