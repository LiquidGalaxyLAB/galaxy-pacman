import { DEBUG_MODE, DEBUG_PLAYER_SPAWN, DIRECTIONS, PACMAN_LIVES, PLAYERTYPES } from "../consts.js"
var socket = io()
let nScreens; // variable will be set to have total number of screens in screenSetup method

// dom variables
const scoreText = document.getElementById('score-text')
const centerText = document.getElementById('center-text')
const colorPicker = document.getElementById('color-picker')
const playerNameInput = document.getElementById('player-name')
const pacmanJoinButton = document.getElementById('pick-pacman-btn')
const ghostJoinButton = document.getElementById('pick-ghost-btn')
const colorPickerContainer = document.getElementById('color-picker-container')
const controllerConatiner = document.getElementById('controller-container')
const waitingScreen = document.getElementById('waiting-screen')
const readyButton = document.getElementById('ready-btn')
const waitingText = document.getElementById('waiting-text')

// setup lives counter
const livesContainer = document.getElementById('lives-container')
const pacmanLifeSprite = document.createElement('img');
pacmanLifeSprite.src = "../assets/pacman.png"
pacmanLifeSprite.style = "height: 5vw; display: inline-block; pointer-events: none;"

// start with full lives
for (let i = 0; i < PACMAN_LIVES; i++) {
    livesContainer.appendChild(pacmanLifeSprite.cloneNode())
}

// player variables
var currentScore = 0
var newPlayer = {
    id: null,
    name: '',
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    score: 0,
    direction: DIRECTIONS.STOP,
    isPoweredUp: false,
    isConnected: false,
    lives: PACMAN_LIVES,
    hasMoved: false,
    ready: false,
}

/**
 * On Pacman Join method -> responsible for setting pacman color/type and calling onNewPlayer mehtod
 */
function onPacmanJoin() {
    newPlayer.color = colorPicker.value
    newPlayer.type = PLAYERTYPES.PACMAN
    onNewPlayer()
}
pacmanJoinButton.addEventListener('click', onPacmanJoin)

/**
 * On Ghost Join method -> responsible for setting pacman color/type and calling onNewPlayer mehtod
 */
function onGhostJoin() {
    newPlayer.color = colorPicker.value
    newPlayer.type = PLAYERTYPES.GHOST

    // hide lives counter
    livesContainer.style = 'visibility: hidden'
    onNewPlayer()
}
ghostJoinButton.addEventListener('click', onGhostJoin)

function setPlayerReady() {
    readyButton.style = 'visibility: hidden'
    waitingText.style = 'visibility: visible'
    newPlayer.ready = true
    socket.emit('player-ready', socket.id)
}
readyButton.addEventListener('click', setPlayerReady)

/**
 * On New Player method -> responsible for setting player object and emitting that a new player has connected
 */
function onNewPlayer() {
    newPlayer.name = playerNameInput.value
    newPlayer.id = socket.id
    newPlayer.screen = DEBUG_MODE ? DEBUG_PLAYER_SPAWN.screen : Math.floor(Math.random() * nScreens) + 1 //random screen from 1 to number of screens (debug mode is fixed screen)
    newPlayer.startScreen = newPlayer.screen
    newPlayer.currentMap = newPlayer.screen == 1 ? 'master' : 'slave'
    socket.emit('new-player', newPlayer)

    //switch to waiting screen
    colorPickerContainer.style = 'visibility: hidden'
    controllerConatiner.style = "visibility: hidden"
    waitingScreen.style = 'visibility: visible'
}

// socket functions/event listeners
/**
 * Screen setup method -> responsible for setting variables for screen
 * @param {Object} screen screen object containing info like screen number and total of screens
 */
function screenSetup(screen) {
    nScreens = screen.nScreens;
}
socket.on("new-screen", screenSetup)

/**
 * Update player score method -> responsible for updating 'Current Score' text in controller
 * @param {Object} players players object containg all players info
 */
function updatePlayerScore(players) {
    const player = players[socket.id]
    currentScore = player?.score || 0
    scoreText.innerHTML = `CURRENT SCORE: ${currentScore}`
}
socket.on('update-players-info', updatePlayerScore)

/**
 * On PLayer Deathg method -> responsible for redrawing lives on bottom right based on player current lives
 * @param {Object} pl player object containing amout of lives and other information
 */
function onPlayerDeath(pl) {
    livesContainer.innerHTML = ""
    for (let i = 0; i < pl.lives; i++) {
        livesContainer.appendChild(pacmanLifeSprite.cloneNode())
    }
}
socket.on('pacman-death', onPlayerDeath)

function onGameRestart() {
    window.location.reload()
}
socket.on('restart-game', onGameRestart)

/**
 * On game end method -> set controller screen based on victory or loss
 * @param {String} winners player type indicating if pacmans or ghosts won
 */
function onGameEnd(winners) {
    if (winners == PLAYERTYPES.GHOST) {
        centerText.innerHTML = `GHOSTS WIN!!<br />Your final score was: ${currentScore}<br />Insert coin to play again<br />`
    } else {
        centerText.innerHTML = `PACMANS WIN!!<br />Your final score was: ${currentScore}<br />Insert coin to play again<br />`
    }
    const insertbutton = document.createElement('button')
    insertbutton.className = 'custom-button'
    insertbutton.innerHTML = 'INSERT'
    centerText.appendChild(insertbutton)

    insertbutton.addEventListener('click', () => {
        socket.emit('restart-game')
        window.location.reload()
    })
    centerText.style = "display: block"
}
socket.on('game-end', onGameEnd)

function onGameStart() {
    //switch to controller
    if(newPlayer.ready) {
        waitingScreen.style = 'visibility: hidden'
        waitingText.style = 'visibility: hidden'
        colorPickerContainer.style = 'visibility: hidden'
        controllerConatiner.style = 'visibility: visible'
    }
}
socket.on('allow-game-start', onGameStart)

function onAllPlayersReady() {
    waitingText.innerHTML = "All players ready! Once the siren starts GO!!"
}
socket.on('all-players-ready', onAllPlayersReady)

function onGameHasStarted() {
    waitingText.innerHTML = "Game has already started! Please wait for the next game"
}
socket.on('show-game-has-started', onGameHasStarted)

// Controller setup
const controllerOptions = {
    mode: "dynamic",
    color: "green",
    zone: document.getElementById('zone_joystick'),
}

var manager = nipplejs.create(controllerOptions)

// Controller direction angle
let controllerDir = DIRECTIONS.STOP;
// player direction angle
let playerDir = DIRECTIONS.STOP;

// Controller movement listener
manager.on('move', function (ev, nipple) {
    // Save controller direction
    if (nipple.direction) controllerDir = nipple.direction.angle

    // If player direction is not same as controller emit for socket to update player direction
    if (playerDir !== controllerDir) {
        // this switch is needed in case the directions constants are ever changed
        let dir;
        switch (controllerDir) {
            case "up":
                dir = DIRECTIONS.UP
                break;
            case "down":
                dir = DIRECTIONS.DOWN
                break;
            case "right":
                dir = DIRECTIONS.RIGHT
                break;
            case "left":
                dir = DIRECTIONS.LEFT
                break;
        }

        socket.emit('update-direction', dir)
        playerDir = controllerDir
    }
})