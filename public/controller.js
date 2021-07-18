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
import GhostLairDoor from "./models/GhostLairDoor.js";
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
var players = {};
var centerText = document.getElementById('center-text')
var allowGameStart = false
var gameOver = false
var availableFoods = 0

// Socket listeners and functions
var socket = io()

/**
 * Screen setup method -> responsible for setting variables for screen
 * @param {Object} screen screen object containing info like screen number and total of screens
 */
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
 * Update Players Object method -> responsible for adding or removing players from players object
 * @param {Object} pls players object with all currently connected players from server
 */
function onUpdatePlayersObj(pls) {
	var playersFound = {};
	for (var id in pls) {
		// if player not added yet -> create
		if (!Object.keys(players).includes(id)) {
			players[id] = pls[id]
			createPacman(players[id])
		}
		playersFound[id] = true;
	};


	for (var id in players) {
		// if one of the players is no longer connected (not in the players object) delete from object and pacmans array
		if (!Object.keys(playersFound).includes(id)) {
			let index = pacmans.findIndex(pacman => pacman.id == id)
			pacmans.splice(index, 1)
			delete players[id];
		}
	}
}
socket.on('update-players-object', onUpdatePlayersObj)

/**
 * On Create Pacman method -> responsible for creating pacman on other screens
 * @param {Object} pacman object with all information needed to create the pacman
 */
function onCreatePacman(pacman) {
	if (screenNumber !== pacman.screen) {
		pacmans.push(new Pacman(pacman.startX, pacman.startY, pacman.color, pacman.id))
	}
}
socket.on('create-pacman', onCreatePacman)

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
 * Update player info method -> responsible for updating players object with new players info
 * @param {Object} pls players object containing new players info
 */
function updatePlayersInfo(pls) {
	for (var id in pls) {
		players[id] = pls[id]
	}
}
socket.on('update-players-info', updatePlayersInfo)

/**
 * Reset Player method -> responsible for resetting player on death and defining if game is over
 * @param {Object} pl player object with reset stats and new amount of lives
 */
function onPlayerDeath(pl) {
	const id = pl.id

	// TODO: Add game over
	// gameOver = isGameOver(pl)

	pacmans.forEach(pacman => {
		if (pacman.id == id) pacman.reset()
	})
}
socket.on('player-death', onPlayerDeath)

/**
 * Set foods eaten method -> set all foods eaten for specific screen
 * @param {Number} screen number of the screen where all foods were eaten
 */
function setFoodsEaten(screen) {
	allFoodsEaten[screen] = true
	// gameOver = isGameOver(player) //check if game over
}
socket.on('set-foods-eaten', setFoodsEaten)

/**
 * On set powerup method -> update player isPoweredUp status
 * @param {Object} payload payload object containing value key (boolean containing isPoweredUp status)
 */
function onSetPowerup(payload) {
	if (payload.value == false) {
		const id = payload.playerId
		players[id].isPoweredUp = false;
		socket.emit('update-players-info', players[id])
	}
}
socket.on('set-powerup', onSetPowerup)

/**
 * On Game Restart method -> responsible for restarting all variables and recreating grid
 */
