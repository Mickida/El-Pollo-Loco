class SmallChicken extends MoveableObject {
  y = 385;
  height = 50;
  width = 50;

  // Hitbox offsets for realistic collision
  hitboxOffsetTop = 3;
  hitboxOffsetBottom = 3;
  hitboxOffsetLeft = 3;
  hitboxOffsetRight = 3;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  isDead = false;
  moveInterval;
  animateInterval;

  /**
   * Creates a new SmallChicken enemy
   * @param {number} baseX - Base x position, will be varied by ±100px
   */
  constructor(baseX = 500) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = baseX + (Math.random() * 200 - 100);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.25 + Math.random() * 0.35;
    this.animate();
  }

  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    this.animateInterval = setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 150);
  }

  /**
   * Called when small chicken is hit by a bottle or jumped on
   */
  hit() {
    if (this.isDead) return;
    this.isDead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    // Play death sound
    if (window.AudioManager) {
      window.AudioManager.playSfx("smallChickenDead");
    }
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.animateInterval) {
      clearInterval(this.animateInterval);
    }
  }
}
