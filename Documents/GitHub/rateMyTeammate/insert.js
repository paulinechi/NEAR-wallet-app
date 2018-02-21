var mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'rateMyTeammate'
});
connection.connect();

var rateMyTeammate = {
    userName: 'mary',
    subject: 'comp307',
    comment: 'not bad'
};
var query = connection.query('insert into rmt set ?', rateMyTeammate, function(err, result){
    if(err){
        console.error(err);
        return;
    }
    //console.error(result);
    console.log(query.sql);

});
