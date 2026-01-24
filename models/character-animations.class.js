/**
 * Animation mixin for Character class
 * Contains all animation-related methods
 */
const CharacterAnimations = {
  /**
   * Start all animation loops for the character
   */
  animate() {
    this.stopIntervals();
    this.applyGravity();
    this.startMovementLoop();
    this.startActionAnimationLoop();
    this.startIdleAnimationLoop();
    this.startSleepAnimationLoop();
  },

  /**
   * Handle character movement at 60 FPS
   */
  startMovementLoop() {
    this.movementInterval = setInterval(() => {
      if (!this.world || this.isDead()) return;
      let isMoving = this.handleMovementInput();
      this.handleWalkSound(isMoving);
      this.handleJumpInput();
      this.updateJumpState();
      this.world.camera_x = -this.x + 130;
    }, 1000 / 60);
  },

  /**
   * Process left/right movement input
   * @returns {boolean} True if character is moving
   */
  handleMovementInput() {
    let isMoving = false;
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      isMoving = true;
      this.resetActivityTimer();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      isMoving = true;
      this.resetActivityTimer();
    }
    return isMoving;
  },

  /**
   * Play walk sound when moving on ground
   * @param {boolean} isMoving - Whether the character is moving
   */
  handleWalkSound(isMoving) {
    if (isMoving && !this.isAboveGround()) {
      playSoundEffect("walk");
    }
  },

  /**
   * Process jump input
   */
  handleJumpInput() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.isJumping = true;
      this.jumpIndex = 0;
      this.resetActivityTimer();
      playSoundEffect("jump");
    }
  },

  /**
   * Reset jump state when landing
   */
  updateJumpState() {
    if (!this.isAboveGround() && this.isJumping) {
      this.isJumping = false;
    }
  },

  /**
   * Handle action animations at 80ms intervals
   */
  startActionAnimationLoop() {
    this.actionAnimationInterval = setInterval(() => {
      if (!this.world) return;
      if (this.isDead()) {
        this.playDeadAnimation();
      } else if (this.isHurt()) {
        this.playHurtAnimation();
      } else if (this.isAboveGround()) {
        this.playJumpAnimation();
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playWalkAnimation();
      }
    }, 80);
  },

  /**
   * Play death animation once then mark as finished
   */
  playDeadAnimation() {
    if (this.currentAnimationState !== "dead") {
      this.switchAnimationState("dead");
    }
    if (this.deadAnimationFinished) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      return;
    }
    this.advanceDeadAnimation();
  },

  /**
   * Advance the dead animation frame
   */
  advanceDeadAnimation() {
    this.deadAnimationDelay++;
    if (this.deadAnimationDelay < 2.5) return;
    this.deadAnimationDelay = 0;
    if (this.deadAnimationFrame < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.deadAnimationFrame]];
      this.deadAnimationFrame++;
      if (this.deadAnimationFrame >= this.IMAGES_DEAD.length) {
        this.deadAnimationFinished = true;
        this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      }
    }
  },

  /**
   * Play hurt animation
   */
  playHurtAnimation() {
    this.switchAnimationState("hurt");
    this.playAnimationSmooth(this.IMAGES_HURT, "hurtIndex");
    this.resetActivityTimer();
  },

  /**
   * Play jump animation based on vertical direction
   */
  playJumpAnimation() {
    if (this.speedY > 0) {
      this.switchAnimationState("jumpUp");
      this.playAnimationSmooth(this.IMAGES_JUMPING_UP, "jumpUpIndex");
    } else {
      this.switchAnimationState("jumpDown");
      this.playAnimationSmooth(this.IMAGES_JUMPING_DOWN, "jumpDownIndex");
    }
  },

  /**
   * Play walk animation
   */
  playWalkAnimation() {
    this.switchAnimationState("walk");
    this.playAnimationSmooth(this.IMAGES_WALKING, "walkIndex");
  },

  /**
   * Handle idle animation at 150ms intervals
   */
  startIdleAnimationLoop() {
    this.idleAnimationInterval = setInterval(() => {
      if (!this.world || this.isDead()) return;
      if (this.canPlayIdleAnimation()) {
        this.switchAnimationState("idle");
        this.playAnimationSmooth(this.IMAGES_IDLE, "idleIndex");
      }
    }, 150);
  },

  /**
   * Check if idle animation can be played
   * @returns {boolean} True if character should play idle animation
   */
  canPlayIdleAnimation() {
    let notDead = !this.isDead();
    let notHurt = !this.isHurt();
    let onGround = !this.isAboveGround();
    let notMoving = !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT);
    let notSleeping = !this.isSleeping();
    return notDead && notHurt && onGround && notMoving && notSleeping;
  },

  /**
   * Handle sleep animation at 200ms intervals
   */
  startSleepAnimationLoop() {
    this.sleepAnimationInterval = setInterval(() => {
      if (this.world.gameOver || this.isDead()) {
        this.stopSnoring();
        return;
      }
      if (this.canPlaySleepAnimation()) {
        this.playSleepAnimation();
      } else {
        this.stopSnoring();
      }
    }, 200);
  },

  /**
   * Check if sleep animation can be played
   * @returns {boolean} True if character should play sleep animation
   */
  canPlaySleepAnimation() {
    let notDead = !this.isDead();
    let notHurt = !this.isHurt();
    let onGround = !this.isAboveGround();
    let notMoving = !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT);
    return notDead && notHurt && onGround && notMoving && this.isSleeping();
  },

  /**
   * Play sleep animation and start snoring
   */
  playSleepAnimation() {
    this.switchAnimationState("sleep");
    this.playAnimationSmooth(this.IMAGES_SLEEPING, "sleepIndex");
    if (window.AudioManager) window.AudioManager.startSnoring();
  },

  /**
   * Stop snoring sound
   */
  stopSnoring() {
    if (window.AudioManager) window.AudioManager.stopSnoring();
  },

  /**
   * Stop all intervals
   */
  stopIntervals() {
    if (this.movementInterval) clearInterval(this.movementInterval);
    if (this.actionAnimationInterval) clearInterval(this.actionAnimationInterval);
    if (this.idleAnimationInterval) clearInterval(this.idleAnimationInterval);
    if (this.sleepAnimationInterval) clearInterval(this.sleepAnimationInterval);
    if (this.gravityInterval) clearInterval(this.gravityInterval);
  }
};
