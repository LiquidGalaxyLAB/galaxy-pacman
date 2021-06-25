//import constants and necessary classes
import { GRID_WIDTH, BLOCK_SIZE, WALL_LINE_WIDTH, MASTER_MAP_LAYOUT, SLAVE_MAP_LAYOUT, GAME_SPEED, TOP_OFFSET, SHOW_STATUS } from "./consts.js"
import WallBlock from "./models/WallBlock.js";
import Pacman from "./models/Pacman.js"
import Food from "./models/Food.js"
import PowerPill from "./models/PowerPill.js";
import Stats from "./js/stats.module.js";

// Show status setup
let container = document.createElement( 'div' );
document.body.appendChild( container );
let stats = new Stats();
if(SHOW_STATUS) container.appendChild( stats.dom );

// Socket listeners and functions
var socket = io()

// Direction from controller
let currentDirection = "s" // 's' for stop

/**
 * Update direction method -> responsible for current direction to new direction
 * @param {String} dir indicates the new direction
 */
function updateDirection(dir) {
	switch(dir) {
		case "up":
			currentDirection = "u"
			break;
		case "down":
			currentDirection = "d"
			break;
		case "right":
			currentDirection = "r"
			break;
		case "left":
			currentDirection = "l"
			break;
	}
}
socket.on('updateDirection', updateDirection)

// Get canvas element from index.html
const canvas = document.getElementById('gameCanvas');
canvas.height = window.innerHeight - TOP_OFFSET
canvas.width = BLOCK_SIZE * GRID_WIDTH + WALL_LINE_WIDTH

const ctx = canvas.getContext("2d");

// Array of pacmans in the map
var pacmans = [];
// Array of blocks in the map
var blocks = [];
// Current map layout
const currentMap = MASTER_MAP_LAYOUT

// Start game function -> 
function startGame() {
	setInterval(function () {
		draw();
		if(SHOW_STATUS) stats.update();
	}, GAME_SPEED
	);
}

// Draw function -> draw objects on canvas
function draw() {
	//clear before redrawing
	clearCanvas()

	//draw each block
	blocks.forEach(function (block) {
		block.draw(ctx);
	});

	//draw each pacman
	pacmans.forEach(function (pacman) {
		pacman.updatePosition(currentDirection, currentMap)
		pacman.draw(ctx);
	});
}

// Clear canvas -> fill canvas with black rectangle
function clearCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Create game grid based on selected map layout
 * @param {Array} map two dimensional array with map layout
 */
function createGrid(map) {
	map.forEach((row, i) => {
		row.forEach((block, j) => {
			switch (block) {
				case 1: // Wall
					blocks.push(new WallBlock(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case 2: // Food
					blocks.push(new Food(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case 3: // Pacman
					pacmans.push(new Pacman(j * BLOCK_SIZE, i * BLOCK_SIZE));
					block = 0; // Set to 0 (indicates empty block with no food)
					break;
				case 4: // PowerPill
					blocks.push(new PowerPill(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
			}
		})
	});
}

// Create grid for desired map
createGrid(currentMap);
// Start drawing loop
startGame();