const express = require('express');
const app = express();
const port = 6789;
const path = require('path');


app.use(express.static('public'));

app.use('/css', express.static('css')); 

app.use('/img', express.static('img')); 

app.get('/', (req,res) => 
{
    const htmlFilePath = path.join(__dirname + '/my-cv-06.html');
    res.sendFile(htmlFilePath);
})

app.listen(port, () => 
{
    console.log(`Express server listening on port: ${port}..`);
})