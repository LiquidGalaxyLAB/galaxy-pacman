import { BLOCK_SIZE, DIRECTIONS, PLAYER_SPEED_DIVIDER, ENTITIES } from "../consts.js"
import Player from "./Player.js"

/**
 * Ghost object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 * @param {String} color indicates object color
 */
class Ghost extends Player {
    constructor(x, y, color) {
        super(x, y, color)
        this.pacmanDir = DIRECTIONS.STOP
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform before drawing
        ctx.fillStyle = this.color;

        const headRadius = this.size / 2

        // draw cricle
        ctx.beginPath();
        ctx.arc(this.x + headRadius, this.y + headRadius, headRadius, 0, 2 * Math.PI);
        ctx.fill()

        //draw rectangle for body
        ctx.fillRect(this.x, this.y + headRadius, this.size, headRadius)

        //draw little circles for legs
        const nLegs = 3 // number of legs
        const legRadius = headRadius / nLegs
        ctx.beginPath();
        for (let i = 0; i < nLegs; i++) {
            ctx.arc(this.x + ((2 * i + 1) * legRadius), this.y + (2 * headRadius), legRadius, 0, 2 * Math.PI);
        }
        ctx.fill();

        //draw circles for white of the eyes
        const eyeXCenter = this.size / 3
        const eyeYCenter = this.size / 3
        ctx.fillStyle = "white";
        ctx.beginPath();
        // left eye
        ctx.arc(this.x + eyeXCenter, this.y + eyeYCenter, legRadius, 0, 2 * Math.PI);

        //right eye
        ctx.arc(this.x + (2 * headRadius) - eyeXCenter, this.y + eyeYCenter, legRadius, 0, 2 * Math.PI);
        ctx.fill();

        //draw circles for black of the eyes
        ctx.fillStyle = "black";
        ctx.beginPath();
        // left eye
        ctx.arc(this.x + eyeXCenter, this.y + eyeYCenter, legRadius / 2, 0, 2 * Math.PI);

        //right eye
        ctx.arc(this.x + (2 * headRadius) - eyeXCenter, this.y + eyeYCenter, legRadius / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    /**
     * Update position method -> update ghost position mirroring pacman direction
     * @param {String} pacmanDir indicates pacmanDirection
     * @param {Array} map two dimensional array with map layout
     */
    updatePosition(pacmanDir, map) {
        // TODO: Remove once starts working on multiplayer
        this.relativeX = null
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

        // If ghost is able to change direction or player is stopped
        if (this.moveInterval == PLAYER_SPEED_DIVIDER || this.direction == DIRECTIONS.STOP) {
            this.moveInterval = 0 // reset move interval

            // Get player row and col
            const row = Math.round(this.y / BLOCK_SIZE)
            const col = Math.round(this.x / BLOCK_SIZE)

            // Get blocks adjacent to ghost
            const above = map[row - 1][col]
            const below = map[row + 1][col]
            const right = map[row][col + 1]
            const left = map[row][col - 1]

            // Only allow direction change if next block is not wall or teleporter (inverted for ghost mirrored player behavior)
            if (this.pacmanDir !== pacmanDir && pacmanDir == DIRECTIONS.UP && below !== ENTITIES.WALL && below !== ENTITIES.TELEPORTER) {
                this.direction = DIRECTIONS.DOWN;
                this.facing = DIRECTIONS.DOWN
            } else if (this.pacmanDir !== pacmanDir && pacmanDir == DIRECTIONS.DOWN && above !== ENTITIES.WALL && above !== ENTITIES.TELEPORTER) {
                this.direction = DIRECTIONS.UP;
                this.facing = DIRECTIONS.UP
            } else if (this.pacmanDir !== pacmanDir && pacmanDir == DIRECTIONS.LEFT && right !== ENTITIES.WALL && right !== ENTITIES.TELEPORTER) {
                this.direction = DIRECTIONS.RIGHT
                this.facing = DIRECTIONS.RIGHT
            } else if (this.pacmanDir !== pacmanDir && pacmanDir == DIRECTIONS.RIGHT && left !== ENTITIES.WALL && left !== ENTITIES.TELEPORTER) {
                this.direction = DIRECTIONS.LEFT
                this.facing = DIRECTIONS.LEFT
            } else if (
                (this.direction == DIRECTIONS.UP && (above == ENTITIES.WALL || above == ENTITIES.TELEPORTER)) ||
                (this.direction == DIRECTIONS.DOWN && (below == ENTITIES.WALL || below == ENTITIES.TELEPORTER)) ||
                (this.direction == DIRECTIONS.LEFT && (left == ENTITIES.WALL || left == ENTITIES.TELEPORTER)) ||
                (this.direction == DIRECTIONS.RIGHT && (right == ENTITIES.WALL || right == ENTITIES.TELEPORTER))
            ) {
                // If next block is wall get new random direction for ghost
                this.direction = this.getRandomDirection({ above, below, right, left }) // stop
            }

            this.pacmanDir = pacmanDir //update pacman direction
        }
    }

    /**
     * Get random position method -> responsible for getting a random position based on possible moves
     * @param {Object} possibleMoves object with keys 'above', 'below', 'right', 'left' indicating what is on each direction of the ghost
     * @returns {String} value of randomly selected direction
     */
    getRandomDirection(possibleMoves) {
        //only allow movement to blocks that arent walls
        const allowedMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key] !== ENTITIES.WALL && possibleMoves[key] !== ENTITIES.TELEPORTER);

        //get random index from allowed moves
        const index = Math.floor(Math.random() * allowedMoves.length)

        //return direction based on random index chosen
        switch (allowedMoves[index]) {
            case 'above':
                return DIRECTIONS.UP;
            case 'below':
                return DIRECTIONS.DOWN;
            case 'right':
                return DIRECTIONS.RIGHT;
            case 'left':
                return DIRECTIONS.LEFT;
        }
    }
}

export default Ghost;