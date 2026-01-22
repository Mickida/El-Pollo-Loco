/**
 * Final boss enemy - large chicken that takes 4 bottle hits to defeat
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
  height = 320;
  width = 200;
  y = 125;

  // Hitbox offsets for realistic collision (excludes status bar and empty space above)
  hitboxOffsetTop = 90;
  hitboxOffsetBottom = 16;
  hitboxOffsetLeft = 30;
  hitboxOffsetRight = 20;

  // State machine
  state = "idle";
  speed = 0.5;

  // Range constants
  ALERT_RANGE = 500;
  ATTACK_RANGE = 150;

  // Attack system
  lastAttackTime = 0;
  ATTACK_COOLDOWN = 2000;
  ATTACK_DAMAGE = 20;

  // Animation tracking
  alertAnimationPlayed = false;
  currentAnimationFrame = 0;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  energy = 100;
  isDead = false;
  isHurt = false;
  hurtTimeout = null;
  animateInterval;
  moveInterval;
  world = null;
  deadAnimationFinished = false;
  deadAnimationFrame = 0;

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2200;
    this.animate();
    this.startMovement();
  }

  /**
   * Start the animation loop for the endboss
   */
  animate() {
    if (this.animateInterval) clearInterval(this.animateInterval);
    this.animateInterval = setInterval(() => {
      this.playCurrentAnimation();
    }, 200);
  }

  /**
   * Start the movement and state update loop
   */
  startMovement() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    this.moveInterval = setInterval(() => {
      if (!this.isDead && this.world) {
        this.updateState();
        this.executeState();
      }
    }, 1000 / 60);
  }

  /**
   * Calculate distance to the character
   * @returns {number} Distance in pixels
   */
  getDistanceToCharacter() {
    if (!this.world || !this.world.character) return Infinity;
    return Math.abs(this.x - this.world.character.x);
  }

  /**
   * Update state based on character distance
   */
  updateState() {
    if (this.isDead) {
      this.state = "dead";
      return;
    }
    if (this.isHurt) return;
    let distance = this.getDistanceToCharacter();
    this.determineStateByDistance(distance);
  }

  /**
   * Determine state based on distance to character
   * @param {number} distance - Distance to character
   */
  determineStateByDistance(distance) {
    if (distance <= this.ATTACK_RANGE) {
      this.handleAttackState();
    } else if (distance <= this.ALERT_RANGE) {
      this.handleAlertOrWalkState();
    } else {
      this.state = "idle";
      this.alertAnimationPlayed = false;
    }
  }

  /**
   * Handle attack state transition
   */
  handleAttackState() {
    let now = Date.now();
    if (now - this.lastAttackTime >= this.ATTACK_COOLDOWN) {
      this.state = "attack";
      this.lastAttackTime = now;
      this.performAttack();
    } else if (this.state !== "attack") {
      this.state = "walk";
    }
  }

  /**
   * Handle alert or walk state transition
   */
  handleAlertOrWalkState() {
    if (!this.alertAnimationPlayed) {
      this.state = "alert";
    } else {
      this.state = "walk";
    }
  }

  /**
   * Execute behavior based on current state
   */
  executeState() {
    if (this.state === "walk") {
      this.moveTowardsCharacter();
    }
  }

  /**
   * Move boss towards the character
   */
  moveTowardsCharacter() {
    if (!this.world || !this.world.character) return;
    if (this.world.character.x < this.x) {
      this.moveLeft();
      this.otherDirection = false;
    }
  }

  /**
   * Perform attack and damage the character
   */
  performAttack() {
    setTimeout(() => {
      if (this.isDead || !this.world) return;
      let distance = this.getDistanceToCharacter();
      if (distance <= this.ATTACK_RANGE + 50) {
        this.damageCharacter();
      }
    }, 400);
  }

  /**
   * Apply damage to the character
   */
  damageCharacter() {
    if (!this.world || !this.world.character) return;
    if (this.world.inGrace) return;
    this.world.character.hit();
    this.world.statusBar.setPercentage(this.world.character.energy);
    this.world.startGracePeriod(1000);
    if (window.AudioManager) {
      window.AudioManager.playSfx("hurt");
    }
  }

  /**
   * Play the appropriate animation based on state
   */
  playCurrentAnimation() {
    if (this.isDead) {
      this.playDeadAnimation();
      return;
    } else if (this.isHurt) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.state === "attack") {
      this.playAttackAnimation();
    } else if (this.state === "alert") {
      this.playAlertAnimation();
    } else if (this.state === "walk") {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Play alert animation once then switch to walk
   */
  playAlertAnimation() {
    this.playAnimation(this.IMAGES_ALERT);
    if (this.currentImage >= this.IMAGES_ALERT.length - 1) {
      this.alertAnimationPlayed = true;
    }
  }

  /**
   * Play attack animation
   */
  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Play dead animation once then mark as finished
   */
  playDeadAnimation() {
    console.log("playDeadAnimation called, frame:", this.deadAnimationFrame, "finished:", this.deadAnimationFinished);
    if (this.deadAnimationFinished) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      return;
    }
    if (this.deadAnimationFrame < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[this.deadAnimationFrame];
      this.img = this.imageCache[path];
      this.deadAnimationFrame++;
    } else {
      this.deadAnimationFinished = true;
      console.log("Dead animation finished!");
    }
  }

  /**
   * Called when endboss is hit by a bottle
   * Reduces energy by 25 (4 hits to kill)
   */
  hit() {
    if (this.isDead) return;
    this.energy -= 25;
    if (this.energy <= 0) {
      this.energy = 0;
      this.isDead = true;
      this.state = "dead";
    } else {
      this.isHurt = true;
      if (this.hurtTimeout) {
        clearTimeout(this.hurtTimeout);
      }
      this.hurtTimeout = setTimeout(() => {
        this.isHurt = false;
      }, 500);
    }
  }

  /**
   * Stop all intervals (for game restart/cleanup)
   */
  stopIntervals() {
    if (this.animateInterval) {
      clearInterval(this.animateInterval);
    }
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.hurtTimeout) {
      clearTimeout(this.hurtTimeout);
    }
  }
}
