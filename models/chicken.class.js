/**
 * Normal chicken enemy that walks left and can be killed
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
  y = 370;
  height = 70;
  width = 70;

  // Hitbox offsets for realistic collision
  hitboxOffsetTop = 5;
  hitboxOffsetBottom = 5;
  hitboxOffsetLeft = 5;
  hitboxOffsetRight = 5;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  isDead = false;
  maxHealth = 2;
  health = 2; // Normal chickens take 2 hits to kill
  moveInterval;
  animateInterval;

  /**
   * Creates a new Chicken enemy
   * @param {number} baseX - Base x position, will be varied by ±100px
   */
  constructor(baseX = 350) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = baseX + (Math.random() * 200 - 100);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Start movement and animation loops
   */
  animate() {
    this.stopIntervals();
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  /**
   * Start the movement loop at 60 FPS
   */
  startMovementLoop() {
    this.moveInterval = setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
      }
    }, 1000 / 60);
  }

  /**
   * Start the walking animation loop
   */
  startAnimationLoop() {
    this.animateInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  /**
   * Called when chicken is hit by a bottle or jumped on
   */
  hit() {
    if (this.isDead) return;
    this.health--;
    if (this.health <= 0) {
      this.isDead = true;
      this.loadImage(this.IMAGES_DEAD[0]);
      // Play death sound
      if (window.AudioManager) {
        window.AudioManager.playSfx("chickenDead");
      }
      // Stop movement
      if (this.moveInterval) {
        clearInterval(this.moveInterval);
      }
      if (this.animateInterval) {
        clearInterval(this.animateInterval);
      }
    }
  }

  /**
   * Draw the chicken and its health bar
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    super.draw(ctx);
    // Only show health bar if damaged and not dead
    if (this.health < this.maxHealth && !this.isDead) {
      this.drawHealthBar(ctx);
    }
  }

  /**
   * Draw health bar above the chicken
   * @param {CanvasRenderingContext2D} ctx
   */
  drawHealthBar(ctx) {
    let barWidth = 40;
    let barHeight = 5;
    let barX = this.x + (this.width - barWidth) / 2;
    let barY = this.y - 10;
    let healthPercent = this.health / this.maxHealth;

    // Background (red)
    ctx.fillStyle = "red";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Health (green)
    ctx.fillStyle = "lime";
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    // Border
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  /**
   * Stop all intervals (for game restart/cleanup)
   */
  stopIntervals() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.animateInterval) {
      clearInterval(this.animateInterval);
    }
  }
}
