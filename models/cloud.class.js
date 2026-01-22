/**
 * Cloud that moves across the sky and recycles when off-screen
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
  y = 40;
  height = 250;
  width = 500;
  levelWidth = 720 * 4;

  /**
   * Create a new cloud
   * @param {number|null} x - Starting x position (random if null)
   * @param {number} levelWidth - Width of the level for recycling
   */
  constructor(x = null, levelWidth = 720 * 4) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.levelWidth = levelWidth;
    this.x = x !== null ? x : Math.random() * this.levelWidth;
    this.speed = 0.15 + Math.random() * 0.1;
    this.animate();
  }

  /**
   * Start the cloud movement animation
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
      this.recycleIfOffScreen();
    }, 1000 / 60);
  }

  /**
   * Recycle cloud to right side when it moves off-screen
   */
  recycleIfOffScreen() {
    if (this.x + this.width < -100) {
      this.x = this.levelWidth + Math.random() * 500;
    }
  }
}
