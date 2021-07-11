import { DIRECTIONS, PACMAN_LIVES } from "../consts.js"
var socket = io()
const scoreText = document.getElementById('score-text')
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
 * Update player score method -> responsible for updating 'Current Score' text in controller
 * @param {Object} player player object containg all player info
 */
function updatePlayerScore(player) {
    scoreText.innerHTML = `CURRENT SCORE: ${player.score}`
}
socket.on('update-player-info', updatePlayerScore)

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
        playerDir = controllerDir

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

        socket.emit('updateDirection', dir)
    }
})