// server initialization
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const port = 8128;

// setup files to be sent on connection
const filePath = "/public" // do not add '/' at the end
const gameFile = "index.html"
const mapBuilderFile = "mapbuilder/index.html"


app.use(express.static(__dirname + filePath))

app.get('/:id', (req, res) => {
    const id = req.params.id
    if(id == 'mapbuilder') {
        res.sendFile(__dirname + `${filePath}/${mapBuilderFile}`);
    } else {
        res.sendFile(__dirname + `${filePath}/${gameFile}`);
    }
})

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
