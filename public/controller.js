//import constants and necessary classes
import {
	GRID_WIDTH,
	BLOCK_SIZE,
	WALL_LINE_WIDTH,
	MASTER_MAP_LAYOUT,
	SLAVE_MAP_LAYOUT,
	TOP_OFFSET,
	SHOW_STATUS,
	DIRECTIONS,
	ENTITIES,
	ENABLE_GHOST_COLLISION,
	FOOD_SCORE_VALUE,
	GHOSTEAT_SCORE_VALUE,
	POWERPILL_SCORE_VALUE,
	POWERPILL_DURATION,
} from "./consts.js"
import WallBlock from "./models/WallBlock.js";
import Pacman from "./models/Pacman.js"
import Food from "./models/Food.js"
import PowerPill from "./models/PowerPill.js";
import Ghost from "./models/Ghost.js";
import Stats from "./js/stats.module.js";
import AudioController from './AudioController.js'
const ghostsColors = ["#FF0000", "#FFB8FF", "#FFB852", "#00FFFF"]

// game audio setup
AudioController.loadAll()

// Show status setup
let container = document.createElement('div');
document.body.appendChild(container);
let stats = new Stats();
if (SHOW_STATUS) container.appendChild(stats.dom);

// Variables
let screenNumber, nScreens, allFoodsEaten = {};
let currentMap = MASTER_MAP_LAYOUT //default to master map
var player = {};
var centerText = document.getElementById('center-text')
var allowGameStart = false
var gameOver = false
var availableFoods = 0

// Socket listeners and functions
var socket = io()

function screenSetup(screen) {
	screenNumber = screen.number;
	nScreens = screen.nScreens;
	currentMap = screenNumber == 1 ? MASTER_MAP_LAYOUT : SLAVE_MAP_LAYOUT

	centerText.innerHTML = `${screenNumber == 1 ? 'PRESS SPACE TO START' : ''}`
	window.addEventListener('keydown', e => {
		if (e.code == 'Space') {
			centerText.style = "display: none"
			AudioController.play('gameStart')
			socket.emit('hide-initial-text')
		}
	})

	// initialize all foods eaten as false on all screens
	for (let i = 1; i <= nScreens; i++) {
		allFoodsEaten[i] = false
	}

	createGrid(currentMap)
	draw()
}
socket.on("new-screen", screenSetup)

/**
 * On Player Connected method -> responsible for setting player object to basic player
 * @param {Object} pl new player object from server containing initial information for player
 */
function onPlayerConnected(pl) {
	player = pl;
}
socket.on('new-player', onPlayerConnected)

/**
 * On Game Start method -> responsible for allowing game start
 */
function onGameStart() {
	allowGameStart = true
}
socket.on('allow-game-start', onGameStart)

/**
 * Hide initial text method -> responsible for hiding text over the game
 */
function hideInitText() {
	centerText.style = "display: none"
}
socket.on('hide-initial-text', hideInitText)

/**
 * Play Audio method -> responsible for playing audio based on name
 * @param {String} name name of the audio to be played
 */
function playAudio(name) {
	if (screenNumber == 1) {
		AudioController.play(name)
	}
}
socket.on('play-audio', playAudio)

/**
 * Stop Audio method -> responsible for stopping audio based on name
 * @param {String} name name of the audio to be stopped
 */
 function stopAudio(name) {
	if (screenNumber == 1) {
		AudioController.stop(name)
	}
}
socket.on('stop-audio', stopAudio)

/**
 * Play Audio method -> responsible for playing unique audio based on name
 * @param {String} name name of the audio to be played
 */
function playUniqueAudio(name) {
	if (screenNumber == 1) {
		AudioController.playUniqueAudio(name)
	}
}
socket.on('play-unique-audio', playUniqueAudio)

/**
 * Switch siren method -> responsible for switching sirens when powerup is picked up/runs out
 */
