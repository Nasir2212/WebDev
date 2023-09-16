const port = 4567;

//NodeJS Core Modules
const http = require('http');
const fs = require('fs');



const routeMap = {
    "/": "./my-cv-05.html", 
    "/img/CvPicSquare.jpg": "img/CvPicSquare.jpg",
    "/css/my-styles-05.css": "./css/my-styles-05.css"
};

const server = http.createServer((request, response) => {
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
        response.writeHead(404);
        response.end("<h1>Sorry, page not found</h1>");
    }
})

server.listen(port);
console.log(`The server is listening on port: ${port}`);