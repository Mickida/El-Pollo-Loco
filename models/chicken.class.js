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
  moveInterval;
  animateInterval;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 200 + Math.random() * 500;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.25;
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
    }, 200);
  }

  /**
   * Called when chicken is hit by a bottle
   */
  hit() {
    if (this.isDead) return;
    this.isDead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    // Stop movement
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.animateInterval) {
      clearInterval(this.animateInterval);
    }
  }
}