function switchSiren() {
	if (screenNumber == 1) {
		AudioController.switchSiren()
	}
}
socket.on('switch-siren', switchSiren)

// Direction from controller
let currentDirection = DIRECTIONS.STOP // init standing still

/**
 * Update direction method -> responsible for changing current direction to new direction
 * @param {String} dir indicates the new direction
 */
function updateDirection(dir) {
	if (allowGameStart) {
		currentDirection = dir
		if (dir !== DIRECTIONS.STOP) {
			player.hasMoved = true;
			socket.emit('update-player-info', player)
		}
	}
}
socket.on('updateDirection', updateDirection)

/**
 * Update player position method -> responsible for updating player position
 * @param {Object} pl player object containing player info with new position
 */
function updatePlayerPos(pl) {
	if (screenNumber != 1) {
		player = pl
	}
}
socket.on('update-player-pos', updatePlayerPos)

/**
 * Update player info method -> responsible for updating player info
 * @param {Object} pl player object containing new player info to update
 */
function updatePlayerInfo(pl) {
	player.screen = pl.screen
	player.currentMap = pl.currentMap
	player.score = pl.score
	player.isPoweredUp = pl.isPoweredUp
	player.hasMoved = pl.hasMoved
}
socket.on('update-player-info', updatePlayerInfo)

/**
 * Reset Player method -> responsible for resetting player on death and defining if game is over
 * @param {Object} pl player object with reset stats and new amount of lives
 */
function resetPlayer(pl) {
	console.log('reset', pl)
	currentDirection = DIRECTIONS.STOP
	player = pl
	gameOver = isGameOver(pl)
	// TODO: change to player id later (currently player is always index 0)
	pacmans[0].reset()
}
socket.on('player-death', resetPlayer)

/**
 * Set foods eaten method -> set all foods eaten for specific screen
 * @param {Number} screen number of the screen where all foods were eaten
 */
function setFoodsEaten(screen) {
	allFoodsEaten[screen] = true
	gameOver = isGameOver(player) //check if game over
}
socket.on('set-foods-eaten', setFoodsEaten)

/**
 * On set powerup method -> update player isPoweredUp status
 * @param {Object} payload payload object containing value key (boolean containing isPoweredUp status)
 */
function onSetPowerup(payload) {
	if (payload.value == false) {
		player.isPoweredUp = false;
		socket.emit('update-player-info', player)
	}
}
socket.on('set-powerup', onSetPowerup)