function onGameRestart() {
	AudioController.stopAll()
	//restart variables
	players = {}
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
			const id = pacman.id
			checkPlayerScreen(id)
			if (allowGameStart) pacman.updatePosition(players[id].direction, screenNumber, nScreens, players[id])
			const pacmanPos = pacman.getRowCol()
			for (const ghost of ghosts) {
				const ghostPos = ghost.getRowCol()

				// only collide if position is same and player has moved
				if (ghostPos.row == pacmanPos.row && ghostPos.col == pacmanPos.col && ENABLE_GHOST_COLLISION && players[id].hasMoved) {
					if (!pacman.isPoweredUp) {
						players[id].direction = DIRECTIONS.STOP
						players[id].x = players[id].startX
						players[id].y = players[id].startY
						players[id].screen = 1
						players[id].currentMap = 'master'
						players[id].hasMoved = false
						socket.emit('update-players-info', players[id])
						socket.emit('player-death', players[id])
						socket.emit('play-audio', 'death')
					} else {
						ghost.reset()
						players[id].score += GHOSTEAT_SCORE_VALUE
						socket.emit('update-players-info', players[id])
						socket.emit('play-audio', 'eatGhost')
					}
				}
			}

			// food/powerpill eating logic
			if (players[id].currentMap == "master" && screenNumber == 1) {
				if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.FOOD && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					players[id].score += FOOD_SCORE_VALUE
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set food to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[id])
				} else if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.POWERPILL && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					players[id].score += POWERPILL_SCORE_VALUE
					players[id].isPoweredUp = true
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set pill to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[id])
					socket.emit('set-powerup', { duration: POWERPILL_DURATION, value: true, playerId: id })
				}
			} else if (players[id].currentMap == "slave" && screenNumber !== 1) {
				const playerPos = players[id].pos
				//relative col calculation
				let isRightScreen = players[id].screen <= (Math.ceil(nScreens / 2));
				let offsetIndex = isRightScreen ? players[id].screen - 1 : ((nScreens + 1) - player.screen) * -1;
				let realtiveCol = playerPos.col - (offsetIndex * GRID_WIDTH)

				if (currentMap[playerPos.row][realtiveCol] == ENTITIES.FOOD && !blocks[playerPos.row][realtiveCol]?.wasEaten) {
					players[id].score += FOOD_SCORE_VALUE
					blocks[playerPos.row][realtiveCol].wasEaten = true; // set food to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[id])
				} else if (currentMap[playerPos.row][realtiveCol] == ENTITIES.POWERPILL && !blocks[playerPos.row][realtiveCol]?.wasEaten) {
					players[id].score += POWERPILL_SCORE_VALUE
					players[id].isPoweredUp = true
					blocks[playerPos.row][realtiveCol].wasEaten = true; // set pill to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[id])
					socket.emit('set-powerup', { duration: POWERPILL_DURATION, value: true, playerId: id })
				}
			}

			// emit player position to all screens
			if (screenNumber == 1) {
				players[id].x = pacman.x
				players[id].y = pacman.y
				players[id].pos = pacman.getRowCol()
				socket.emit('update-players-info', players[id])
			}
			if (allowGameStart || screenNumber == players[id].screen) pacman.draw(ctx);
		});

		//draw ghosts
		ghosts.forEach(function (ghost) {
			const keys = Object.keys(players)
			// mirror first players movemnt
			if (allowGameStart && keys.length) ghost.updatePosition(players[keys[0]].direction, currentMap)
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
				case ENTITIES.POWERPILL: // PowerPill
					availableFoods++
					blocks[i].push(new PowerPill(j * BLOCK_SIZE, i * BLOCK_SIZE));
					break;
				case ENTITIES.GHOSTLAIR_DOOR:
					blocks[i].push(new GhostLairDoor(j * BLOCK_SIZE, i * BLOCK_SIZE))
					break;
				default:
					blocks[i].push(null);
					break;
			}
		})
	});

	createGhosts()
}

// Create Pacman method -> Get a random position for pacman spawn point and create pacman object in pacmans array
function createPacman(player) {
	const playerMap = player.currentMap == 'master' ? MASTER_MAP_LAYOUT : SLAVE_MAP_LAYOUT

	const availablePositions = []
	playerMap.forEach((row, i) => {
		row.forEach((block, j) => {
			if (block == ENTITIES.FOOD) availablePositions.push({ i, j })
		})
	})

	const randomIndex = Math.floor(Math.random() * availablePositions.length)

	if (screenNumber == player.screen) {
		//set food to eaten
		blocks[availablePositions[randomIndex].i][availablePositions[randomIndex].j].wasEaten = true
		availableFoods--;

		//create pacman
		const x = availablePositions[randomIndex].j * BLOCK_SIZE
		const y = availablePositions[randomIndex].i * BLOCK_SIZE
		pacmans.push(new Pacman(x, y, "#FFFF00", player.id))
		player.x = x
		player.y = y
		player.startX = x
		player.startY = y
		socket.emit('update-players-info', player)

		const pacman = {
			x, y, color: "#FFFF00", id: player.id, screen: screenNumber,
		}
		socket.emit('create-pacman', pacman)
	}
	console.log('pamcans', pacmans)
}

// Create Ghosts method -> Get a random position for ghosts spawn point and create ghosts objects in ghosts array
function createGhosts() {
	const amountOfGhosts = Math.floor(Math.random() * 4) + 1 // random number from 1 to 4

	let availableColors = Array.from(ghostsColors);

	const availablePositions = []
	currentMap.forEach((row, i) => {
		row.forEach((block, j) => {
			if (block == ENTITIES.GHOSTLAIR) availablePositions.push({ i, j })
		})
	})

	for (let i = 0; i < amountOfGhosts; i++) {
		//get color
		let randomIndex = Math.floor(Math.random() * availableColors.length)
		let color = availableColors[randomIndex]
		availableColors.splice(randomIndex, 1)

		//get position
		randomIndex = Math.floor(Math.random() * availablePositions.length)

		//create ghost
		const x = availablePositions[randomIndex].j * BLOCK_SIZE
		const y = availablePositions[randomIndex].i * BLOCK_SIZE
		ghosts.push(new Ghost(x, y, color));
	}
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

function checkPlayerScreen(playerId) {
	let width = window.innerWidth
	let x = players[playerId].x
	let screen

	if (x >= 0) {
		screen = Math.floor(x / width) + 1
	} else {
		screen = nScreens - Math.floor(-x / width)
	}

	players[playerId].screen = screen
	players[playerId].currentMap = screen == 1 ? 'master' : 'slave'

	socket.emit('update-players-info', players[playerId])
}