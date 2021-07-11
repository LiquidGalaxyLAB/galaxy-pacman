import { DIRECTIONS } from "../consts.js"
var socket = io()
const scoreText = document.getElementById('score-text')

// emit player connected
socket.emit('new-player')

/**
 * Update player score method -> responsible for updating 'Current Score' text in controller
 * @param {Object} player player object containg all player info
 */
function updatePlayerScore(player) {
    scoreText.innerHTML = `CURRENT SCORE: ${player.score}`
}
socket.on('update-player-info', updatePlayerScore)

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