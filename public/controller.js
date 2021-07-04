//import constants and necessary classes
import { GRID_WIDTH, BLOCK_SIZE, WALL_LINE_WIDTH, MASTER_MAP_LAYOUT, SLAVE_MAP_LAYOUT, TOP_OFFSET, SHOW_STATUS, DIRECTIONS, ENTITIES } from "./consts.js"
import WallBlock from "./models/WallBlock.js";
import Pacman from "./models/Pacman.js"
import Food from "./models/Food.js"
import PowerPill from "./models/PowerPill.js";
import Ghost from "./models/Ghost.js";
import Stats from "./js/stats.module.js";

// Show status setup
let container = document.createElement('div');
document.body.appendChild(container);
let stats = new Stats();
if (SHOW_STATUS) container.appendChild(stats.dom);

// Variables
let screenNumber, nScreens;
let currentMap = MASTER_MAP_LAYOUT //default to master map
var player = {
	x: 0,
	y: 0
};
const ghostsColors = ["#FF0000", "#FFB8FF", "#FFB852", "#00FFFF"]

// Socket listeners and functions
var socket = io()

function screenSetup(screen) {
	screenNumber = screen.number;
	nScreens = screen.nScreens;
	// currentMap = screenNumber == 1 ? MASTER_MAP_LAYOUT : SLAVE_MAP_LAYOUT

	createGrid(currentMap)
	draw()
}
socket.on("new-screen", screenSetup)

// Direction from controller
let currentDirection = DIRECTIONS.STOP // init standing still

/**
 * Update direction method -> responsible for changing current direction to new direction
 * @param {String} dir indicates the new direction
 */
function updateDirection(dir) {
	currentDirection = dir
}
socket.on('updateDirection', updateDirection)

socket.on('update-player', function(pl) {
	if(screenNumber != 1) {
		player = pl
	}
})

socket.on('set-player-screen', function(screen) {
	player.screen = screen
})

// Get canvas element from index.html
const canvas = document.getElementById('gameCanvas');
canvas.height = window.innerHeight - TOP_OFFSET
canvas.width = BLOCK_SIZE * GRID_WIDTH + WALL_LINE_WIDTH

const ctx = canvas.getContext("2d");

// Array of pacmans in the map
var pacmans = [];
// Array of blocks in the map
var blocks = [];
// Array of blocks in the map
var ghosts = [];

// Draw function -> draw objects on canvas
function draw() {
	//clear before redrawing (important to reset transform before drawing)
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	clearCanvas()

	//draw each block
	blocks.forEach(function (block) {
		block.draw(ctx);
	});

	//draw each pacman
	pacmans.forEach(function (pacman) {
		pacman.updatePosition(currentDirection, currentMap, screenNumber, nScreens, player, socket)

		const pacmanPos = pacman.getRowCol()
		for(const ghost of ghosts) {
			const ghostPos = ghost.getRowCol()

			if(ghostPos.row == pacmanPos.row && ghostPos.col == pacmanPos.col) {
				currentDirection = DIRECTIONS.STOP
				pacman.reset()
			}
		}

		if(screenNumber == 1) {
			player.x = pacman.x
			player.y = pacman.y
			socket.emit('update-player', player)
		}
		pacman.draw(ctx, screenNumber, nScreens, player);
	});

	//draw ghosts
	ghosts.forEach(function (ghost) {
		ghost.updatePosition(currentDirection, currentMap)
		ghost.draw(ctx)
	})

	if (SHOW_STATUS) stats.update();

	requestAnimationFrame(draw)
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
				case ENTITIES.WALL: // Wall
					blocks.push(new WallBlock(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case ENTITIES.FOOD: // Food
					blocks.push(new Food(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case ENTITIES.PACMAN: // Pacman
					player.x = j * BLOCK_SIZE
					player.y = i * BLOCK_SIZE
					pacmans.push(new Pacman(j * BLOCK_SIZE, i * BLOCK_SIZE));
					block = 0; // Set to 0 (indicates empty block with no food)
					break;
				case ENTITIES.POWERPILL: // PowerPill
					blocks.push(new PowerPill(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case ENTITIES.GHOST: // Ghost
					for(const color of ghostsColors) {
						ghosts.push(new Ghost(j * BLOCK_SIZE, i * BLOCK_SIZE, color));
					}
					break;
			}
		})
	});
}