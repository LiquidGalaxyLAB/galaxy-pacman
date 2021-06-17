// Grid width indicates how many block are in the horizontal side of your grid
export const GRID_WIDTH = 18;
// Grid height indicates how many block are in the vertical side of your grid
export const GRID_HEIGHT = 32;
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

/** *
 * Map layout for master screen
 * MAP INDEXES:
 * 0 -> Blank space.
 * 1 -> Wall.
 * 2 -> Food.
 * 3 -> Player.
 * 4 -> Power Pill.
*/
export const MASTER_MAP_LAYOUT = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1,
    1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1,
    1, 4, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 4, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1,
    0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0,
    1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2,
    1, 1, 1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1,
    1, 4, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 4, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1,
    1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1,
    1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1,
    1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1,
    1, 2, 2, 2, 3, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 4, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 4, 1,
    1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1,
    1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];