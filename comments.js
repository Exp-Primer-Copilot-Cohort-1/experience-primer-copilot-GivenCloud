//Create a new server
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Create a connection to the database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comments'
});

//Connect to the database
connection.connect(function(err){
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

app.use(express.static(path.join(__dirname, 'public')));

//Handle requests
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/comments', function(req, res){
    connection.query('SELECT * FROM comments', function(err, rows){
        if(err) throw err;
        res.json(rows);
    });
});

app.post('/comments', function(req, res){
    connection.query('INSERT INTO comments (author, text) VALUES (?, ?)', [req.body.author, req.body.text], function(err, result){
        if(err) throw err;
        res.json({id: result.insertId, author: req.body.author, text: req.body.text});
    });
});

app.get('/comments/:id', function(req, res){
    connection.query('SELECT * FROM comments WHERE id = ?', [req.params.id], function(err, rows){
        if(err) throw err;
        res.json(rows);
    });
});

app.put('/comments/:id', function(req, res){
    connection.query('UPDATE comments SET text = ? WHERE id = ?', [req.body.text, req.params.id], function(err, result){
        if(err) throw err;
        res.json({id: req.params.id, text: req.body.text});
    });
});

app.delete('/comments/:id', function(req, res){
    connection.query('DELETE FROM comments WHERE id = ?', [req.params.id], function(err, result){
        if(err) throw err;
        res.json({id: req.params.id});
    });
});

//Listen on port 3000
app.listen(3000, function(){
    console.log('