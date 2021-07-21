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
var players = {};
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
    console.log(`User connected with id ${socket.id}`)
    screens.push({ number: Number(screenNumber), id: socket.id });
    socket.emit("new-screen", { number: Number(screenNumber), nScreens: nScreens }) //tell to load screen on local and its number  

    /**
     * On New PLayer method -> responsible for updating players object and emitting to all sockets that a new player has connected
     * @param {Object} newPl new player object containing initial player information
     */
    function onNewPlayer(newPl) {
        players[socket.id] = newPl;
        console.log('new ´playuer')

        io.emit('update-players-object', players)
        io.emit('new-player', players[socket.id])
    }
    socket.on('new-player', onNewPlayer)

    /**
     * On Create Pacman method -> responsible for emitting to all sockets that a pacman has been created
     */
    function onCreatePacman(pacman) {
        io.emit('create-pacman', pacman)
    }
    socket.on('create-pacman', onCreatePacman)

    /**
     * On Disconnect method -> responsible for updating players object and emitting to all sockets that a player has disconnected
     */
    function onDisconnect() {
        if (players[socket.id]) delete players[socket.id]
        console.log('disconnect', players)

        io.emit('update-players-object', players)
    }
    socket.on('disconnect', onDisconnect)

    /**
     * Update direction method -> responsible for emitting to all sockets to update direction
     * @param {String} dir indicates the new direction
     */
    function updateDirection(dir) {
        if (players[socket.id]) {
            players[socket.id].direction = dir
            players[socket.id].hasMoved = true
            io.emit('update-players-info', players)
        }
    }
    socket.on('update-direction', updateDirection)

    /**
     * Update player info method -> responsible for emitting to all sockets to update player info
     * @param {Object} pl player object containing player info to update
     */
    function updatePlayerInfo(pl) {
        const id = pl.id
        if (players[id]) {
            players[id] = pl;
        }
        io.emit('update-players-info', players)
    }
    socket.on('update-players-info', updatePlayerInfo)

    /**
     * Reset player method -> responsible for emitting to all sockets to reset player information and removing one life
     * @param {Object} player indicates reset player object
     */
    function resetPlayer(player) {
        const id = player.id
        players[id].lives--
        players[id].direction = player.direction
        players[id].x = players[id].startX
        players[id].y = players[id].startY
        players[id].screen = players[id].startScreen
        players[id].hasMoved = false
        io.emit('player-death', player)
        io.emit('update-players-info', players)
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
        io.emit('restart-game')
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
    function onPowerUpFinish(playerId) {
        io.emit('stop-audio', 'powerSiren')
        io.emit('play-audio', 'siren')
        io.emit('set-powerup', { value: false, playerId })
    }

    /**
     * On set powerup method -> responsible for emitting specific audio to stop
     * @param {Object} payload payload object containing value key (boolean containing isPoweredUp status) and durattion key with powerup duration
     */
    function onSetPowerup(payload) {
        if (payload.value == true) {
            if (powerUpTimeout) {
                // if already powered up
                io.emit('stop-audio', 'powerSiren') //stop current sound before starting again
                clearTimeout(powerUpTimeout)
            }
            io.emit('stop-audio', 'siren')
            io.emit('play-audio', 'powerSiren')
            powerUpTimeout = setTimeout(onPowerUpFinish, payload.duration, payload.playerId)
        }
    }
    socket.on('set-powerup', onSetPowerup)
})

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
