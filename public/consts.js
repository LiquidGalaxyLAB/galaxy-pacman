// Grid width indicates how many block are in the horizontal side of your grid
export const GRID_WIDTH = 9;
// Grid height indicates how many block are in the vertical side of your grid
export const GRID_HEIGHT = 16;
// Top offset for adding text on top of game grid
export const TOP_OFFSET = 0
// Grid block based on the grid size and top offset chosen
export const BLOCK_SIZE = (window.innerHeight - TOP_OFFSET) / GRID_HEIGHT;
// Color of the wall in the map
export const WALL_COLOR = "#2121DE"
// Wall line width calculated based on block size (higher denominator = thinner walls)
export const WALL_LINE_WIDTH = BLOCK_SIZE / 12
// Default food dot size calculated based on block size (higher denominator = smaller food)
export const FOOD_SIZE = BLOCK_SIZE / 10
// Power-up food pill size calculated based on block size (higher denominator = smaller pill)
export const POWER_PILL_SIZE = BLOCK_SIZE / 3
// Player speed divider -> denominator for player speed (higher number = slower player)
export const PLAYER_SPEED_DIVIDER = 10
// Should show game status? -> true if you want to show status
export const SHOW_STATUS = false
// Should have ghost collision? only use false for testing purposes
export const ENABLE_GHOST_COLLISION = false

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
  GHOST: 5,
  TELEPORTER: 6
}

/** *
 * Map layout for master screen
 * MAP INDEXES:
 * 0 -> Blank space.
 * 1 -> Wall.
 * 2 -> Food.
 * 3 -> Player.
 * 4 -> Power Pill.
 * 5 -> Ghost
*/
// export const MASTER_MAP_LAYOUT = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
//   [1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1],
//   [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1],
//   [1, 4, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 4, 1],
//   [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
//   [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
//   [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
//   [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
//   [1, 2, 2, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1],
//   [1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1],
//   [0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0],
//   [1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1],
//   [1, 2, 2, 2, 2, 1, 2, 1, 0, 5, 1, 2, 1, 2, 2, 2, 2, 1], //add teleporter later
//   [1, 1, 1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1],
//   [1, 4, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 4, 1],
//   [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
//   [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
//   [1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1],
//   [1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1],
//   [1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1],
//   [1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1],
//   [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
//   [1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1],
//   [1, 2, 2, 2, 3, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1],
//   [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
//   [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
//   [1, 4, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 4, 1],
//   [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1],
//   [1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1],
//   [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];

// export const SLAVE_MAP_LAYOUT = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
//   [1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
//   [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
//   [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
//   [1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1],
//   [1, 2, 1, 0, 1, 2, 1, 1, 0, 0, 1, 1, 2, 1, 0, 1, 2, 1],
//   [1, 2, 1, 0, 1, 2, 1, 0, 0, 0, 0, 1, 2, 1, 0, 1, 2, 1],
//   [1, 4, 1, 0, 1, 2, 1, 0, 0, 0, 5, 1, 2, 1, 0, 1, 4, 1],
//   [1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1],
//   [0, 0, 0, 0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0],
//   [1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1],
//   [1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1], //add teleporter later
//   [1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1],
//   [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
//   [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1],
//   [1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1],
//   [1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1],
//   [1, 2, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 2, 1],
//   [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
//   [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
//   [1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1],
//   [1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1],
//   [1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1],
//   [1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 2, 1],
//   [1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1],
//   [1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1],
//   [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
//   [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
//   [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ]

// Smaller maps version
export const MASTER_MAP_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 4, 1],
  [1, 2, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [6, 2, 1, 0, 5, 0, 1, 2, 6],
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 2, 2, 3, 2, 2, 2, 1],
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
  [1, 1, 1, 2, 3, 2, 1, 1, 1],
  [6, 2, 5, 2, 1, 2, 2, 2, 6],
  [1, 1, 1, 2, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 0, 1, 1, 2, 1],
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [1, 2, 1, 1, 0, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
]