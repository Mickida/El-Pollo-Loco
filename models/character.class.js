/**
 * The main playable character (Pepe)
 * @extends MoveableObject
 */
class Character extends MoveableObject {
  height = 280;
  x = 150;
  y = 155;

  // Hitbox offsets for realistic collision
  hitboxOffsetTop = 120;
  hitboxOffsetBottom = 10;
  hitboxOffsetLeft = 30;
  hitboxOffsetRight = 40;

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_SLEEPING = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING_UP = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
  ];

  IMAGES_JUMPING_DOWN = [
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  world;
  speed = 5;
  walkSoundPlaying = false;

  // Separate animation indices for smooth animations
  idleIndex = 0;
  sleepIndex = 0;
  walkIndex = 0;
  jumpUpIndex = 0;
  jumpDownIndex = 0;
  hurtIndex = 0;
  deadIndex = 0;

  // Track last activity for sleep animation
  lastActivityTime = new Date().getTime();
  sleepDelay = 7000; // 7 seconds until sleep animation

  // Track if currently in a jump
  isJumping = false;

  // Track current animation state for smooth transitions
  currentAnimationState = "idle";

  // Dead animation tracking
  deadAnimationFinished = false;
  deadAnimationFrame = 0;
  deadAnimationDelay = 0; // Delay counter to slow down dead animation

  // Store interval IDs for cleanup
  movementInterval;
  actionAnimationInterval;
  idleAnimationInterval;
  sleepAnimationInterval;

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING_UP);
    this.loadImages(this.IMAGES_JUMPING_DOWN);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
  }

  /**
   * Reset the activity timer - called when player does any action
   */
  resetActivityTimer() {
    this.lastActivityTime = new Date().getTime();
  }

  /**
   * Check if player has been inactive long enough for sleep animation
   * @returns {boolean}
   */
  isSleeping() {
    let timeSinceActivity = new Date().getTime() - this.lastActivityTime;
    return timeSinceActivity > this.sleepDelay;
  }

  /**
   * Play animation with a specific index counter for smooth animation
   * @param {string[]} images - Array of image paths
   * @param {string} indexName - Name of the index property to use
   */
  playAnimationSmooth(images, indexName) {
    let i = this[indexName] % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this[indexName]++;
  }

  /**
   * Play animation once (for jump) - returns true when complete
   * @param {string[]} images - Array of image paths
   * @param {string} indexName - Name of the index property to use
   * @returns {boolean} - True if animation completed
   */
  playAnimationOnce(images, indexName) {
    if (this[indexName] >= images.length) {
      return true; // Animation complete
    }
    let path = images[this[indexName]];
    this.img = this.imageCache[path];
    this[indexName]++;
    return false;
  }

  /**
   * Reset animation index when switching to a new animation
   * @param {string} newState - The new animation state
   */
  switchAnimationState(newState) {
    if (this.currentAnimationState !== newState) {
      this.currentAnimationState = newState;
      // Reset the relevant animation index
      switch (newState) {
        case "idle":
          this.idleIndex = 0;
          break;
        case "sleep":
          this.sleepIndex = 0;
          break;
        case "walk":
          this.walkIndex = 0;
          break;
        case "jumpUp":
          this.jumpUpIndex = 0;
          break;
        case "jumpDown":
          this.jumpDownIndex = 0;
          break;
        case "hurt":
          this.hurtIndex = 0;
          break;
        case "dead":
          this.deadIndex = 0;
          this.deadAnimationFrame = 0;
          this.deadAnimationDelay = 0;
          break;
      }
    }
  }

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
  }

  /**
   * Handle character movement at 60 FPS
   */
  startMovementLoop() {
    this.movementInterval = setInterval(() => {
      if (!this.world) return;
      if (this.isDead()) return; // Stop all movement when dead
      let isMoving = this.handleMovementInput();
      this.handleWalkSound(isMoving);
      this.handleJumpInput();
      this.updateJumpState();
      this.world.camera_x = -this.x + 130;
    }, 1000 / 60);
  }

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
  }

  /**
   * Play walk sound when moving on ground
   * @param {boolean} isMoving - Whether the character is moving
   */
  handleWalkSound(isMoving) {
    if (isMoving && !this.isAboveGround() && window.AudioManager) {
      window.AudioManager.playSfx("walk");
    }
  }

  /**
   * Process jump input
   */
  handleJumpInput() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.isJumping = true;
      this.jumpIndex = 0;
      this.resetActivityTimer();
      if (window.AudioManager) {
        window.AudioManager.playSfx("jump");
      }
    }
  }

  /**
   * Reset jump state when landing
   */
  updateJumpState() {
    if (!this.isAboveGround() && this.isJumping) {
      this.isJumping = false;
    }
  }

  /**
   * Handle action animations (dead, hurt, jump, walk) at 80ms intervals
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
  }

  /**
   * Play death animation once then mark as finished
   * Runs slower than other animations (every 200ms instead of 80ms)
   */
  playDeadAnimation() {
    if (this.currentAnimationState !== "dead") {
      this.switchAnimationState("dead");
    }
    if (this.deadAnimationFinished) {
      // Keep showing the last frame of the dead animation
      this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      return;
    }

    // Slow down animation: only advance frame every 2.5 calls (200ms instead of 80ms)
    this.deadAnimationDelay++;
    if (this.deadAnimationDelay < 2.5) {
      return; // Skip this frame update
    }
    this.deadAnimationDelay = 0;

    if (this.deadAnimationFrame < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[this.deadAnimationFrame];
      this.img = this.imageCache[path];
      this.deadAnimationFrame++;

      // Mark animation as finished when we've shown all frames
      if (this.deadAnimationFrame >= this.IMAGES_DEAD.length) {
        this.deadAnimationFinished = true;
        // Ensure last frame stays visible
        this.img =
          this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      }
    }
  }

  /**
   * Play hurt animation
   */
  playHurtAnimation() {
    this.switchAnimationState("hurt");
    this.playAnimationSmooth(this.IMAGES_HURT, "hurtIndex");
    this.resetActivityTimer();
  }

  /**
   * Play jump animation - rising animation while going up, falling while going down
   */
  playJumpAnimation() {
    if (this.speedY > 0) {
      this.switchAnimationState("jumpUp");
      this.playAnimationSmooth(this.IMAGES_JUMPING_UP, "jumpUpIndex");
    } else {
      this.switchAnimationState("jumpDown");
      this.playAnimationSmooth(this.IMAGES_JUMPING_DOWN, "jumpDownIndex");
    }
  }

  /**
   * Play walk animation
   */
  playWalkAnimation() {
    this.switchAnimationState("walk");
    this.playAnimationSmooth(this.IMAGES_WALKING, "walkIndex");
  }

  /**
   * Handle idle animation at 150ms intervals
   */
  startIdleAnimationLoop() {
    this.idleAnimationInterval = setInterval(() => {
      if (!this.world) return;
      if (this.isDead()) return;
      if (this.canPlayIdleAnimation()) {
        this.switchAnimationState("idle");
        this.playAnimationSmooth(this.IMAGES_IDLE, "idleIndex");
      }
    }, 150);
  }

  /**
   * Check if idle animation can be played
   * @returns {boolean} True if character should play idle animation
   */
  canPlayIdleAnimation() {
    return (
      !this.isDead() &&
      !this.isHurt() &&
      !this.isAboveGround() &&
      !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
      !this.isSleeping()
    );
  }

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
  }

  /**
   * Check if sleep animation can be played
   * @returns {boolean} True if character should play sleep animation
   */
  canPlaySleepAnimation() {
    return (
      !this.isDead() &&
      !this.isHurt() &&
      !this.isAboveGround() &&
      !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
      this.isSleeping()
    );
  }

  /**
   * Play sleep animation and start snoring
   */
  playSleepAnimation() {
    this.switchAnimationState("sleep");
    this.playAnimationSmooth(this.IMAGES_SLEEPING, "sleepIndex");
    if (window.AudioManager) {
      window.AudioManager.startSnoring();
    }
  }

  /**
   * Stop snoring sound
   */
  stopSnoring() {
    if (window.AudioManager) {
      window.AudioManager.stopSnoring();
    }
  }

  /**
   * Stop all intervals (for game restart/cleanup)
   */
  stopIntervals() {
    if (this.movementInterval) clearInterval(this.movementInterval);
    if (this.actionAnimationInterval)
      clearInterval(this.actionAnimationInterval);
    if (this.idleAnimationInterval) clearInterval(this.idleAnimationInterval);
    if (this.sleepAnimationInterval) clearInterval(this.sleepAnimationInterval);
    if (this.gravityInterval) clearInterval(this.gravityInterval);
  }
}
