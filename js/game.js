let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameEnded = false;
let gamePaused = false;
let pausedForPortrait = false;

/**
 * Initializes the game when called (after clicking Start)
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Starts the game - hides landing page and shows game container
 */
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  gameEnded = false;
  pausedForPortrait = false;

  document.getElementById("landing-page").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  // Hide endscreen if visible
  if (window.UI && window.UI.hideEndscreen) {
    window.UI.hideEndscreen();
  }

  // Initialize and start audio
  if (window.AudioManager) {
    window.AudioManager.init();
    window.AudioManager.updateMuteButton();
  }

  init();

  // If on touch device in portrait mode, pause immediately
  if (isTouchDevice() && isPortrait()) {
    pausedForPortrait = true;
    if (world) {
      world.pauseGame();
    }
  } else {
    // Only play music if not in portrait mode
    if (window.AudioManager) {
      window.AudioManager.playMusic();
    }
  }
}

/**
 * Restarts the game after game over or win
 */
function restartGame() {
  // Stop current game
  if (world) {
    world.stopGame();
  }

  // Reset audio to default state (unmuted)
  if (window.AudioManager) {
    window.AudioManager.reset();
  }

  // Reset state
  gameStarted = false;
  gameEnded = false;
  gamePaused = false;
  world = null;

  // Reset keyboard state (reuse the same object for event listeners)
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;

  // Reset level (recreate enemies)
  resetLevel();

  // Hide endscreen
  if (window.UI && window.UI.hideEndscreen) {
    window.UI.hideEndscreen();
  }

  // Start fresh
  startGame();
}

/**
 * Reset level to initial state (recreate enemies, etc.)
 */
function resetLevel() {
  // Recreate level1 with fresh enemies, clouds, coins and bottles
  level1 = new Level(
    [
      new Chicken(400),
      new Chicken(700),
      new SmallChicken(1000),
      new SmallChicken(1300),
      new SmallChicken(1500),
      new Chicken(1800),
      new Chicken(2100),
      new Endboss(),
    ],
    [
      new Cloud(0),
      new Cloud(500),
      new Cloud(1000),
      new Cloud(1500),
      new Cloud(2000),
      new Cloud(2500),
    ],
    createBackgroundObjects(),
    [
      new Coin(350, 280),
      new Coin(600, 200),
      new Coin(900, 150),
      new Coin(1200, 250),
      new Coin(1600, 180),
    ],
    [
      new CollectibleBottle(450, 350),
      new CollectibleBottle(750, 350),
      new CollectibleBottle(1050, 350),
      new CollectibleBottle(1400, 350),
      new CollectibleBottle(1800, 350),
    ]
  );
}

/**
 * Create background objects for the level
 */
function createBackgroundObjects() {
  return [
    new BackgroundObject("img/5_background/layers/air.png", -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

    new BackgroundObject("img/5_background/layers/air.png", 720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

    new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      720 * 2
    ),

    new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      720 * 3
    ),
  ];
}

/**
 * Called when game ends (win or lose)
 * @param {string} type - 'gameover' or 'win'
 */
function endGame(type) {
  if (gameEnded) return;
  gameEnded = true;

  // Play appropriate sound
  if (window.AudioManager) {
    window.AudioManager.stopMusic();
    if (type === "win") {
      window.AudioManager.playSfx("win");
    } else {
      window.AudioManager.playSfx("gameOver");
    }
  }

  // Show endscreen and stop game
  setTimeout(() => {
    if (world) {
      world.stopGame();
    }
    if (window.UI && window.UI.showEndscreen) {
      window.UI.showEndscreen(type);
    }
  }, 500);
}

/**
 * Returns to the main menu (shows pause menu if game is running)
 */
function backToMenu() {
  if (gameStarted && !gameEnded) {
    showPauseMenu();
  } else {
    goToMainMenu();
  }
}

/**
 * Pause the game and show landing page with resume option
 */
function pauseGame() {
  gamePaused = true;

  // Stop all game loops
  if (world) {
    world.pauseGame();
  }

  // Stop music
  if (window.AudioManager) {
    window.AudioManager.stopMusic();
  }

  document.getElementById("game-container").classList.add("hidden");
  document.getElementById("landing-page").classList.remove("hidden");
  updateStartButton();
}

/**
 * Resume a paused game
 */
function resumeGame() {
  gamePaused = false;
  document.getElementById("landing-page").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  // Resume all game loops
  if (world) {
    world.resumeGame();
  }

  // Resume music
  if (window.AudioManager) {
    window.AudioManager.playMusic();
  }
}

/**
 * Show the pause menu overlay with blurred game background
 */
function showPauseMenu() {
  gamePaused = true;

  if (world) {
    world.pauseGame();
  }

  if (window.AudioManager) {
    window.AudioManager.stopMusic();
  }

  document.getElementById("game-container").classList.add("game-paused");
  document.getElementById("pause-dialog").classList.add("active");
}

/**
 * Hide the pause menu and resume the game
 */
function hidePauseMenu() {
  document.getElementById("pause-dialog").classList.remove("active");
  document.getElementById("game-container").classList.remove("game-paused");

  gamePaused = false;

  if (world) {
    world.resumeGame();
  }

  if (window.AudioManager) {
    window.AudioManager.playMusic();
  }
}

/**
 * Restart the game from the pause menu
 */
function restartGameFromPause() {
  document.getElementById("pause-dialog").classList.remove("active");
  document.getElementById("game-container").classList.remove("game-paused");
  restartGame();
}

/**
 * Go to main menu from the pause menu
 */
