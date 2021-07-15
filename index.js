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

// Variables
var screenNumber = 1;
var myArgs = process.argv.slice(2);
var nScreens = Number(myArgs[0]);
if (myArgs.length == 0 || isNaN(nScreens)) {
    console.log("Number of screens invalid or not informed, default number is 5.")
    nScreens = 5;
}
console.log(`Running Galalxy Pacman for Liquid Galaxy with ${nScreens} screens!`);
var screens = [];
var newPlayer = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    score: 0,
    screen: 1,
    currentMap: "master",
    isPoweredUp: false,
    isConnected: false,
    lives: 5, // TODO: find out how to use const here
    hasMoved: false,
}
var powerUpTimeout


app.use(express.static(__dirname + filePath))

app.get('/:id', (req, res) => {
    const id = req.params.id
    if (id == 'mapbuilder') {
        res.sendFile(__dirname + `${filePath}/${mapBuilderFile}`);
    } else if (id == "controller") {
        res.sendFile(__dirname + `${filePath}/${controllerFile}`);
    } else {
        screenNumber = id
        res.sendFile(__dirname + `${filePath}/${gameFile}`);
    }
})

// Socket listeners and functions
io.on('connect', socket => {
    socket.emit('new-player', newPlayer)
    console.log(`User connected with id ${socket.id}`)
    screens.push({ number: Number(screenNumber), id: socket.id });
    socket.emit("new-screen", { number: Number(screenNumber), nScreens: nScreens }) //tell to load screen on local and its number  

    /**
     * Update direction method -> responsible for emitting to all sockets to update direction
     * @param {String} dir indicates the new direction
     */
    function updateDirection(dir) {
        io.emit('updateDirection', dir)
    }
    socket.on('updateDirection', updateDirection)

    /**
     * Update player position method -> responsible for emitting to all sockets to update player position
     * @param {Object} pl player object containing player info with new position
     */
    function updatePlayerPos(pl) {
        io.emit('update-player-pos', pl)
    }
    socket.on('update-player-pos', updatePlayerPos)

    /**
     * Update player info method -> responsible for emitting to all sockets to update player info
     * @param {Object} pl player object containing player info to update
     */
    function updatePlayerInfo(pl) {
        io.emit('update-player-info', pl)
    }
    socket.on('update-player-info', updatePlayerInfo)

    /**
     * Reset player method -> responsible for emitting to all sockets to reset player information and removing one life
     * @param {Object} player indicates reset player object
     */
    function resetPlayer(player) {
        player.lives--
        io.emit('player-death', player)
    }
    socket.on('player-death', resetPlayer)

    // emit hide text to all sockets
    socket.on('hide-initial-text', () => io.emit('hide-initial-text'))

    // emit allow game start to all sockets
    socket.on('allow-game-start', () => io.emit('allow-game-start'))

    /**
     * Play Audio method -> responsible for emitting specific audio to play
     * @param {String} name name of the audio to be played
     */
    function playAudio(name) {
        io.emit('play-audio', name)
    }
    socket.on('play-audio', playAudio)

    /**
     * Play Unique Audio method -> responsible for emitting specific unique audio to play
     * @param {String} name name of the audio to be played
     */
    function playUniqueAudio(name) {
        io.emit('play-unique-audio', name)
    }
    socket.on('play-unique-audio', playUniqueAudio)

    // emit to all sockets to change siren
    socket.on('switch-siren', () => io.emit('switch-siren'))

    /**
     * Set foods eaten method -> emit to all sockets that foods have been eaten on a specific screen
     * @param {Number} screen number of the screen where all foods were eaten
     */
    function setFoodsEaten(screen) {
        io.emit('set-foods-eaten', screen)
    }
    socket.on('set-foods-eaten', setFoodsEaten)

    /**
     * On game end method -> emit to all sockets that game has ended
     * @param {Boolean} victory boolean responsible for defining victory (true) or loss (false)
     */
    function onGameEnd(victory) {
        io.emit('game-end', victory)
    }
    socket.on('game-end', onGameEnd)

    // On restart game method -> Emit to all sockets to restart game with new player
    function onRestartGame() {
        io.emit('restart-game', newPlayer)
    }
    socket.on('restart-game', onRestartGame)

    /**
     * Stop Audio method -> responsible for emitting specific audio to stop
     * @param {String} name name of the audio to be stopped
     */
     function stopAudio(name) {
        io.emit('stop-audio', name)
    }
    socket.on('stop-audio', stopAudio)

    /**
     * On powerup finish method -> responsible for switching siren sounds
     */
    function onPowerUpFinish() {
        io.emit('stop-audio', 'powerSiren')
        io.emit('play-audio', 'siren')
        io.emit('set-powerup', { value: false })
    }

    /**
     * On set powerup method -> responsible for emitting specific audio to stop
     * @param {Object} payload payload object containing value key (boolean containing isPoweredUp status) and durattion key with powerup duration
     */
    function onSetPowerup(payload) {
        if (payload.value == true) {
            io.emit('stop-audio', 'siren')
            io.emit('play-audio', 'powerSiren')
            if (powerUpTimeout) clearTimeout(powerUpTimeout)
            powerUpTimeout = setTimeout(onPowerUpFinish, payload.duration)
        }
    }
    socket.on('set-powerup', onSetPowerup)
})

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
