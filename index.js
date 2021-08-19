// Server initialization
import express from 'express'
var app = express();
import httpImport from 'http'
var http = httpImport.createServer(app);
import socketio from 'socket.io'
var io = socketio(http);

import path from 'path';
const __dirname = path.resolve();

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
var players = {};
var hasGameStarted = false


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
    socket.emit("new-screen", { number: Number(screenNumber), nScreens: nScreens }) //tell to load screen on local and its number  

    /**
     * On New PLayer method -> responsible for updating players object and emitting to all sockets that a new player has connected
     * @param {Object} newPl new player object containing initial player information
     */
    function onNewPlayer(newPl) {
        try {
            console.log('New player connected:', newPl)

            // if no players connected reset hasGameStarted
            if (Object.keys(players).length == 0) {
                hasGameStarted = false
            }

            if (!hasGameStarted) {
                players[socket.id] = newPl;

                io.emit('update-players-object', players)
            }
        } catch (err) {
            console.error('Error on onNewPlayer method:', err)
        }
    }
    socket.on('new-player', onNewPlayer)

    /**
     * On Create Pacman method -> responsible for emitting to all sockets that a pacman has been created
     */
    function onCreatePacman(pacman) {
        try {
            console.log('Creating pacman:', pacman)
            io.emit('create-pacman', pacman)
        } catch (err) {
            console.error('Error on onCreatePacman method:', err)
        }
    }
    socket.on('create-pacman', onCreatePacman)

    /**
     * On Create Ghost method -> responsible for emitting to all sockets that a ghost has been created
     */
    function onCreateGhost(ghost) {
        try {
            console.log('Creating ghost:', ghost)
            io.emit('create-ghost', ghost)
        } catch (err) {
            console.log('Error on onCreateGhost method:', err)
        }
    }
    socket.on('create-ghost', onCreateGhost)

    /**
     * On Disconnect method -> responsible for updating players object and emitting to all sockets that a player has disconnected
     */
    function onDisconnect() {
        try {
            console.log(`Player with id ${socket.id} disconnected!`)
            if (players[socket.id]) delete players[socket.id]

            io.emit('update-players-object', players)
        } catch (err) {
            console.log('Error on onDisconnect method:', err)
        }
    }
    socket.on('disconnect', onDisconnect)

    /**
     * Update direction method -> responsible for emitting to all sockets to update direction
     * @param {String} dir indicates the new direction
     */
    function updateDirection(dir) {
        try {
            console.log(`Player with ${socket.id}, update direction to ${dir}`)
            if (players[socket.id]) {
                players[socket.id].direction = dir
                players[socket.id].hasMoved = true
                io.emit('update-players-info', players)
            }
        } catch (err) {
            console.log('Error on updateDirection method:', err)
        }
    }
    socket.on('update-direction', updateDirection)

    /**
     * Update player info method -> responsible for emitting to all sockets to update player info
     * @param {Object} pl player object containing player info to update
     */
    function updatePlayerInfo(pl) {
        try {
            console.log("Updating player info:", pl)
            const id = pl.id
            if (players[id]) {
                players[id] = pl;
            }
            io.emit('update-players-info', players)
        } catch (err) {
            console.log('Error on updatePlayerInfo method:', err)
        }

    }
    socket.on('update-players-info', updatePlayerInfo)

    /**
     * Reset Pacman method -> responsible for emitting to all sockets to reset player information and remove one life
     * @param {Object} player indicates reset player object
     */
    function resetPacman(player) {
        try {
            console.log('Reseting pacman:', player)
            const id = player.id
            players[id].lives--
            players[id].direction = player.direction
            players[id].x = players[id].startX
            players[id].y = players[id].startY
            players[id].screen = players[id].startScreen
            players[id].currentMap = players[id].startScreen == 1 ? 'master' : 'slave'
            players[id].hasMoved = false
            io.emit('pacman-death', player)
            io.emit('update-players-info', players)

            if (players[id].lives <= 0) {
                io.emit('pacman-to-ghost', players[id])
            }
        } catch (err) {
            console.log('Error on resetPacman method:', err)
        }
    }
    socket.on('pacman-death', resetPacman)

    /**
     * Reset Ghost method -> responsible for emitting to all sockets to reset player information and removing one life
     * @param {Object} player indicates reset player object
     */
    function resetGhost(player) {
        try {
            console.log('Reseting ghost:', player)
            const id = player.id
            players[id].direction = player.direction
            players[id].x = players[id].startX
            players[id].y = players[id].startY
            players[id].screen = players[id].startScreen
            players[id].hasMoved = false
            io.emit('ghost-death', player)
            io.emit('update-players-info', players)
        } catch (err) {
            console.log('Error on resetGhost method:', err)
        }
    }
    socket.on('ghost-death', resetGhost)

    // emit hide text to all sockets
    function onHideInitialText() {
        try {
            console.log('Hide initial text!')
            io.emit('hide-initial-text')
        } catch (err) {
            console.log('Error on onHideInitialText method:', err)
        }
    }
    socket.on('hide-initial-text', onHideInitialText)

    // emit allow game start to all sockets
    function onAllowGameStart() {
        try {
            console.log('Allow game start!')
            io.emit('allow-game-start')
        } catch (err) {
            console.log('Error on onAllowGameStart method:', err)
        }
    }
    socket.on('allow-game-start', onAllowGameStart)

    /**
     * Play Audio method -> responsible for emitting specific audio to play
     * @param {String} name name of the audio to be played
     */
    function playAudio(name) {
        try {
            console.log('Play audio:', name)
            io.emit('play-audio', name)
        } catch (err) {
            console.log('Error on playAudio method:', err)
        }
    }
    socket.on('play-audio', playAudio)

    /**
     * Play Unique Audio method -> responsible for emitting specific unique audio to play
     * @param {String} name name of the audio to be played
     */
    function playUniqueAudio(name) {
        try {
            console.log('Play unique audio:', name)
            io.emit('play-unique-audio', name)
        } catch (err) {
            console.log('Error on playUniqueAudio method:', err)
        }
    }
    socket.on('play-unique-audio', playUniqueAudio)

    /**
     * Set foods eaten method -> emit to all sockets that foods have been eaten on a specific screen
     * @param {Number} screen number of the screen where all foods were eaten
     */
    function setFoodsEaten(screen) {
        try {
            console.log(`Set all foods eaten on screen ${screen}!`)
            io.emit('set-foods-eaten', screen)
        } catch (err) {
            console.log('Error on setFoodsEaten method:', err)
        }
    }
    socket.on('set-foods-eaten', setFoodsEaten)

    /**
     * On game end method -> emit to all sockets that game has ended
     * @param {String} winner player type indicating if pacmans or ghosts won 
     */
    function onGameEnd(winner) {
        try {
            console.log('On game end, winners:', winner)
            hasGameStarted = false
            io.emit('game-end', winner)
        } catch (err) {
            console.log('Error on onGameEnd method:', err)
        }
    }
    socket.on('game-end', onGameEnd)

    // On restart game method -> Emit to all sockets to restart game with new player
    function onRestartGame() {
        try {
            console.log('Restarting game...')
            hasGameStarted = false
            io.emit('restart-game')
        } catch (err) {
            console.log('Error on onRestartGame method:', err)
        }
    }
    socket.on('restart-game', onRestartGame)

    /**
     * Stop Audio method -> responsible for emitting specific audio to stop
     * @param {String} name name of the audio to be stopped
     */
    function stopAudio(name) {
        try {
            console.log('Stop audio:', name)
            io.emit('stop-audio', name)
        } catch (err) {
            console.log('Error on stopAudio method:', err)
        }
    }
    socket.on('stop-audio', stopAudio)

    /**
     * On powerup finish method -> responsible for switching siren sounds
     */
    function onPowerUpFinish(playerId) {
        try {
            console.log("Powerup finished:", playerId)
            io.emit('stop-audio', 'powerSiren')
            io.emit('play-audio', 'siren')
            io.emit('set-powerup', { value: false, playerId })
        } catch (err) {
            console.log('Error on onPowerUpFinish method:', err)
        }
    }

    /**
     * On set powerup method -> responsible for emitting specific audio to stop
     * @param {Object} payload payload object containing value key (boolean containing isPoweredUp status) and durattion key with powerup duration
     */
    async function onSetPowerup(payload) {
        try {
            console.log("Set powerup:", payload)
            if (payload.value == true) {
                io.emit('stop-audio', 'powerSiren')
                io.emit('stop-audio', 'siren')
                io.emit('play-audio', 'powerSiren')
                await sleep(payload.duration).then(() => onPowerUpFinish(payload.playerId))
            }
        } catch (err) {
            console.log('Error on onSetPowerup method:', err)
        }
    }
    socket.on('set-powerup', onSetPowerup)

    /**
     * On next frame method -> emit to all sockets to go to next frame (used for debug mode)
     */
    function onNextFrame() {
        io.emit('next-frame')
    }
    socket.on('next-frame', onNextFrame)

    /**
     * On Player Ready Mehtod -> responsible for checking if all players are ready and emitting to all sockets when they are
     * @param {String} id id of the player
     */
    function onPlayerReady(id) {
        try {
            if (!hasGameStarted) {
                players[id].ready = true

                let hasPlayerUnready = false
                for (const id in players) {
                    if (players[id].ready == false) {
                        hasPlayerUnready = true
                    }
                }

                // emit to allow game start
                if (!hasPlayerUnready) {
                    console.log('All players ready!')
                    io.emit('all-players-ready')
                    hasGameStarted = true
                } else {
                    console.log('Waiting for other players...')
                }
            } else {
                io.emit('show-game-has-started')
            }
        } catch (err) {
            console.log('Error on onPlayerReady methods:', err)
        }
    }
    socket.on('player-ready', onPlayerReady)

    /**
     * Sleep function -> used for making code wait for certain amount of time before doing something else
     * @param {Number} duration duration of sleep in milliseconds
     */
    function sleep(duration) {
        return new Promise(resolve => setTimeout(resolve, duration))
    }
})

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
