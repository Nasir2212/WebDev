const port = 3456;

//NodeJS Core Modules
const http = require('http');
const fs = require('fs');


const routeMap = {
    "/": "./mycv-01.html",
    "/img/CvPicSquare.jpg": "img/CvPicSquare.jpg",
    "/img/mail.png": "img/mail.png",
    "/img/Phone.jpg": "img/Phone.jpg"
};

server = http.createServer((request, response) => {
    if (routeMap[request.url]) {
        if(routeMap[request.url].slice(-4) ==".jpg")
        {
            response.setHeader('Content-Type', 'image/jpg');
        }
        fs.readFile(routeMap[request.url], (error, data) => {
            response.write(data);
            response.end();
        })
    } else {
        response.end("<h1>Sorry, page not found</h1>");
    }
})

server.listen(port);
console.log(`The server is listening on port: ${port}`);