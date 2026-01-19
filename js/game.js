let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameEnded = false;

// Grace period duration in milliseconds (player is invulnerable at start)
const GRACE_PERIOD_MS = 3000;

/**
 * Initializes the game when called (after clicking Start)
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  // Enable grace period at start
  world.inGrace = true;
  setTimeout(() => {
    if (world) {
      world.inGrace = false;
      console.log("Grace period ended - good luck!");
    }
  }, GRACE_PERIOD_MS);

  console.log("Game initialized with", GRACE_PERIOD_MS + "ms grace period");
}

/**
 * Starts the game - hides landing page and shows game container
 */
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  gameEnded = false;

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
    window.AudioManager.playMusic();
  }

  init();
}

/**
 * Restarts the game after game over or win
 */
function restartGame() {
  // Stop current game
  if (world) {
    world.stopGame();
  }

  // Reset state
  gameStarted = false;
  gameEnded = false;
  world = null;
  keyboard = new Keyboard();

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
  // Recreate level1 with fresh enemies
  window.level1 = new Level(
    [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
    [new Cloud()],
    createBackgroundObjects()
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

  // Stop game loops
  if (world) {
    world.stopGame();
  }

  // Play appropriate sound
  if (window.AudioManager) {
    window.AudioManager.stopMusic();
    if (type === "win") {
      window.AudioManager.playSfx("win");
    } else {
      window.AudioManager.playSfx("gameOver");
    }
  }

  // Show endscreen after short delay for death animation
  setTimeout(() => {
    if (window.UI && window.UI.showEndscreen) {
      window.UI.showEndscreen(type);
    }
  }, 500);
}

/**
 * Returns to the main menu (reloads the page)
 */
function backToMenu() {
  // Stop audio before reload
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
 * Keyboard event listener for closing dialogs with Escape key
 */
window.addEventListener("keydown", (e) => {
  // Close dialogs with Escape key
  if (e.keyCode == 27) {
    hideDialog("info-dialog");
    hideDialog("keybindings-dialog");
  }

  // Game controls (only when game is started)
  if (!gameStarted) return;

  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});
