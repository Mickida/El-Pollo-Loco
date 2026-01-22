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
    this.statusBar = new StatusBar();
    this.coinStatusBar = new CoinStatusBar();
    this.bottleStatusBar = new BottleStatusBar();
    this.endbossStatusBar = new EndbossStatusBar();
    // Find endboss reference for status bar updates
    this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Start the main game loops for collision detection and throwing
   */
  run() {
    this.startCollisionLoop();
    this.startThrowLoop();
  }

  /**
   * Start collision detection loop at 60 FPS
   */
  startCollisionLoop() {
    let collisionInterval = setInterval(() => {
      if (!this.gameOver) {
        this.checkCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrownBottleCollisions();
        this.checkGameOver();
      }
    }, 1000 / 60);
    this.gameIntervals.push(collisionInterval);
  }

  /**
   * Start throw detection loop at 100ms intervals
   */
  startThrowLoop() {
    let throwInterval = setInterval(() => {
      if (!this.gameOver) {
        this.checkThrowObjects();
      }
    }, 100);
    this.gameIntervals.push(throwInterval);
  }

  /**
   * Check for thrown bottle collisions with enemies or ground
   */
  checkThrownBottleCollisions() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      if (this.handleBottleCleanup(bottle, bottleIndex)) return;
      if (this.handleBottleGroundHit(bottle)) return;
      this.handleBottleEnemyHit(bottle);
    });
  }

  /**
   * Remove bottles that have completed splash animation
   * @param {ThrowableObject} bottle - The bottle to check
   * @param {number} bottleIndex - Index of the bottle in array
   * @returns {boolean} True if bottle was cleaned up
   */
  handleBottleCleanup(bottle, bottleIndex) {
    if (bottle.hasHit) {
      if (bottle.splashComplete) {
        this.throwableObjects.splice(bottleIndex, 1);
      }
      return true;
    }
    return false;
  }

  /**
   * Handle bottle hitting the ground
   * @param {ThrowableObject} bottle - The bottle to check
   * @returns {boolean} True if bottle hit ground
   */
  handleBottleGroundHit(bottle) {
    if (bottle.hasHitGround()) {
      bottle.startSplash();
      this.playSplashSound();
      return true;
    }
    return false;
  }

  /**
   * Handle bottle hitting an enemy (Endboss only)
   * @param {ThrowableObject} bottle - The bottle to check
   */
  handleBottleEnemyHit(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (this.isValidEndbossHit(bottle, enemy)) {
        bottle.startSplash();
        this.damageEndboss(enemy);
        this.playSplashSound();
      }
    });
  }

  /**
   * Check if bottle hit the endboss
   * @param {ThrowableObject} bottle - The bottle
   * @param {MoveableObject} enemy - The enemy to check
   * @returns {boolean} True if valid endboss hit
   */
  isValidEndbossHit(bottle, enemy) {
    return (
      bottle.isColliding(enemy) && !bottle.hasHit && enemy instanceof Endboss
    );
  }

  /**
   * Apply damage to the endboss and check win condition
   * @param {Endboss} enemy - The endboss
   */
  damageEndboss(enemy) {
    if (enemy.hit) {
      enemy.hit();
      this.endbossStatusBar.setPercentage(enemy.energy);
      this.playEndbossHitSound();
      if (enemy.isDead) {
        this.waitForDeadAnimationThenWin(enemy);
      }
    }
  }

  /**
   * Wait for endboss dead animation to finish, then trigger win
   * @param {Endboss} enemy - The endboss
   */
  waitForDeadAnimationThenWin(enemy) {
    let checkInterval = setInterval(() => {
      if (enemy.deadAnimationFinished) {
        clearInterval(checkInterval);
        setTimeout(() => {
          this.triggerWin();
        }, 1000);
      }
    }, 100);
  }

  /**
   * Play endboss hit sound effect
   */
  playEndbossHitSound() {
    if (window.AudioManager) {
      window.AudioManager.playSfx("endbossHit");
    }
  }

  /**
   * Play splash sound effect
   */
  playSplashSound() {
    if (window.AudioManager) {
      window.AudioManager.playSfx("splash");
    }
  }

  /**
   * Trigger win condition when endboss is defeated
   */
  triggerWin() {
    if (this.gameOver) return;
    this.gameOver = true;
    if (window.endGame) {
      window.endGame("win");
    }
  }

  /**
   * Check for coin collisions and collect coins
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        this.coinStatusBar.setPercentage(this.collectedCoins * 20);
        // Play coin sound if available
        if (window.AudioManager) {
          window.AudioManager.playSfx("coin");
        }
      }
    });
  }

  /**
   * Check for bottle collisions and collect bottles
   */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(index, 1);
        this.collectedBottles++;
        this.bottleStatusBar.setPercentage(this.collectedBottles * 20);
        // Play bottle collect sound if available
        if (window.AudioManager) {
          window.AudioManager.playSfx("bottle");
        }
      }
    });
  }

  /**
   * Check if game should end
   */
  checkGameOver() {
    if (this.character.isDead() && !this.gameOverMusicPlayed) {
      // Mark that game over has been triggered
      this.gameOverMusicPlayed = true;
      // Don't set gameOver yet - wait for animation to finish
      this.waitForCharacterDeadAnimation();
    }
  }

  /**
   * Wait for character dead animation to finish, then trigger game over
   */
  waitForCharacterDeadAnimation() {
    let checkInterval = setInterval(() => {
      if (this.character.deadAnimationFinished) {
        clearInterval(checkInterval);
        this.gameOver = true; // Set gameOver AFTER animation finishes
        if (window.endGame) {
          window.endGame("gameover");
        }
      }
    }, 100);
  }

  /**
   * Pause the game - stops all loops but preserves state
   */
  pauseGame() {
    if (this.gamePaused) return;
    this.gamePaused = true;

    // Stop sounds
    if (window.AudioManager) {
      window.AudioManager.stopSnoring();
    }

    // Clear all world intervals
    this.gameIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.gameIntervals = [];

    // Stop all object intervals
    this.stopEnemyIntervals();
    this.stopCloudIntervals();
    this.stopCollectibleIntervals();

    // Stop character intervals
    if (this.character && this.character.stopIntervals) {
      this.character.stopIntervals();
    }

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume the game after pause
   */
  resumeGame() {
    if (!this.gamePaused) return;
    this.gamePaused = false;

    // Restart world loops
    this.run();

    // Restart character
    if (this.character) {
      this.character.applyGravity();
      this.character.animate();
    }

    // Restart enemies
    this.level.enemies.forEach((enemy) => {
      if (enemy.animate) enemy.animate();
      if (enemy.startMovement) enemy.startMovement();
    });

    // Restart clouds
    this.level.clouds.forEach((cloud) => {
      if (cloud.animate) cloud.animate();
    });

    // Restart collectibles
    this.level.coins.forEach((coin) => {
      if (coin.animate) coin.animate();
    });
    this.level.bottles.forEach((bottle) => {
      if (bottle.animate) bottle.animate();
    });

    // Restart draw loop
    this.draw();
  }

  /**
   * Stop all game loops and intervals
   */
  stopGame() {
    this.gameOver = true;

    // Stop snoring sound
    if (window.AudioManager) {
      window.AudioManager.stopSnoring();
    }

    // Clear all intervals
    this.gameIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.gameIntervals = [];

    // Stop all enemy intervals
    this.stopEnemyIntervals();

    // Stop cloud intervals
    this.stopCloudIntervals();

    // Stop collectible intervals
    this.stopCollectibleIntervals();

    // Stop character intervals
    if (this.character && this.character.stopIntervals) {
      this.character.stopIntervals();
    }

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Stop all enemy animation and movement intervals
   */
  stopEnemyIntervals() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.stopIntervals) {
        enemy.stopIntervals();
      }
    });
  }

  /**
   * Stop all cloud movement intervals
   */
  stopCloudIntervals() {
    this.level.clouds.forEach((cloud) => {
      if (cloud.stopIntervals) {
        cloud.stopIntervals();
      }
    });
  }

  /**
   * Stop all collectible intervals (coins, bottles)
   */
  stopCollectibleIntervals() {
    this.level.coins.forEach((coin) => {
      if (coin.stopIntervals) {
        coin.stopIntervals();
      }
    });
    this.level.bottles.forEach((bottle) => {
      if (bottle.stopIntervals) {
        bottle.stopIntervals();
      }
    });
  }

  /**
   * Check if player wants to throw a bottle and handle the throw
   */
  checkThrowObjects() {
    if (this.keyboard.D && this.collectedBottles > 0) {
      this.throwBottle();
      this.keyboard.D = false;
    }
  }

  /**
   * Create and throw a bottle in the direction the character is facing
   */
  throwBottle() {
    let throwLeft = this.character.otherDirection;
    let throwX = throwLeft ? this.character.x - 20 : this.character.x + 100;
    let bottle = new ThrowableObject(throwX, this.character.y + 100, throwLeft);
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
   * @param {MoveableObject} enemy - The enemy that was collided with
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
   * @param {MoveableObject} enemy - The enemy to check
   * @returns {boolean} True if jump kill conditions are met
   */
  canJumpKill(enemy) {
    let isChicken = enemy instanceof Chicken || enemy instanceof SmallChicken;
    let isAboveGround = this.character.isAboveGround();
    let isFalling = this.character.speedY < 0;
    let isAboveEnemy = this.isCharacterAboveEnemy(enemy);
    return isChicken && isAboveGround && isFalling && isAboveEnemy;
  }

  /**
   * Check if character is positioned above the enemy
   * @param {MoveableObject} enemy - The enemy to check
   * @returns {boolean} True if character is above enemy
   */
  isCharacterAboveEnemy(enemy) {
    let charBottom =
      this.character.y +
      this.character.height -
      this.character.hitboxOffsetBottom;
    let enemyTop = enemy.y + (enemy.hitboxOffsetTop || 0);
    let enemyHeight =
      enemy.height -
      (enemy.hitboxOffsetTop || 0) -
      (enemy.hitboxOffsetBottom || 0);
    return charBottom < enemyTop + enemyHeight * 0.6;
  }

  /**
   * Execute jump kill on enemy
   * @param {MoveableObject} enemy - The enemy to kill
   */
  performJumpKill(enemy) {
    enemy.hit();
    this.character.speedY = 15;
    this.startGracePeriod(300);
    if (window.AudioManager) {
      window.AudioManager.playSfx("hit");
    }
  }

  /**
   * Apply damage to the character
   */
  takeDamage() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
    this.startGracePeriod(1000);
    if (window.AudioManager && this.character.energy > 0) {
      window.AudioManager.playSfx("hurt");
    }
  }

  /**
   * Start invincibility grace period
   * @param {number} duration - Duration in milliseconds
   */
  startGracePeriod(duration) {
    this.inGrace = true;
    setTimeout(() => {
      this.inGrace = false;
    }, duration);
  }

  /**
   * Main draw loop - renders all game objects
   */
  draw() {
    if (this.gameOver) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawWorldObjects();
    this.drawFixedUI();
    this.requestNextFrame();
  }

  /**
   * Draw all objects that move with the camera
   */
  drawWorldObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.drawEndbossStatusBar();
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draw endboss status bar above the endboss
   */
  drawEndbossStatusBar() {
    if (this.endboss) {
      this.endbossStatusBar.x = this.endboss.x + 25;
      this.endbossStatusBar.y = this.endboss.y - 10;
      this.addToMap(this.endbossStatusBar);
    }
  }

  /**
   * Draw fixed UI elements (status bars)
   */
  drawFixedUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
  }

  /**
   * Request next animation frame
   */
  requestNextFrame() {
    let self = this;
    this.animationFrameId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Add multiple objects to the map
   * @param {DrawableObject[]} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Add a single object to the map with flip handling
   * @param {DrawableObject} mo - The object to draw
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Set the world reference on the character and endboss, then start animations
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();
    if (this.endboss) {
      this.endboss.world = this;
    }
  }

  /**
   * Flip image horizontally for left-facing objects
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restore image after flipping
   * @param {DrawableObject} mo - The object to restore
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
