class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];

  // Game state
  inGrace = false; // Grace period - no damage taken
  gameOver = false;
  gameIntervals = []; // Store intervals for cleanup
  animationFrameId = null;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  run() {
    // Store interval references for cleanup
    let collisionInterval = setInterval(() => {
      if (!this.gameOver) {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkGameOver();
      }
    }, 200);
    this.gameIntervals.push(collisionInterval);
  }

  /**
   * Check if game should end
   */
  checkGameOver() {
    if (this.character.isDead() && !this.gameOver) {
      this.gameOver = true;
      // Trigger game over after death animation
      setTimeout(() => {
        if (window.endGame) {
          window.endGame("gameover");
        }
      }, 500);
    }
  }

  /**
   * Stop all game loops and intervals
   */
  stopGame() {
    this.gameOver = true;

    // Clear all intervals
    this.gameIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.gameIntervals = [];

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    // Skip collision damage during grace period
    if (this.inGrace) return;

    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);

        // Play hurt sound
        if (window.AudioManager) {
          window.AudioManager.playSfx("hurt");
        }
      }
    });
  }

  draw() {
    if (this.gameOver) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    this.animationFrameId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
