/**
 * Normal chicken enemy that walks left and can be killed
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
  y = 370;
  height = 70;
  width = 70;

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
  health = 2;
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
      this.die();
    }
  }

  /**
   * Handle chicken death
   */
  die() {
    this.isDead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    playSoundEffect("chickenDead");
    this.stopIntervals();
  }

  /**
   * Draw the chicken and its health bar
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    super.draw(ctx);
    if (this.shouldShowHealthBar()) {
      this.drawHealthBar(ctx);
    }
  }

  /**
   * Check if health bar should be displayed
   * @returns {boolean} True if health bar should show
   */
  shouldShowHealthBar() {
    return this.health < this.maxHealth && !this.isDead;
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
    this.drawHealthBarBackground(ctx, barX, barY, barWidth, barHeight);
    this.drawHealthBarFill(ctx, barX, barY, barWidth, barHeight, healthPercent);
    this.drawHealthBarBorder(ctx, barX, barY, barWidth, barHeight);
  }

  /**
   * Draw health bar background
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Bar width
   * @param {number} height - Bar height
   */
  drawHealthBarBackground(ctx, x, y, width, height) {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height);
  }

  /**
   * Draw health bar fill
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Bar width
   * @param {number} height - Bar height
   * @param {number} percent - Health percentage
   */
  drawHealthBarFill(ctx, x, y, width, height, percent) {
    ctx.fillStyle = "lime";
    ctx.fillRect(x, y, width * percent, height);
  }

  /**
   * Draw health bar border
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Bar width
   * @param {number} height - Bar height
   */
  drawHealthBarBorder(ctx, x, y, width, height) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
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
