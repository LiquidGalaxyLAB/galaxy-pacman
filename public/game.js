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
	PLAYERTYPES,
	PACMANEAT_SCORE_VALUE,
	GHOST_DEATH_SCORE_LOSS,
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
var players = {}; // object containing players information. the object key is the id of the players constroller socket
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
		// if player not added yet -> create based on type
		if (!Object.keys(players).includes(id)) {
			if (pls[id].type == PLAYERTYPES.PACMAN) {
				players[id] = pls[id]
				createPacman(players[id])
			} else if (pls[id].type == PLAYERTYPES.GHOST) {
				players[id] = pls[id]
				createGhost(players[id])
			}
		}
		playersFound[id] = true;
	};


	for (var id in players) {
		// if one of the players is no longer connected (not in the players object) delete from object and corresponding array
		if (!Object.keys(playersFound).includes(id)) {
			if (players[id].type == PLAYERTYPES.PACMAN) {
				let index = pacmans.findIndex(pacman => pacman.id == id)
				pacmans.splice(index, 1)
				delete players[id];
			} else if (players[id].type == PLAYERTYPES.GHOST) {
				let index = ghosts.findIndex(ghost => ghost.id == id)
				ghosts.splice(index, 1)
				delete players[id];
			}

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
		pacmans.push(new Pacman(pacman.x, pacman.y, pacman.color, pacman.id))
	}
}
socket.on('create-pacman', onCreatePacman)

/**
 * On Create Ghost method -> responsible for creating ghost on other screens
 * @param {Object} ghost object with all information needed to create the ghost
 */
function onCreateGhost(ghost) {
	if (screenNumber !== ghost.screen) {
		ghosts.push(new Ghost(ghost.x, ghost.y, ghost.color, ghost.id))
	}
}
socket.on('create-ghost', onCreateGhost)

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
 * On Pacman Death method -> responsible for resetting pacman on death
 * @param {Object} pl player object with reset stats and new amount of lives
 */
function onPacmanDeath(pl) {
	const id = pl.id


	pacmans.forEach(pacman => {
		if (pacman.id == id) { pacman.reset(players[id], nScreens) }
	})
}
socket.on('pacman-death', onPacmanDeath)

/**
 * On Ghost Death method -> responsible for resetting ghost on death
 * @param {Object} pl player object with reset stats and new amount of lives
 */
function onGhostDeath(pl) {
	const id = pl.id

	ghosts.forEach(ghost => {
		if (ghost.id == id) { ghost.reset(players[id], nScreens) }
	})
}
socket.on('ghost-death', onGhostDeath)

/**
 * Set foods eaten method -> set all foods eaten for specific screen
 * @param {Number} screen number of the screen where all foods were eaten
 */
