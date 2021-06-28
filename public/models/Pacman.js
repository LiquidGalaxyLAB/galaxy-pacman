import { BLOCK_SIZE, PLAYER_SPEED_DIVIDER, DIRECTIONS, ENTITIES } from "../consts.js"

/**
 * Pacman object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class Pacman {
    constructor(x, y) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y
        this.height = BLOCK_SIZE;
        this.width = BLOCK_SIZE;
        this.direction = DIRECTIONS.STOP; // start stopped
        this.speed = BLOCK_SIZE / PLAYER_SPEED_DIVIDER;
        // Move interval is responsible for deciding whether player can or cant change direction (if move interval == player speed divider)
        this.moveInterval = 0
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }

    /**
     * Update position method -> update player position based on current direction and player speed
     * @param {String} newDir new direction from player input
     * @param {Array} map two dimensional array with map layout
     */
    updatePosition(newDir, map) {
        switch (this.direction) {
            case DIRECTIONS.UP: // up
                this.y -= this.speed
                this.moveInterval++
                break;
            case DIRECTIONS.DOWN: // down
                this.y += this.speed
                this.moveInterval++
                break;
            case DIRECTIONS.LEFT: // left
                this.x -= this.speed
                this.moveInterval++
                break;
            case DIRECTIONS.RIGHT: // right
                this.x += this.speed
                this.moveInterval++
                break;
        }

        // If player is able to change direction or player is stopped
        if (this.moveInterval == PLAYER_SPEED_DIVIDER || this.direction == DIRECTIONS.STOP) {
            this.moveInterval = 0 // reset move interval

            // Get player row and col
            const row = Math.round(this.y / BLOCK_SIZE)
            const col = Math.round(this.x / BLOCK_SIZE)

            // Get blocks adjacent to player
            const above = map[row - 1][col]
            const below = map[row + 1][col]
            const right = map[row][col + 1]
            const left = map[row][col - 1]

            // Only allow direction change if next block is not wall
            if (newDir == DIRECTIONS.UP && above !== ENTITIES.WALL) {
                this.direction = DIRECTIONS.UP;
            } else if (newDir == DIRECTIONS.DOWN && below !== ENTITIES.WALL) {
                this.direction = DIRECTIONS.DOWN;
            } else if (newDir == DIRECTIONS.LEFT && left !== ENTITIES.WALL) {
                this.direction = DIRECTIONS.LEFT
            } else if (newDir == DIRECTIONS.RIGHT && right !== ENTITIES.WALL) {
                this.direction = DIRECTIONS.RIGHT
            } else if (
                (this.direction == DIRECTIONS.UP && above == ENTITIES.WALL) ||
                (this.direction == DIRECTIONS.DOWN && below == ENTITIES.WALL) ||
                (this.direction == DIRECTIONS.LEFT && left == ENTITIES.WALL) ||
                (this.direction == DIRECTIONS.RIGHT && right == ENTITIES.WALL)
            ) {
                // If next block is wall stop player movement
                this.direction = DIRECTIONS.STOP // stop
            }
        }
    }
}

export default Pacman;