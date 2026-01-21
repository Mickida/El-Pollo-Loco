class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinStatusBar = new CoinStatusBar();
  bottleStatusBar = new BottleStatusBar();
  endbossStatusBar = new EndbossStatusBar();
  throwableObjects = [];

  // Collection tracking
  collectedCoins = 0;
  collectedBottles = 0;

  // Game state
  inGrace = false; // Grace period - no damage taken
  gameOver = false;
  gameIntervals = []; // Store intervals for cleanup
  animationFrameId = null;

  // Reference to endboss for status bar updates
  endboss = null;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    // Find endboss reference for status bar updates
    this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    this.draw();
    this.setWorld();
    this.run();
  }

  run() {
    // Store interval references for cleanup
    // Fast collision check for responsive gameplay (60fps)
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

    // Slower interval for throw check to prevent spam
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
      // Skip if already hit
      if (bottle.hasHit) {
        // Remove bottle after splash animation completes
        if (bottle.splashComplete) {
          this.throwableObjects.splice(bottleIndex, 1);
        }
        return;
      }

      // Check ground collision
      if (bottle.hasHitGround()) {
        bottle.startSplash();
        if (window.AudioManager) {
          window.AudioManager.playSfx("splash");
        }
        return;
      }

      // Check enemy collision - bottles only damage the Endboss
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !bottle.hasHit && enemy instanceof Endboss) {
          bottle.startSplash();

          // Damage endboss
          if (enemy.hit) {
            enemy.hit();
            this.endbossStatusBar.setPercentage(enemy.energy);
            // Check if endboss is dead for win condition
            if (enemy.isDead) {
              this.triggerWin();
            }
          }

          if (window.AudioManager) {
            window.AudioManager.playSfx("splash");
          }
        }
      });
    });
  }

  /**
   * Trigger win condition when endboss is defeated
   */
  triggerWin() {
    if (this.gameOver) return;
    this.gameOver = true;
    setTimeout(() => {
      if (window.endGame) {
        window.endGame("win");
      }
    }, 1000);
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
    if (this.character.isDead() && !this.gameOver) {
      this.gameOver = true;
      // Trigger game over after death animation
      setTimeout(() => {
        if (window.endGame) {
          window.endGame("gameover");
        }
      }, 500);
    }
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

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.collectedBottles > 0) {
      // Determine throw position and direction based on character facing
      let throwLeft = this.character.otherDirection;
      let throwX = throwLeft ? this.character.x - 20 : this.character.x + 100;
      let bottle = new ThrowableObject(
        throwX,
        this.character.y + 100,
        throwLeft,
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      this.bottleStatusBar.setPercentage(this.collectedBottles * 20);
      this.keyboard.D = false; // Prevent multiple throws per key press
    }
  }

  checkCollisions() {
    if (this.inGrace) return;

    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead) return;
      if (!this.character.isColliding(enemy)) return;

      let isChicken = enemy instanceof Chicken || enemy instanceof SmallChicken;

      // Jump kill conditions:
      // 1. Character is above ground (jumping/falling)
      // 2. Character is moving downward (falling)
      // 3. Character's bottom is above enemy's top third
      let isAboveGround = this.character.isAboveGround();
      let isFalling = this.character.speedY < 0;
      let characterBottom = this.character.y + this.character.height - this.character.hitboxOffsetBottom;
      let enemyTop = enemy.y + (enemy.hitboxOffsetTop || 0);
      let enemyHeight = enemy.height - (enemy.hitboxOffsetTop || 0) - (enemy.hitboxOffsetBottom || 0);
      let isAboveEnemy = characterBottom < enemyTop + enemyHeight * 0.6;

      if (isChicken && isAboveGround && isFalling && isAboveEnemy) {
        enemy.hit();
        this.character.speedY = 15; // Bounce up
        // Short grace period to prevent double-hit
        this.inGrace = true;
        setTimeout(() => {
          this.inGrace = false;
        }, 300);
        if (window.AudioManager) {
          window.AudioManager.playSfx("hit");
        }
      } else {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        // Grace period after taking damage
        this.inGrace = true;
        setTimeout(() => {
          this.inGrace = false;
        }, 1000);
        if (window.AudioManager) {
          window.AudioManager.playSfx("hurt");
        }
      }
    });
  }

  draw() {
    if (this.gameOver) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);

    // Draw endboss status bar above the endboss (moves with camera)
    if (this.endboss) {
      this.endbossStatusBar.x = this.endboss.x + 25;
      this.endbossStatusBar.y = this.endboss.y - 10;
      this.addToMap(this.endbossStatusBar);
    }

    this.ctx.translate(-this.camera_x, 0);
    // Draw all status bars LAST (fixed position, always on top)
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);

    let self = this;
    this.animationFrameId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

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

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
