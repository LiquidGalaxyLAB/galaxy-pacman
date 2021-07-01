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
        this.size = BLOCK_SIZE;
        this.direction = DIRECTIONS.STOP; // start stopped
        this.speed = BLOCK_SIZE / PLAYER_SPEED_DIVIDER;
        this.color = "#FFFF00"
        // Move interval is responsible for deciding whether player can or cant change direction (if move interval == player speed divider)
        this.moveInterval = 0
        // variables used for pacman mouth animation
        this.mouthOpenValue = 40
        this.mouthPosition = -1
        // pacman currently facing direction
        this.facing = DIRECTIONS.RIGHT
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        if (this.mouthOpenValue <= 0)
            this.mouthPosition = 1; // positive for mouth opening
        else if (this.mouthOpenValue >= 40)
            this.mouthPosition = -1; // negative for mouth closing

        this.mouthOpenValue += (5 * this.mouthPosition); // subtract when closing add when opening

        // radius is size / 2 so that diameter is equal to block size
        let radius = this.size / 2
        ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform before drawing
        
        // set canvas to pacman center and rotate based on currently faced direction
        ctx.translate(this.x + radius, this.y + radius)
        switch(this.facing) {
            case DIRECTIONS.RIGHT:
                ctx.rotate(0 * Math.PI / 180);
                break;
            case DIRECTIONS.DOWN:  
                ctx.rotate(90 * Math.PI / 180);
                break;
            case DIRECTIONS.LEFT:
                ctx.rotate(180 * Math.PI / 180);
                break;
            case DIRECTIONS.UP:
                ctx.rotate(270 * Math.PI / 180);
                break;
        }
        
        // set canvas back to correct coordinates before drawing
        ctx.translate(-this.x - radius, -this.y - radius)

        ctx.beginPath();
        ctx.arc(this.x + radius, this.y + radius, radius, (Math.PI / 180) * this.mouthOpenValue, (Math.PI / 180) * (360 - this.mouthOpenValue));

        ctx.lineTo(this.x + radius, this.y + radius);
        ctx.fillStyle = this.color;
        ctx.fill();
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
                this.facing = DIRECTIONS.UP
            } else if (newDir == DIRECTIONS.DOWN && below !== ENTITIES.WALL) {
                this.direction = DIRECTIONS.DOWN;
                this.facing = DIRECTIONS.DOWN
            } else if (newDir == DIRECTIONS.LEFT && left !== ENTITIES.WALL) {
                this.direction = DIRECTIONS.LEFT
                this.facing = DIRECTIONS.LEFT
            } else if (newDir == DIRECTIONS.RIGHT && right !== ENTITIES.WALL) {
                this.direction = DIRECTIONS.RIGHT
                this.facing = DIRECTIONS.RIGHT
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