function setFoodsEaten(screen) {
	allFoodsEaten[screen] = true
	gameOver = isGameOver() //check if game over
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
	defaultGhosts = []
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
// Array of ghosts that spawn with ai (non player ghosts)
var defaultGhosts = []

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
			const pacmanId = pacman.id
			checkPlayerScreen(pacmanId)
			if (allowGameStart) pacman.updatePosition(players[pacmanId].direction, screenNumber, nScreens, players[pacmanId])
			else pacman.updateFixedPosition(screenNumber, nScreens, players[pacmanId])
			const pacmanPos = pacman.getRowCol()

			// Check collision with default ghosts
			for (const ghost of defaultGhosts) {
				const ghostPos = ghost.getRowCol()

				// only collide if position is same and player has moved
				if (ghostPos.row == pacmanPos.row && ghostPos.col == pacmanPos.col && ENABLE_GHOST_COLLISION && players[pacmanId].hasMoved) {
					if (!pacman.isPoweredUp) {
						players[pacmanId].direction = DIRECTIONS.STOP
						players[pacmanId].screen = players[pacmanId].startScreen
						players[pacmanId].x = players[pacmanId].startX
						players[pacmanId].y = players[pacmanId].startY
						players[pacmanId].lives--
						pacman.x = players[pacmanId].startX
						pacman.y = players[pacmanId].startY
						players[pacmanId].hasMoved = false
						socket.emit('pacman-death', players[pacmanId])
						socket.emit('play-audio', 'death')
					} else {
						ghost.reset()
						players[pacmanId].score += GHOSTEAT_SCORE_VALUE
						socket.emit('update-players-info', players[pacmanId])
						socket.emit('play-audio', 'eatGhost')
					}
				}
			}

			// Check collision with player ghosts
			for (const ghost of ghosts) {
				const ghostId = ghost.id
				const ghostPos = ghost.getRowCol()

				// only collide if position is same and player has moved
				if (ghostPos.row == pacmanPos.row && ghostPos.col == pacmanPos.col && ENABLE_GHOST_COLLISION && players[pacmanId].hasMoved) {
					if (!pacman.isPoweredUp) {
						players[pacmanId].direction = DIRECTIONS.STOP
						players[pacmanId].screen = players[pacmanId].startScreen
						players[pacmanId].x = players[pacmanId].startX
						players[pacmanId].y = players[pacmanId].startY
						pacman.x = players[pacmanId].startX
						pacman.y = players[pacmanId].startY
						players[pacmanId].hasMoved = false
						socket.emit('pacman-death', players[pacmanId])
						socket.emit('play-audio', 'death')

						// add score for ghost
						players[ghostId].score += PACMANEAT_SCORE_VALUE
						socket.emit('update-players-info', players[ghostId])
					} else {
						//reset ghost
						players[ghostId].direction = DIRECTIONS.STOP
						players[ghostId].screen = players[ghostId].startScreen
						players[ghostId].x = players[ghostId].startX
						players[ghostId].y = players[ghostId].startY
						ghost.x = players[ghostId].startX
						ghost.y = players[ghostId].startY
						players[ghostId].hasMoved = false
						socket.emit('ghost-death', players[ghostId])

						//add score to pacman
						players[pacmanId].score += GHOSTEAT_SCORE_VALUE
						socket.emit('update-players-info', players[pacmanId])

						// remove score from ghost
						players[ghostId].score -= GHOST_DEATH_SCORE_LOSS
						if(players[ghostId].score < 0) players[ghostId].score = 0
						socket.emit('update-players-info', players[ghostId])

						//play sound
						socket.emit('play-audio', 'eatGhost')
					}
				}
			}

			// food/powerpill eating logic
			if (players[pacmanId].currentMap == "master" && screenNumber == 1) {
				if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.FOOD && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					players[pacmanId].score += FOOD_SCORE_VALUE
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set food to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[pacmanId])
				} else if (currentMap[pacmanPos.row][pacmanPos.col] == ENTITIES.POWERPILL && !blocks[pacmanPos.row][pacmanPos.col]?.wasEaten) {
					players[pacmanId].score += POWERPILL_SCORE_VALUE
					players[pacmanId].isPoweredUp = true
					blocks[pacmanPos.row][pacmanPos.col].wasEaten = true; // set pill to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[pacmanId])
					socket.emit('set-powerup', { duration: POWERPILL_DURATION, value: true, playerId: pacmanId })
				}
			} else if (players[pacmanId].currentMap == "slave" && screenNumber !== 1 && players[pacmanId].screen == screenNumber) {
				const playerPos = players[pacmanId].pos
				//relative col calculation
				let isRightScreen = players[pacmanId].screen <= (Math.ceil(nScreens / 2));
				let offsetIndex = isRightScreen ? players[pacmanId].screen - 1 : ((nScreens + 1) - players[pacmanId].screen) * -1;
				let realtiveCol = playerPos.col - (offsetIndex * GRID_WIDTH)

				if (currentMap[playerPos.row][realtiveCol] == ENTITIES.FOOD && !blocks[playerPos.row][realtiveCol]?.wasEaten) {
					players[pacmanId].score += FOOD_SCORE_VALUE
					blocks[playerPos.row][realtiveCol].wasEaten = true; // set food to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[pacmanId])
				} else if (currentMap[playerPos.row][realtiveCol] == ENTITIES.POWERPILL && !blocks[playerPos.row][realtiveCol]?.wasEaten) {
					players[pacmanId].score += POWERPILL_SCORE_VALUE
					players[pacmanId].isPoweredUp = true
					blocks[playerPos.row][realtiveCol].wasEaten = true; // set pill to eaten
					availableFoods--
					if (availableFoods == 0) {
						socket.emit('set-foods-eaten', screenNumber)
					}
					socket.emit('play-audio', 'munch')
					socket.emit('update-players-info', players[pacmanId])
					socket.emit('set-powerup', { duration: POWERPILL_DURATION, value: true, playerId: pacmanId })
				}
			}

			// emit player position to all screens
			if (screenNumber == 1) {
				players[pacmanId].x = pacman.x
				players[pacmanId].y = pacman.y
				players[pacmanId].pos = pacman.getRowCol()
				socket.emit('update-players-info', players[pacmanId])
			}
			pacman.draw(ctx);
		});

		//draw player ghosts
		ghosts.forEach(function (ghost) {
			const ghostId = ghost.id

			checkPlayerScreen(ghostId)
			if (allowGameStart) ghost.updatePosition(players[ghostId].direction, screenNumber, nScreens, players[ghostId])
			else ghost.updateFixedPosition(screenNumber, nScreens, players[ghostId])

			// emit player position to all screens
			if (screenNumber == 1) {
				players[ghostId].x = ghost.x
				players[ghostId].y = ghost.y
				players[ghostId].pos = ghost.getRowCol()
				socket.emit('update-players-info', players[ghostId])
			}
			ghost.draw(ctx)
		})

		//draw default ghosts
		defaultGhosts.forEach(function (ghost) {
			const keys = Object.keys(players)
			// mirror first players movemnt
			if (allowGameStart && keys.length) ghost.updateAiPosition(players[keys[0]].direction, currentMap)
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

	createGhost(null) //null for ai controlled ghost
}

/**
 * Create Pacman method -> Get a random position for pacman spawn point and create pacman object in pacmans array
 * @param {Object} player player object containing info like player screen and current map
 */
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

		// get random coordinates
		const x = availablePositions[randomIndex].j * BLOCK_SIZE
		const y = availablePositions[randomIndex].i * BLOCK_SIZE

		// adapt based on screen
		let isRightScreen = player.screen <= (Math.ceil(nScreens / 2));
		let offsetIndex = isRightScreen ? player.screen - 1 : ((nScreens + 1) - player.screen) * -1;
		let relativeX = x + (window.innerWidth * offsetIndex)
		const masterPacman = new Pacman(x, y, player.color, null) // pacman with original coordinates (used for getting row and col)

		// create pacman
		const newPacman = new Pacman(relativeX, y, player.color, player.id) // pacman with relative coordinates
		pacmans.push(newPacman)
		player.x = relativeX
		player.y = y
		player.startX = relativeX
		player.startY = y
		player.pos = masterPacman.getRowCol()
		socket.emit('update-players-info', player)

		const pacmanAux = {
			x: relativeX, y, color: player.color, id: player.id, screen: screenNumber,
		}
		socket.emit('create-pacman', pacmanAux)
	}
}

