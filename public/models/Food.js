import { BLOCK_SIZE, FOOD_SIZE } from "../consts.js"

/**
 * Food dot object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = BLOCK_SIZE;
        this.width = BLOCK_SIZE;
        this.wasEaten = false;
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
		if(!this.wasEaten) {
            //if food hasn't been eaten draw on canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform before drawing
			const dotX = (this.x) + (this.width / 2) - FOOD_SIZE / 2;
			const dotY = (this.y) + (this.height / 2) - FOOD_SIZE / 2;
			ctx.fillStyle="white";
			ctx.fillRect(dotX, dotY, FOOD_SIZE,  FOOD_SIZE);
		}
	}
}

export default Food;