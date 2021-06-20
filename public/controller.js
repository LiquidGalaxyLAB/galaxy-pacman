//import constants and necessary classes
import { GRID_WIDTH, BLOCK_SIZE, WALL_LINE_WIDTH, MASTER_MAP_LAYOUT, SLAVE_MAP_LAYOUT, TOP_OFFSET } from "./consts.js"
import WallBlock from "./models/WallBlock.js";
import Pacman from "./models/Pacman.js"
import Food from "./models/Food.js"
import PowerPill from "./models/PowerPill.js";

// get canvas element from index.html
const canvas = document.getElementById('gameCanvas');
canvas.height = window.innerHeight - TOP_OFFSET
canvas.width = BLOCK_SIZE * GRID_WIDTH + WALL_LINE_WIDTH

const ctx = canvas.getContext("2d");
// frames per second desired -> used in setInterval (1000/FPS)
const FPS = 30;

// array of pacmans in the map
var pacmans = [];
// array of blocks in the map
var blocks = [];
// key that is being pressed -> null when none are pressed
var key = null;

function startGame() {
	window.addEventListener('keydown', function(e) {
		key = e
	})
	window.addEventListener('keyup', function() {
		key = null
	})
	setInterval(function () {
		draw();
	}, 1000 / FPS
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
		if(key) pacman.direction = getDirection();
		pacman.updatePosition()
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
	// col and row value of current grid block
	var col = 0;
	var row = 0;

	map.forEach(block => {
		switch (block) {
			case 1: // Wall
				blocks.push(new WallBlock(col * BLOCK_SIZE, row * BLOCK_SIZE));
				break;
			case 2: // Food
				blocks.push(new Food(col * BLOCK_SIZE, row * BLOCK_SIZE));
				break;
			case 3: // Pacman
				pacmans.push(new Pacman(col * BLOCK_SIZE, row * BLOCK_SIZE));
				block = 0; // Set to 0 (indicates empty block with no food)
				break;
			case 4: // PowerPill
				blocks.push(new PowerPill(col * BLOCK_SIZE, row * BLOCK_SIZE));
				break;
		}

		if (col == GRID_WIDTH - 1) {
			// if row ended go to new row and back to first col
			row++;
			col = 0;
		} else {
			// else keep going on same row
			col++;
		}
	});
}

// get direction based on key pressed
function getDirection() {
	if(key.code == "ArrowUp") {
		return "u";
	} else if(key.code == "ArrowDown") {
		return "d";
	} else if(key.code == "ArrowLeft") {
		return "l"
	} else if(key.code == "ArrowRight") {
		return "r"
	}
}

// create grid for desired map
// createGrid(MASTER_MAP_LAYOUT);
createGrid(SLAVE_MAP_LAYOUT);
// start drawing loop
startGame();