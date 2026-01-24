/**
 * The main playable character (Pepe)
 * @extends MoveableObject
 */
class Character extends MoveableObject {
  height = 280;
  x = 150;
  y = 155;

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

  idleIndex = 0;
  sleepIndex = 0;
  walkIndex = 0;
  jumpUpIndex = 0;
  jumpDownIndex = 0;
  hurtIndex = 0;
  deadIndex = 0;

  lastActivityTime = new Date().getTime();
  sleepDelay = 7000;

  isJumping = false;
  currentAnimationState = "idle";

  deadAnimationFinished = false;
  deadAnimationFrame = 0;
  deadAnimationDelay = 0;

  movementInterval;
  actionAnimationInterval;
  idleAnimationInterval;
  sleepAnimationInterval;

  /**
   * Create a new character instance
   */
  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadAllImages();
    this.applyGravity();
  }

  /**
   * Load all character animation images
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING_UP);
    this.loadImages(this.IMAGES_JUMPING_DOWN);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
  }

  /**
   * Reset the activity timer
   */
  resetActivityTimer() {
    this.lastActivityTime = new Date().getTime();
  }

  /**
   * Check if player has been inactive long enough for sleep
   * @returns {boolean} True if sleeping
   */
  isSleeping() {
    let timeSinceActivity = new Date().getTime() - this.lastActivityTime;
    return timeSinceActivity > this.sleepDelay;
  }

  /**
   * Play animation with smooth index counter
   * @param {string[]} images - Array of image paths
   * @param {string} indexName - Name of the index property
   */
  playAnimationSmooth(images, indexName) {
    let i = this[indexName] % images.length;
    this.img = this.imageCache[images[i]];
    this[indexName]++;
  }

  /**
   * Play animation once and return completion status
   * @param {string[]} images - Array of image paths
   * @param {string} indexName - Name of the index property
   * @returns {boolean} True if animation completed
   */
  playAnimationOnce(images, indexName) {
    if (this[indexName] >= images.length) return true;
    this.img = this.imageCache[images[this[indexName]]];
    this[indexName]++;
    return false;
  }

  /**
   * Switch to a new animation state
   * @param {string} newState - The new animation state
   */
  switchAnimationState(newState) {
    if (this.currentAnimationState === newState) return;
    this.currentAnimationState = newState;
    this.resetAnimationIndex(newState);
  }

  /**
   * Reset the animation index for the given state
   * @param {string} state - The animation state
   */
  resetAnimationIndex(state) {
    const indexMap = {
      idle: "idleIndex",
      sleep: "sleepIndex",
      walk: "walkIndex",
      jumpUp: "jumpUpIndex",
      jumpDown: "jumpDownIndex",
      hurt: "hurtIndex",
      dead: "deadIndex"
    };
    if (indexMap[state]) this[indexMap[state]] = 0;
    if (state === "dead") {
      this.deadAnimationFrame = 0;
      this.deadAnimationDelay = 0;
    }
  }
}

Object.assign(Character.prototype, CharacterAnimations);
