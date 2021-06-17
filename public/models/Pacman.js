import { BLOCK_SIZE, PLAYER_SPEED } from "../consts.js"

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
        this.direction = "r";
        this.speed = PLAYER_SPEED;
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
     */
    updatePosition() {
        switch(this.direction) {
            case "u": // up
                this.y -= this.speed;
                break;
            case "d": // down
                this.y += this.speed
                break;
            case "l": // left
                this.x -= this.speed
                break;
            case "r": // right
                this.x += this.speed 
                break;
        }
    }
}

export default Pacman;