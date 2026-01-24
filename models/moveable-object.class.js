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
  gravityInterval;

  /**
   * Make the object jump by setting vertical speed
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Apply gravity to the object at 25 FPS
   */
  applyGravity() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);
    this.gravityInterval = setInterval(() => {
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
   * Check collision using hitbox offsets
   * @param {MoveableObject} mo - The object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    let thisBounds = this.getHitboxBounds();
    let moBounds = this.getOtherHitboxBounds(mo);
    return this.boundsOverlap(thisBounds, moBounds);
  }

  /**
   * Get hitbox bounds for this object
   * @returns {Object} Bounds object with left, right, top, bottom
   */
  getHitboxBounds() {
    return {
      left: this.x + this.hitboxOffsetLeft,
      right: this.x + this.width - this.hitboxOffsetRight,
      top: this.y + this.hitboxOffsetTop,
      bottom: this.y + this.height - this.hitboxOffsetBottom
    };
  }

  /**
   * Get hitbox bounds for another object
   * @param {MoveableObject} mo - The other object
   * @returns {Object} Bounds object
   */
  getOtherHitboxBounds(mo) {
    return {
      left: mo.x + mo.hitboxOffsetLeft,
      right: mo.x + mo.width - mo.hitboxOffsetRight,
      top: mo.y + mo.hitboxOffsetTop,
      bottom: mo.y + mo.height - mo.hitboxOffsetBottom
    };
  }

  /**
   * Check if two bounds objects overlap
   * @param {Object} a - First bounds
   * @param {Object} b - Second bounds
   * @returns {boolean} True if overlapping
   */
  boundsOverlap(a, b) {
    return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
  }

  /**
   * Apply damage to the object (reduces energy by 20)
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.lastHit = new Date().getTime();
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