/**
 * Create Ghost method -> Get a random position for ghost spawn point and create ghost object in ghosts array
 * @param {Object} player player object containing info like player screen and current map
 */
function createGhost(player) {

	let availableColors = Array.from(ghostsColors);

	// array of available positions
	const availablePositions = []
	currentMap.forEach((row, i) => {
		row.forEach((block, j) => {
			if (block == ENTITIES.GHOSTLAIR) availablePositions.push({ i, j })
		})
	})

	let randomIndex;
	if (player == null) { // add one ghost with ai
		//get color
		randomIndex = Math.floor(Math.random() * availableColors.length)
		let color = availableColors[randomIndex]
		availableColors.splice(randomIndex, 1)

		//get position
		randomIndex = Math.floor(Math.random() * availablePositions.length)

		//create ghost
		const x = availablePositions[randomIndex].j * BLOCK_SIZE
		const y = availablePositions[randomIndex].i * BLOCK_SIZE
		defaultGhosts.push(new Ghost(x, y, color));
	} else {
		randomIndex = Math.floor(Math.random() * availablePositions.length)

		if (screenNumber == player.screen) {
			//create ghost

			// get random coordinates
			const x = availablePositions[randomIndex].j * BLOCK_SIZE
			const y = availablePositions[randomIndex].i * BLOCK_SIZE

			// adapt based on screen
			let isRightScreen = player.screen <= (Math.ceil(nScreens / 2));
			let offsetIndex = isRightScreen ? player.screen - 1 : ((nScreens + 1) - player.screen) * -1;
			let relativeX = x + (window.innerWidth * offsetIndex)
			const masterGhost = new Ghost(x, y, player.color) // ghost with original coordinates (used for getting row and col)

			// create ghost
			const newGhost = new Ghost(relativeX, y, player.color, player.id) // ghost with relative coordinates
			ghosts.push(newGhost)
			player.x = relativeX
			player.y = y
			player.startX = relativeX
			player.startY = y
			player.pos = masterGhost.getRowCol()
			socket.emit('update-players-info', player)

			const ghostAux = {
				x: relativeX, y, color: player.color, id: player.id, screen: screenNumber,
			}
			socket.emit('create-ghost', ghostAux)
		}
	}
}

/**
 * Is Game Over method -> Check if game is over
 * @param {Object} player player object containing amount of lives and other info
 */
function isGameOver() {
	// check player lives
	// if (player.lives <= 0) {
	// 	AudioController.stop('siren')
	// 	AudioController.stop('powerSiren')
	// 	centerText.innerHTML = "GAME OVER"
	// 	centerText.style = "display: block"
	// 	socket.emit('game-end', false) //set victory as false
	// 	return true
	// }

	// check if all foods were eaten
	const foodsEaten = Object.values(allFoodsEaten)
	// if no screens with available foods are found -> game over (pacman wins)
	if (!foodsEaten.includes(false)) {
		AudioController.stop('siren')
		AudioController.stop('powerSiren')
		centerText.innerHTML = "YOU WIN!"
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