let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

/**
 * Initializes the game when called (after clicking Start)
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  console.log("My character is", world);
}

/**
 * Starts the game - hides landing page and shows game container
 */
function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  document.getElementById("landing-page").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");

  init();
}

/**
 * Returns to the main menu (reloads the page)
 */
function backToMenu() {
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
