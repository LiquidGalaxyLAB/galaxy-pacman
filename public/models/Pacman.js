import { BLOCK_SIZE } from "../consts.js"

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
        this.speed = 4;
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }
}

export default Pacman;