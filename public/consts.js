// Grid width indicates how many block are in the horizontal side of your grid
export const GRID_WIDTH = 9;
// Grid height indicates how many block are in the vertical side of your grid
export const GRID_HEIGHT = 16;
// Top offset for adding text on top of game grid
export const TOP_OFFSET = 0
// Grid block based on the grid size and top offset chosen
export const BLOCK_SIZE = (window.innerHeight - TOP_OFFSET) / GRID_HEIGHT
// Color of the wall in the map
export const WALL_COLOR = "#2121DE"
// Wall line width calculated based on block size (higher denominator = thinner walls)
export const WALL_LINE_WIDTH = BLOCK_SIZE / 12
// Default food dot size calculated based on block size (higher denominator = smaller food)
export const FOOD_SIZE = BLOCK_SIZE / 10
// Power-up food pill size calculated based on block size (higher denominator = smaller pill)
export const POWER_PILL_SIZE = BLOCK_SIZE / 3
// Player speed divider -> denominator for player speed (higher number = slower player)
export const PLAYER_SPEED_DIVIDER = 15
// Should show game status? -> true if you want to show status
export const SHOW_STATUS = false
// Should have ghost collision? only use false for testing purposes
export const ENABLE_GHOST_COLLISION = true
// amount that is added to player score everytime a food is eaten
export const FOOD_SCORE_VALUE = 10
// amount that is added to player score everytime they eat a ghost
export const GHOSTEAT_SCORE_VALUE = 200
// amount that is added to player score everytime a power pill is eaten
export const POWERPILL_SCORE_VALUE = 50
// how long power pill effect lasts in milliseconds
export const POWERPILL_DURATION = 4000
// pacman amount of lives
export const PACMAN_LIVES = 5
// Ghost lair door color
export const LAIR_DOOR_COLOR = "#edd237"

// Direction constants (used for indicating direction of players)
//  -> IMPORTANT: each direction has to have a unique value between other directions
export const DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  STOP: "stop",
}

// Entities id's (IMPORTANT: Maps have to follow these id's) 
//  -> IMPORTANT: each entity has to have a unique id between other entities
export const ENTITIES = {
  VOID: 0,
  WALL: 1,
  FOOD: 2,
  PACMAN: 3,
  POWERPILL: 4,
  TELEPORTER: 5,
  GHOSTLAIR: 6,
  GHOSTLAIR_DOOR: 7,
  GHOST: 8,
}

export const PLAYERTYPES = {
  GHOST: 'ghost',
  PACMAN: 'pacman',
}

/** *
 * Map layout for master screen
 * MAP INDEXES:
 * 0 -> Blank space.
 * 1 -> Wall.
 * 2 -> Food.
 * 3 -> Player.
 * 4 -> Power Pill.
 * 5 -> Teleporter
 * 6 -> Ghost Lair
 * 7 -> Ghost Lair door
 * 7 -> Ghost
*/
export const MASTER_MAP_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 4, 1],
  [1, 2, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 7, 7, 7, 1, 2, 1],
  [5, 2, 1, 6, 8, 6, 1, 2, 5],
  [1, 2, 1, 6, 6, 6, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 4, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export const SLAVE_MAP_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 4, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 1, 2, 1],
  [1, 1, 1, 2, 2, 2, 1, 1, 1],
  [5, 2, 2, 2, 1, 2, 2, 2, 5],
  [1, 1, 1, 2, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 0, 1, 1, 2, 1],
  [1, 2, 1, 6, 6, 6, 1, 2, 1],
  [1, 2, 1, 6, 8, 6, 1, 2, 1],
  [1, 2, 1, 7, 7, 7, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
]