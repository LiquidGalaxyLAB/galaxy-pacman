import { BLOCK_SIZE, PLAYER_SPEED_DIVIDER } from "../consts.js"

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
        this.direction = "s";
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
            case "u": // up
                this.y -= this.speed
                this.moveInterval++
                break;
            case "d": // down
                this.y += this.speed
                this.moveInterval++
                break;
            case "l": // left
                this.x -= this.speed
                this.moveInterval++
                break;
            case "r": // right
                this.x += this.speed
                this.moveInterval++
                break;
        }

        // If player is able to change direction or player is stopped
        if (this.moveInterval == PLAYER_SPEED_DIVIDER || this.direction == "s") {
            this.moveInterval = 0 // reset move interval

            // Get player row and col
            const row = Math.round(this.y / BLOCK_SIZE)
            const col = Math.round(this.x / BLOCK_SIZE)

            // Get blocks adjacent to player
            const above = map[row - 1][col]
            const below = map[row + 1][col]
            const right = map[row][col + 1]
            const left = map[row][col - 1]

            // Only allow direction change if next block is not wall(id 1)
            if (newDir == "u" && above !== 1) {
                this.direction = "u";
            } else if (newDir == "d" && below !== 1) {
                this.direction = "d";
            } else if (newDir == "l" && left !== 1) {
                this.direction = "l"
            } else if (newDir == "r" && right !== 1) {
                this.direction = "r"
            } else if (
                (this.direction == "u" && above == 1) ||
                (this.direction == "d" && below == 1) ||
                (this.direction == "l" && left == 1) ||
                (this.direction == "r" && right == 1)
            ) {
                // If next block is wall (id 1) stop player movement -> set direction to s
                this.direction = "s" // stop
            }
        }
    }
}

export default Pacman;