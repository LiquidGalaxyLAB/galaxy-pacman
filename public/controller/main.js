var socket = io()

// Controller setup
const controllerOptions = {
    mode: "dynamic",
    color: "green",
    zone: document.getElementById('zone_joystick'),
}

var manager = nipplejs.create(controllerOptions)

// Controller direction angle
let controllerDir = "s";
// player direction angle
let playerDir = "s";
// Controller movement listener
manager.on('move', function(ev, nipple) {
    // Save controller direction
    if(nipple.direction) controllerDir = nipple.direction.angle
    
    // If player direction is not same as controller emit for socket to update player direction
    if(playerDir !== controllerDir) {
        playerDir = controllerDir
        socket.emit('updateDirection', controllerDir)
    }
})