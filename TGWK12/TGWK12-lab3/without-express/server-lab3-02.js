const http = require('http');

const port= 2345;

htmlpage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<h1>Hello World </H1>
</body> 
</html>`
const server = http.createServer(function (req, res)
{
    res.statusCode = 200;
    res.setHeader('Content-typ' ,    'text/html');
    res.end(htmlpage);
});

server.listen(port, function  ()
{
    console.log('Server running and listening on port ${port}...');
});


