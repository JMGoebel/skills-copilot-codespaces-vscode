// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const comments = require('./comments');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const parsedPath = parsedUrl.pathname;
  const parsedQuery = parsedUrl.query;

  if (parsedPath === '/comments') {
    if (req.method === 'GET') {
      const data = "comments section";
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const parsedBody = JSON.parse(body);
        comments.addComment(parsedBody);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsedBody));
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found!');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});