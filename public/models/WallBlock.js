import { BLOCK_SIZE, WALL_COLOR, WALL_LINE_WIDTH } from '../consts.js'

/**
 * Wall block object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class WallBlock {
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
		ctx.strokeStyle= WALL_COLOR;
		ctx.lineWidth = WALL_LINE_WIDTH;
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.height, this.width);
		ctx.stroke();
	}
}

export default WallBlock;