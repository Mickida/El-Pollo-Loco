/**
 * Static background image object
 * @extends MoveableObject
 */
class BackgroundObject extends MoveableObject {
  width = 720;
  height = 480;

  /**
   * Create a background object
   * @param {string} imagePath - Path to the background image
   * @param {number} x - X position
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
