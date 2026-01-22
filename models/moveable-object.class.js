/**
 * Base class for all moveable game objects
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Make the object jump by setting vertical speed
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Apply gravity to the object at 25 FPS
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Check if the object is above the ground
   * @returns {boolean} True if above ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 155;
    }
  }

  /**
   * Move the object to the right
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Move the object to the left
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Play animation by cycling through images
   * @param {string[]} images - Array of image paths
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Check collision using hitbox offsets for more accurate detection
   * @param {MoveableObject} mo - The object to check collision with
   * @returns {boolean} - True if objects are colliding
   */
  isColliding(mo) {
    // Calculate actual hitbox bounds for this object
    let thisLeft = this.x + this.hitboxOffsetLeft;
    let thisRight = this.x + this.width - this.hitboxOffsetRight;
    let thisTop = this.y + this.hitboxOffsetTop;
    let thisBottom = this.y + this.height - this.hitboxOffsetBottom;

    // Calculate actual hitbox bounds for the other object
    let moLeft = mo.x + mo.hitboxOffsetLeft;
    let moRight = mo.x + mo.width - mo.hitboxOffsetRight;
    let moTop = mo.y + mo.hitboxOffsetTop;
    let moBottom = mo.y + mo.height - mo.hitboxOffsetBottom;

    return (
      thisRight > moLeft &&
      thisLeft < moRight &&
      thisBottom > moTop &&
      thisTop < moBottom
    );
  }

  /**
   * Apply damage to the object (reduces energy by 5)
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Check if the object is dead
   * @returns {boolean} True if energy is 0
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Check if the object was recently hurt
   * @returns {boolean} True if hurt within last second
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }
}
