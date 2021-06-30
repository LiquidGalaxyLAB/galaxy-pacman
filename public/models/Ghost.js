import { BLOCK_SIZE, DIRECTIONS, PLAYER_SPEED_DIVIDER } from "../consts.js"

/**
 * Ghost object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class Ghost {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = BLOCK_SIZE;
        this.direction = DIRECTIONS.STOP; // start stopped
        this.speed = BLOCK_SIZE / PLAYER_SPEED_DIVIDER;
        this.color = "red"
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform before drawing
        ctx.fillStyle = this.color;

        let radius = this.size / 2

        // draw cricle
        ctx.beginPath();
        ctx.arc(this.x + radius, this.y + radius, radius, 0, 2 * Math.PI);
        ctx.fill()

        //draw rectangle on base
        ctx.fillRect(this.x, this.y + radius, this.size, radius)
    }
}

export default Ghost;