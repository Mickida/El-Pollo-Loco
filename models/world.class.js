/**
 * Main game world that manages all game objects and logic
 */
class World {
  character;
  level;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar;
  coinStatusBar;
  bottleStatusBar;
  endbossStatusBar;
  throwableObjects = [];
  collectedCoins = 0;
  collectedBottles = 0;
  inGrace = false;
  gameOver = false;
  gamePaused = false;
  gameIntervals = [];
  animationFrameId = null;
  endboss = null;
  gameOverMusicPlayed = false;
  lastThrowTime = 0;

  /**
   * Create the game world
   * @param {HTMLCanvasElement} canvas - The game canvas
   * @param {Keyboard} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level1;
    this.character = new Character();
    this.initStatusBars();
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Initialize all status bars
   */
  initStatusBars() {
    this.statusBar = new StatusBar();
    this.coinStatusBar = new CoinStatusBar();
    this.bottleStatusBar = new BottleStatusBar();
    this.endbossStatusBar = new EndbossStatusBar();
  }

  /**
   * Start the main game loops
   */
  run() {
    this.startCollisionLoop();
    this.startThrowLoop();
  }

  /**
   * Start collision detection loop at 60 FPS
   */
  startCollisionLoop() {
    let interval = setInterval(() => {
      if (!this.gameOver) {
        this.checkCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrownBottleCollisions();
        this.checkGameOver();
      }
    }, 1000 / 60);
    this.gameIntervals.push(interval);
  }

  /**
   * Start throw detection loop at 100ms intervals
   */
  startThrowLoop() {
    let interval = setInterval(() => {
      if (!this.gameOver) this.checkThrowObjects();
    }, 100);
    this.gameIntervals.push(interval);
  }

  /**
   * Check for thrown bottle collisions with enemies or ground
   */
  checkThrownBottleCollisions() {
    this.throwableObjects.forEach((bottle, i) => {
      if (bottle.hasHit) {
        if (bottle.splashComplete) this.throwableObjects.splice(i, 1);
        return;
      }
      if (bottle.hasHitGround()) {
        bottle.startSplash();
        playSoundEffect("splash");
        return;
      }
      this.checkBottleEnemyHit(bottle);
    });
  }

