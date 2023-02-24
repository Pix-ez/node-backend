



//Local server
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'dat'
// })
const mysql = require('mysql');

//online server-
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: process.env.TIMEOUT // or a higher value, in milliseconds
})


connection.connect(function(err){
    if(!!err){
        console.log(err);

    }
    else{
        console.log("connected to database lets goo 😎😎🔥");
    }
});




module.exports = connection ;