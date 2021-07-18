import { DIRECTIONS, PACMAN_LIVES } from "../consts.js"
var socket = io()

// dom variables
const scoreText = document.getElementById('score-text')
const centerText = document.getElementById('center-text')
const colorPicker = document.getElementById('color-picker')
const colorSubmitButton = document.getElementById('pick-color-btn')
const colorPickerContainer = document.getElementById('color-picker-container')
const controllerConatiner = document.getElementById('controller-container')
// setup lives counter
const livesContainer = document.getElementById('lives-container')
const pacmanLifeSprite = document.createElement('img');
pacmanLifeSprite.src = "../assets/pacman.png"
pacmanLifeSprite.style = "height: 10vh; display: inline-block;"

// start with full lives
for (let i = 0; i < PACMAN_LIVES; i++) {
    livesContainer.appendChild(pacmanLifeSprite.cloneNode())    
}

/**
 * On Color Submit method -> responsible for setting player color and emitting that a new player has connected
 */
function onColorSubmit() {
    newPlayer.color = colorPicker.value
    newPlayer.id = socket.id
    socket.emit('new-player', newPlayer)
    colorPickerContainer.style = 'visibility: hidden'
    controllerConatiner.style = 'visibility: visible'
}
colorSubmitButton.addEventListener('click', onColorSubmit)

// player variables
var currentScore = 0
var newPlayer = {
    id: null,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    score: 0,
    screen: 1,
    direction: DIRECTIONS.STOP,
    currentMap: "master",
    isPoweredUp: false,
    isConnected: false,
    lives: PACMAN_LIVES,
    hasMoved: false,
}

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
socket.on('player-death', onPlayerDeath)

/**
 * On game end method -> set controller screen based on victory or loss
 * @param {Boolean} victory boolean responsible for defining victory (true) or loss (false)
 */
function onGameEnd(victory) {
    if(victory) {
        centerText.innerHTML = `YOU WIN!!<br />Your final score was: ${currentScore}<br />Insert coin to play again<br />`
    } else {
        centerText.innerHTML = `YOU LOSE!!<br />Your final score was: ${currentScore}<br />Insert coin to play again<br />`
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

// Controller setup
const controllerOptions = {
    mode: "dynamic",
    color: "green",
    zone: document.getElementById('zone_joystick'),
}

var manager = nipplejs.create(controllerOptions)

// Controller direction angle
let controllerDir = DIRECTIONS.STOP;

// Controller movement listener
manager.on('move', function (ev, nipple) {
    // Save controller direction
    if (nipple.direction) controllerDir = nipple.direction.angle

    // If player direction is not same as controller emit for socket to update player direction

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
})