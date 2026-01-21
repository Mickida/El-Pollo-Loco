class ThrowableObject extends MoveableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  rotationIndex = 0;
  splashIndex = 0;
  isSplashing = false;
  hasHit = false;
  throwInterval;
  animationInterval;
  throwDirection = 1; // 1 = right, -1 = left

  constructor(x, y, throwLeft = false) {
    super();
    this.loadImage("img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 80;
    this.throwDirection = throwLeft ? -1 : 1;
    this.throw(x, y);
  }

  throw(x, y) {
    this.speedY = 30;
    this.x = x;
    this.y = y;
    this.applyGravity();

    // Movement interval - direction based on throwDirection
    this.throwInterval = setInterval(() => {
      if (!this.isSplashing) {
        this.x += 10 * this.throwDirection;
      }
    }, 25);

    // Rotation animation interval (slower rotation)
    this.animationInterval = setInterval(() => {
      if (!this.isSplashing) {
        this.playRotation();
      }
    }, 100);
  }

  /**
   * Play rotation animation
   */
  playRotation() {
    let i = this.rotationIndex % this.IMAGES_ROTATION.length;
    let path = this.IMAGES_ROTATION[i];
    this.img = this.imageCache[path];
    this.rotationIndex++;
  }

  /**
   * Check if bottle hit the ground (y > 350)
   * @returns {boolean}
   */
  hasHitGround() {
    return this.y > 350;
  }

  /**
   * Start splash animation when bottle hits something
   */
  startSplash() {
    if (this.isSplashing) return; // Already splashing

    this.isSplashing = true;
    this.hasHit = true;
    this.speedY = 0; // Stop vertical movement

    // Position splash at ground level (same as character)
    this.y = 350;

    // Clear movement interval
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
    }

    // Clear animation interval
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    // Play splash animation
    let splashInterval = setInterval(() => {
      if (this.splashIndex < this.IMAGES_SPLASH.length) {
        let path = this.IMAGES_SPLASH[this.splashIndex];
        this.img = this.imageCache[path];
        this.splashIndex++;
      } else {
        clearInterval(splashInterval);
        this.splashComplete = true;
      }
    }, 80);
  }
}
