



//Local server
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'dat'
// })
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dat'
})

//online server-
// var connection = mysql.createConnection({
//     host: 'bewfxmgl4pcxwh9d88n7-mysql.services.clever-cloud.com',
//     user: 'uvcgqdxreapswstc',
//     password: 'xuN5COOIEOfSCNEScwXm',
//     database: 'bewfxmgl4pcxwh9d88n7',
//     connectTimeout: 30000 // or a higher value, in milliseconds
// })


connection.connect(function(err){
    if(!!err){
        console.log(err);

    }
    else{
        console.log("connected to database lets goo 😎😎🔥");
    }
});




module.exports = connection ;