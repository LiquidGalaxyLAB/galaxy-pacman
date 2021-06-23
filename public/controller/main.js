const controllerOptions = {
    mode: "dynamic",
    color: "green",
    zone: document.getElementById('zone_joystick'),
}

var manager = nipplejs.create(controllerOptions)

manager.on('move', function(ev, nipple) {
    if(nipple.direction) console.log('direction', nipple.direction.angle)
})