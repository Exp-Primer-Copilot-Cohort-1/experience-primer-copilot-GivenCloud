// Create web server
// Create a web server that listens on port 3000 and serves the comments.html file
// when someone visits http://localhost:3000/comments.

// When someone makes a POST request to http://localhost:3000/comments, it should send
// the data in the request body to the console.

var http = require('http');
var fs = require('fs');
var path = require('path');
var server = http.createServer(function(req, res) {
  if (req.method === 'GET') {
    if (req.url === '/comments') {
      res.writeHead(200, {'Content-Type': 'text/html'});
      fs.createReadStream('./comments.html').pipe(res);
    }
  } else if (req.method === 'POST') {
    if (req.url === '/comments') {
      req.on('data', function(data) {
        console.log(data.toString());
      });
    }
  }
});
server.listen(3000);
console.log('Server listening on port 3000');

// When someone makes a POST request to http://localhost:3000/comments, it should send
// the data in the request body to the console.

// Test the server by running the following curl command in your terminal:

// curl -X POST -d "comment=Hello" http://localhost:3000/comments
// The server should log the following:

// comment=Hello
// This exercise is a little tricky, so don't worry if you weren't able to get it working.
// You can also check out the official solution here.

// http://localhost:3000/comments

// curl -X POST -d "comment=Hello" http://localhost:3000/comments
// comment=Hello