function goToMainMenuFromPause() {
  document.getElementById("pause-dialog").classList.remove("active");
  document.getElementById("game-container").classList.remove("game-paused");
  document.getElementById("game-container").classList.add("hidden");
  goToMainMenu();
}

/**
 * Update start button text based on game state
 */
function updateStartButton() {
  let startBtn = document.getElementById("start-btn");
  let restartBtn = document.getElementById("restart-btn");
  if (gameStarted && !gameEnded) {
    if (startBtn) {
      startBtn.innerHTML = "<span>▶</span> Resume Game";
      startBtn.onclick = resumeGame;
    }
    if (restartBtn) {
      restartBtn.classList.remove("hidden");
    }
  } else {
    if (startBtn) {
      startBtn.innerHTML = "<span>▶</span> Start Game";
      startBtn.onclick = startGame;
    }
    if (restartBtn) {
      restartBtn.classList.add("hidden");
    }
  }
}

/**
 * Go to main menu and reset game state
 */
function goToMainMenu() {
  if (window.AudioManager) {
    window.AudioManager.stopAll();
  }
  location.reload();
}

/**
 * Shows the info/instructions dialog
 */
function showInfoDialog() {
  document.getElementById("info-dialog").classList.add("active");
}

/**
 * Shows the keybindings dialog
 */
function showKeybindingsDialog() {
  document.getElementById("keybindings-dialog").classList.add("active");
}

/**
 * Shows the impressum dialog
 */
function showImpressumDialog() {
  document.getElementById("impressum-dialog").classList.add("active");
}

/**
 * Hides a dialog by its ID
 * @param {string} dialogId - The ID of the dialog to hide
 */
function hideDialog(dialogId) {
  document.getElementById(dialogId).classList.remove("active");
}

/**
 * Closes dialog when clicking on the backdrop (outside the dialog)
 * @param {Event} event - The click event
 * @param {string} dialogId - The ID of the dialog to close
 */
function closeDialogOnBackdrop(event, dialogId) {
  if (event.target.classList.contains("dialog-overlay")) {
    hideDialog(dialogId);
  }
}

/**
 * Toggles fullscreen mode for the game
 */
function toggleFullscreen() {
  let elem = document.documentElement;

  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/**
 * Handle keydown events for dialogs and game controls
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyDown(e) {
  handleEscapeKey(e);
  if (gameStarted) {
    handleGameKeyDown(e);
  }
}

/**
 * Close dialogs when Escape key is pressed
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleEscapeKey(e) {
  if (e.keyCode == 27) {
    hideDialog("info-dialog");
    hideDialog("keybindings-dialog");
    hideDialog("impressum-dialog");
    if (gamePaused && document.getElementById("pause-dialog").classList.contains("active")) {
      hidePauseMenu();
    }
  }
}

/**
 * Handle game control keydown events
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleGameKeyDown(e) {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
}

/**
 * Handle keyup events for game controls
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyUp(e) {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

/**
 * Check if the device supports touch
 * @returns {boolean} True if touch device
 */
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Initialize mobile controls with touch event listeners
 */
function initMobileControls() {
  if (!isTouchDevice()) return;

  bindMobileButton("mobile-left", "LEFT");
  bindMobileButton("mobile-right", "RIGHT");
  bindMobileButton("mobile-jump", "SPACE");
  bindMobileButton("mobile-throw", "D");

  disableContextMenuOnMobileButtons();
}

/**
 * Bind a mobile button to a keyboard key
 * @param {string} buttonId - The ID of the mobile button
 * @param {string} keyboardKey - The keyboard key to simulate
 */
function bindMobileButton(buttonId, keyboardKey) {
  let button = document.getElementById(buttonId);
  if (!button) return;

  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard[keyboardKey] = true;
  });

  button.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard[keyboardKey] = false;
  });

  button.addEventListener("touchcancel", (e) => {
    e.preventDefault();
    keyboard[keyboardKey] = false;
  });
}

/**
 * Disable context menu (long press) on all mobile buttons
 */
function disableContextMenuOnMobileButtons() {
  let buttons = document.querySelectorAll(".mobile-btn");
  buttons.forEach((button) => {
    button.addEventListener("contextmenu", (e) => e.preventDefault());
  });
}

/**
 * Check if device is in portrait orientation
 * @returns {boolean} True if portrait mode
 */
function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

/**
 * Handle orientation changes - show/hide rotate message and pause/resume game
 */
function handleOrientationChange() {
  if (!isTouchDevice()) return;

  let rotateOverlay = document.getElementById("rotate-device");
  if (!rotateOverlay) return;

  if (isPortrait()) {
    rotateOverlay.classList.remove("hidden");
    pauseGameForPortrait();
  } else {
    rotateOverlay.classList.add("hidden");
    resumeGameFromPortrait();
  }
}

/**
 * Pause the game when device is in portrait mode
 */
function pauseGameForPortrait() {
  if (!gameStarted || gameEnded || gamePaused) return;

  pausedForPortrait = true;
  if (world) {
    world.pauseGame();
  }
  if (window.AudioManager) {
    window.AudioManager.stopMusic();
  }
}

/**
 * Resume the game when device switches to landscape mode
 */
function resumeGameFromPortrait() {
  if (!pausedForPortrait || gameEnded) return;

  pausedForPortrait = false;
  if (world && world.gamePaused) {
    world.resumeGame();
    if (window.AudioManager) {
      window.AudioManager.playMusic();
    }
  }
}

window.addEventListener("orientationchange", handleOrientationChange);
window.addEventListener("resize", handleOrientationChange);
document.addEventListener("DOMContentLoaded", () => {
  initMobileControls();
  handleOrientationChange();
});
