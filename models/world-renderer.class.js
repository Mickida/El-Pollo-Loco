/**
 * Rendering mixin for World class
 * Contains all drawing and rendering methods
 */
const WorldRenderer = {
  /**
   * Main draw loop - renders all game objects
   */
  draw() {
    if (this.gameOver) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawWorldObjects();
    this.drawFixedUI();
    this.requestNextFrame();
  },

  /**
   * Draw all objects that move with the camera
   */
  drawWorldObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.drawEndbossStatusBar();
    this.ctx.translate(-this.camera_x, 0);
  },

  /**
   * Draw endboss status bar above the endboss
   */
  drawEndbossStatusBar() {
    if (this.endboss) {
      this.endbossStatusBar.x = this.endboss.x + 25;
      this.endbossStatusBar.y = this.endboss.y - 10;
      this.addToMap(this.endbossStatusBar);
    }
  },

  /**
   * Draw fixed UI elements (status bars)
   */
  drawFixedUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
  },

  /**
   * Request next animation frame
   */
  requestNextFrame() {
    let self = this;
    this.animationFrameId = requestAnimationFrame(function () {
      self.draw();
    });
  },

  /**
   * Add multiple objects to the map
   * @param {DrawableObject[]} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  },

  /**
   * Add a single object to the map with flip handling
   * @param {DrawableObject} mo - The object to draw
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  },

  /**
   * Flip image horizontally for left-facing objects
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  },

  /**
   * Restore image after flipping
   * @param {DrawableObject} mo - The object to restore
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
};
