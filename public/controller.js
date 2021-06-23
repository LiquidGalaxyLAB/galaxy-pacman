//import constants and necessary classes
import { GRID_WIDTH, BLOCK_SIZE, WALL_LINE_WIDTH, MASTER_MAP_LAYOUT, SLAVE_MAP_LAYOUT, GAME_SPEED, TOP_OFFSET } from "./consts.js"
import WallBlock from "./models/WallBlock.js";
import Pacman from "./models/Pacman.js"
import Food from "./models/Food.js"
import PowerPill from "./models/PowerPill.js";

// get canvas element from index.html
const canvas = document.getElementById('gameCanvas');
canvas.height = window.innerHeight - TOP_OFFSET
canvas.width = BLOCK_SIZE * GRID_WIDTH + WALL_LINE_WIDTH

const ctx = canvas.getContext("2d");

// array of pacmans in the map
var pacmans = [];
// array of blocks in the map
var blocks = [];
// key that is being pressed -> null when none are pressed
var key = null;
// 
const currentMap = MASTER_MAP_LAYOUT

function startGame() {
	window.addEventListener('keydown', function(e) {
		key = e
	})

	window.addEventListener('keyup', function() {
		key = null
	})
	setInterval(function () {
		draw();
	}, GAME_SPEED
	);
}

function draw() {
	//clear before redrawing
	clearCanvas()

	//draw each block
	blocks.forEach(function (block) {
		block.draw(ctx);
	});

	//draw each pacman
	pacmans.forEach(function (pacman) {
		pacman.updatePosition(key, currentMap)
		pacman.draw(ctx);
	});
}

// clear canvas -> fill canvas with black rectangle
function clearCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// create game grid based on selected map layout
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

// create grid for desired map
createGrid(currentMap);
// start drawing loop
startGame();