  /**
   * Check if bottle hits an enemy
   * @param {ThrowableObject} bottle - The bottle to check
   */
  checkBottleEnemyHit(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (bottle.isColliding(enemy) && !bottle.hasHit && enemy instanceof Endboss) {
        bottle.startSplash();
        this.damageEndboss(enemy);
        playSoundEffect("splash");
      }
    });
  }

  /**
   * Apply damage to the endboss
   * @param {Endboss} enemy - The endboss
   */
  damageEndboss(enemy) {
    if (!enemy.hit) return;
    enemy.hit();
    this.endbossStatusBar.setPercentage(enemy.energy);
    playSoundEffect("endbossHit");
    if (enemy.isDead) this.waitForEndbossDeadAnimation(enemy);
  }

  /**
   * Wait for endboss dead animation then trigger win
   * @param {Endboss} enemy - The endboss
   */
  waitForEndbossDeadAnimation(enemy) {
    let check = setInterval(() => {
      if (enemy.deadAnimationFinished) {
        clearInterval(check);
        setTimeout(() => this.triggerWin(), 1000);
      }
    }, 100);
  }

  /**
   * Trigger win condition
   */
  triggerWin() {
    if (this.gameOver) return;
    this.gameOver = true;
    if (window.endGame) window.endGame("win");
  }

  /**
   * Check for coin collisions and collect coins
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, i) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(i, 1);
        this.collectedCoins++;
        this.coinStatusBar.setPercentage(this.collectedCoins * 20);
        playSoundEffect("coin");
      }
    });
  }

  /**
   * Check for bottle collisions and collect bottles
   */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, i) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(i, 1);
        this.collectedBottles++;
        this.bottleStatusBar.setPercentage(this.collectedBottles * 20);
        playSoundEffect("bottle");
      }
    });
  }

  /**
   * Check if game should end due to character death
   */
  checkGameOver() {
    if (this.character.isDead() && !this.gameOverMusicPlayed) {
      this.gameOverMusicPlayed = true;
      this.waitForCharacterDeadAnimation();
    }
  }

  /**
   * Wait for character dead animation then trigger game over
   */
  waitForCharacterDeadAnimation() {
    let check = setInterval(() => {
      if (this.character.deadAnimationFinished) {
        clearInterval(check);
        this.gameOver = true;
        if (window.endGame) window.endGame("gameover");
      }
    }, 100);
  }

  /**
   * Pause the game
   */
  pauseGame() {
    if (this.gamePaused) return;
    this.gamePaused = true;
    stopSnoringSound();
    this.clearAllIntervals();
    this.cancelAnimationFrame();
  }

  /**
   * Clear all game intervals
   */
  clearAllIntervals() {
    this.gameIntervals.forEach((i) => clearInterval(i));
    this.gameIntervals = [];
    this.level.enemies.forEach((e) => e.stopIntervals && e.stopIntervals());
    this.level.clouds.forEach((c) => c.stopIntervals && c.stopIntervals());
    this.level.coins.forEach((c) => c.stopIntervals && c.stopIntervals());
    this.level.bottles.forEach((b) => b.stopIntervals && b.stopIntervals());
    if (this.character?.stopIntervals) this.character.stopIntervals();
  }

  /**
   * Cancel the animation frame
   */
  cancelAnimationFrame() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume the game after pause
   */
  resumeGame() {
    if (!this.gamePaused) return;
    this.gamePaused = false;
    this.run();
    this.resumeAllObjects();
    this.draw();
  }

  /**
   * Resume all game objects
   */
  resumeAllObjects() {
    if (this.character) {
      this.character.applyGravity();
      this.character.animate();
    }
    this.level.enemies.forEach((e) => {
      if (e.animate) e.animate();
      if (e.startMovement) e.startMovement();
    });
    this.level.clouds.forEach((c) => c.animate && c.animate());
    this.level.coins.forEach((c) => c.animate && c.animate());
    this.level.bottles.forEach((b) => b.animate && b.animate());
  }

  /**
   * Stop all game loops
   */
  stopGame() {
    this.gameOver = true;
    stopSnoringSound();
    this.clearAllIntervals();
    this.cancelAnimationFrame();
  }

  /**
   * Check if player wants to throw a bottle
   */
  checkThrowObjects() {
    let now = Date.now();
    if (this.keyboard.D && this.collectedBottles > 0 && now - this.lastThrowTime >= 1000) {
      this.throwBottle();
      this.lastThrowTime = now;
      this.keyboard.D = false;
    }
  }

  /**
   * Create and throw a bottle
   */
  throwBottle() {
    let left = this.character.otherDirection;
    let x = left ? this.character.x - 20 : this.character.x + 100;
    let bottle = new ThrowableObject(x, this.character.y + 100, left);
    this.throwableObjects.push(bottle);
    this.collectedBottles--;
    this.bottleStatusBar.setPercentage(this.collectedBottles * 20);
  }

  /**
   * Check collisions between character and enemies
   */
  checkCollisions() {
    if (this.inGrace) return;
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead || !this.character.isColliding(enemy)) return;
      this.handleEnemyCollision(enemy);
    });
  }

  /**
   * Handle collision with a specific enemy
   * @param {MoveableObject} enemy - The enemy
   */
  handleEnemyCollision(enemy) {
    if (this.canJumpKill(enemy)) {
      this.performJumpKill(enemy);
    } else {
      this.takeDamage();
    }
  }

  /**
   * Check if character can jump-kill this enemy
   * @param {MoveableObject} enemy - The enemy
   * @returns {boolean} True if jump kill is possible
   */
  canJumpKill(enemy) {
    let isChicken = enemy instanceof Chicken || enemy instanceof SmallChicken;
    let isAboveGround = this.character.isAboveGround();
    let isFalling = this.character.speedY < 0;
    return isChicken && isAboveGround && isFalling && this.isAboveEnemy(enemy);
  }

  /**
   * Check if character is above the enemy
   * @param {MoveableObject} enemy - The enemy
   * @returns {boolean} True if above
   */
  isAboveEnemy(enemy) {
    let charBottom = this.character.y + this.character.height - this.character.hitboxOffsetBottom;
    let enemyTop = enemy.y + (enemy.hitboxOffsetTop || 0);
    let enemyHeight = enemy.height - (enemy.hitboxOffsetTop || 0) - (enemy.hitboxOffsetBottom || 0);
    return charBottom < enemyTop + enemyHeight * 0.6;
  }

  /**
   * Execute jump kill on enemy
   * @param {MoveableObject} enemy - The enemy
   */
  performJumpKill(enemy) {
    enemy.hit();
    this.character.speedY = 15;
    this.startGracePeriod(300);
    playSoundEffect("hit");
  }

  /**
   * Apply damage to the character
   */
  takeDamage() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
    this.startGracePeriod(1000);
    if (this.character.energy > 0) playSoundEffect("hurt");
  }

  /**
   * Start invincibility grace period
   * @param {number} duration - Duration in ms
   */
  startGracePeriod(duration) {
    this.inGrace = true;
    setTimeout(() => (this.inGrace = false), duration);
  }

  /**
   * Set world reference on character and endboss
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();
    if (this.endboss) this.endboss.world = this;
  }
}

Object.assign(World.prototype, WorldRenderer);
