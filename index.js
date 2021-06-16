//server config
var express = require('express');
var app = express();
var http = require('http').createServer(app);
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

const port = 8128;
http.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
