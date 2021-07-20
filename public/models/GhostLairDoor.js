import { BLOCK_SIZE, LAIR_DOOR_COLOR, WALL_LINE_WIDTH } from '../consts.js'

/**
 * Wall block object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class GhostLairDoor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = BLOCK_SIZE
        this.height = BLOCK_SIZE
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform before drawing
        ctx.fillStyle = LAIR_DOOR_COLOR
        ctx.fillRect(this.x, this.y + this.height / 2, this.width,  this.height / 10)
	}
}

export default GhostLairDoor;