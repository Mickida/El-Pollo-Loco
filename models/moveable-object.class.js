class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  jump() {
    this.speedY = 30;
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 155;
    }
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

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

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }
}
