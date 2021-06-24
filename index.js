// Server initialization
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = 8128;

// Setup files to be sent on connection
const filePath = "/public" // Do not add '/' at the end
const gameFile = "index.html"
const mapBuilderFile = "mapbuilder/index.html"
const controllerFile = "controller/index.html"


app.use(express.static(__dirname + filePath))

app.get('/:id', (req, res) => {
    const id = req.params.id
    if(id == 'mapbuilder') {
        res.sendFile(__dirname + `${filePath}/${mapBuilderFile}`);
    } else if(id == "controller") {
        res.sendFile(__dirname + `${filePath}/${controllerFile}`);
    } else {
        res.sendFile(__dirname + `${filePath}/${gameFile}`);
    }
})

// Socket listeners and functions
io.on('connect', socket => {
    console.log(`User connected with id ${socket.id}`)

    /**
     * Update direction method -> responsible for emitting to all sockets to update direction
     * @param {String} dir indicates the new direction
     */
    function updateDirection(dir) {
        io.emit('updateDirection', dir)
    }
    socket.on('updateDirection', updateDirection)
})

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
