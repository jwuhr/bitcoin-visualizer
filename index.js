var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    session = require("express-session"),
    WebSocket = require('ws');

var express = require("express");
var app = express();
var server = require('http').createServer(app);

var port = process.env.PORT || 3000;

app.use(session({
    secret: 'dog',
    resave: false,
    saveUninitialized: false
}));

server.listen(port, function () {
    console.log("listening on port 3000");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'btc_test1'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('mysql connected!');
});

db.query('USE btc_testing1');

//-----------------------------------------------------------

var ws = new WebSocket('wss://ws.blockchain.info/inv');

// ws.onopen = function () {
//     ws.send(JSON.stringify({ "op": "blocks_sub" }))
// };

ws.onopen = function () {
    ws.send(JSON.stringify({ "op":"blocks_sub" }))
};

ws.onmessage = function (msg) {

    var response = JSON.parse(msg.data);
    console.log(response);

    db.query("INSERT INTO `new_table3` VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [response.x.blockIndex, response.x.hash, response.x.totalBTCSent, response.x.size, response.x.weight, response.x.height,
            response.x.difficulty, response.x.time, response.x.foundBy.description, response.x.prevBlockIndex]
    );
};



//-----------------------------------------------------------

app.get('/', function (req, res) {
    res.render(__dirname + '/views/index.ejs');
});

// app.get('/createdb', function(req, res){
//     let sql = 'CREATE DATABASE btc_test1';
//     db.query(sql, function(err, result){
//         if(err){
//             throw err;
//         }
//         console.log(result);
//         res.send('Database created...');
//     })
// })

app.get('/')



 // let sql = 'CREATE DATABASE btc_test1';
    // db.query(sql, function(err, result){
    //     if(err){
    //         throw err;
    //     }
    //     console.log(result);
    //     res.send('Database created...');
    // });