function onGameRestart(pl) {
	//restart variables
	currentDirection = DIRECTIONS.STOP
	player = pl
	blocks = []
	pacmans = []
	ghosts = []
	gameOver = false
	centerText.style = 'display: none'
	allowGameStart = false

	// redraw map
	createGrid(currentMap)

	// restart audio
	AudioController.gameStartSoundFinished = false
	AudioController.play('gameStart')
}
socket.on('restart-game', onGameRestart)

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
	if (screenNumber == 1) {
		allowGameStart = AudioController.gameStartSoundFinished
		if (allowGameStart) {
			socket.emit('allow-game-start')
		}
	}
	//clear before redrawing (important to reset transform before drawing)
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	clearCanvas()

	//draw each block
	blocks.forEach(row => {
		row.forEach(block => {
			if (block) block.draw(ctx);
		})
	});

	if (!gameOver) {
		//draw each pacman
		pacmans.forEach(function (pacman) {
			if (pacman.isPlayerOnScreen()) {
				player.screen = screenNumber;
				player.currentMap = screenNumber == 1 ? 'master' : 'slave'
				socket.emit('update-player-info', player)
			}

			if (allowGameStart || screenNumber !== 1) pacman.updatePosition(currentDirection, screenNumber, nScreens, player)
			const pacmanPos = pacman.getRowCol()
			for (const ghost of ghosts) {
				const ghostPos = ghost.getRowCol()

				// only collide if position is same and player has moved
				if (ghostPos.row == pacmanPos.row && ghostPos.col == pacmanPos.col && ENABLE_GHOST_COLLISION && player.hasMoved) {
					if (!pacman.isPoweredUp) {
						currentDirection = DIRECTIONS.STOP
						pacman.reset()
						player.x = pacman.x
						player.y = pacman.y
						player.screen = 1
						player.currentMap = 'master'
						player.hasMoved = false
						socket.emit('player-death', player)
						socket.emit('play-unique-audio', 'death')
					} else {
						ghost.reset()
						player.score += GHOSTEAT_SCORE_VALUE
						socket.emit('update-player-info', player)
						socket.emit('play-audio', 'eatGhost')
					}
				}
			}

			// food/powerpill eating logic
			if (player.currentMap == "master" && screenNumber == 1) {
				if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.FOOD && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					player.score += FOOD_SCORE_VALUE
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set food to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-player-info', player)
				} else if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.POWERPILL && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					player.score += POWERPILL_SCORE_VALUE
					player.isPoweredUp = true
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set pill to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-player-info', player)
					socket.emit('set-powerup', { duration: POWERPILL_DURATION, value: true})
				}
			} else if (player.currentMap == "slave" && screenNumber !== 1) {
				if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.FOOD && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					player.score += FOOD_SCORE_VALUE
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set food to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-player-info', player)
				} else if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.POWERPILL && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					player.score += POWERPILL_SCORE_VALUE
					player.isPoweredUp = true
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set pill to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-player-info', player)
					socket.emit('set-powerup', { duration: POWERPILL_DURATION, value: true})
				}
			}

			// emit player position to all screens
			if (screenNumber == 1) {
				player.x = pacman.x
				player.y = pacman.y
				socket.emit('update-player-pos', player)
			}
			pacman.draw(ctx);
		});

		//draw ghosts
		ghosts.forEach(function (ghost) {
			if (allowGameStart) ghost.updatePosition(currentDirection, currentMap)
			ghost.draw(ctx)
		})
	}

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
		blocks.push([])
		row.forEach((block, j) => {
			switch (block) {
				case ENTITIES.WALL: // Wall
					blocks[i].push(new WallBlock(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case ENTITIES.FOOD: // Food
					availableFoods++
					blocks[i].push(new Food(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case ENTITIES.PACMAN: // Pacman
					player.x = j * BLOCK_SIZE
					player.y = i * BLOCK_SIZE
					let food = new Food(j * BLOCK_SIZE, i * BLOCK_SIZE)
					food.wasEaten = true
					blocks[i].push(food)
					pacmans.push(new Pacman(j * BLOCK_SIZE, i * BLOCK_SIZE, "#FFFF00"));
					break;
				case ENTITIES.POWERPILL: // PowerPill
					availableFoods++
					blocks[i].push(new PowerPill(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case ENTITIES.GHOST: // Ghost
					for (const color of ghostsColors) {
						ghosts.push(new Ghost(j * BLOCK_SIZE, i * BLOCK_SIZE, color));
					}
					blocks[i].push(null);
					break;
				default:
					blocks[i].push(null);
					break;
			}
		})
	});
}

/**
 * Is Game Over method -> Check if game is over
 * @param {Object} player player object containing amount of lives and other info
 */
function isGameOver(player) {
	// check player lives
	if (player.lives <= 0) {
		AudioController.stop('siren')
		AudioController.stop('powerSiren')
		centerText.innerHTML = "GAME OVER"
		centerText.style = "display: block"
		socket.emit('game-end', false) //set victory as false
		return true
	}

	// check if all foods were eaten
	const foodsEaten = Object.values(allFoodsEaten)
	// if no screens with available foods are found -> game over (pacman wins)
	if (!foodsEaten.includes(false)) {
		AudioController.stop('siren')
		AudioController.stop('powerSiren')
		centerText.innerHTML = "YOU WIN"
		centerText.style = "display: block"
		socket.emit('game-end', true) // set victory as true
		return true
	}

	return false
}