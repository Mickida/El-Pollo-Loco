let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameEnded = false;
let gamePaused = false;
let pausedForPortrait = false;

/**
 * Initialize the game canvas and world
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Start the game
 */
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  gameEnded = false;
  pausedForPortrait = false;
  showGameContainer();
  initAudioAndGame();
}

/**
 * Show game container and hide landing page
 */
function showGameContainer() {
  document.getElementById("landing-page").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");
  if (window.UI?.hideEndscreen) window.UI.hideEndscreen();
}

/**
 * Initialize audio and start the game
 */
function initAudioAndGame() {
  if (window.AudioManager) {
    window.AudioManager.init();
    window.AudioManager.updateMuteButton();
  }
  init();
  handleInitialOrientation();
}

/**
 * Handle initial orientation state
 */
function handleInitialOrientation() {
  if (isTouchDevice() && isPortrait()) {
    pausedForPortrait = true;
    if (world) world.pauseGame();
  } else {
    if (window.AudioManager) window.AudioManager.playMusic();
  }
}

/**
 * Restart the game
 */
function restartGame() {
  stopCurrentGame();
  resetGameState();
  resetLevel();
  hideEndscreen();
  startGame();
}

/**
 * Stop the current game
 */
function stopCurrentGame() {
  if (world) world.stopGame();
  if (window.AudioManager) window.AudioManager.reset();
}

/**
 * Reset all game state variables
 */
function resetGameState() {
  gameStarted = false;
  gameEnded = false;
  gamePaused = false;
  world = null;
  resetKeyboardState();
}

/**
 * Reset keyboard state
 */
function resetKeyboardState() {
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}

/**
 * Hide the endscreen
 */
function hideEndscreen() {
  if (window.UI?.hideEndscreen) window.UI.hideEndscreen();
}

/**
 * End the game
 * @param {string} type - 'gameover' or 'win'
 */
function endGame(type) {
  if (gameEnded) return;
  gameEnded = true;
  handleEndGameAudio(type);
  setTimeout(() => showEndscreen(type), 500);
}

/**
 * Handle audio for game end
 * @param {string} type - 'gameover' or 'win'
 */
function handleEndGameAudio(type) {
  if (!window.AudioManager) return;
  window.AudioManager.stopMusic();
  window.AudioManager.playSfx(type === "win" ? "win" : "gameOver");
}

/**
 * Show endscreen after game ends
 * @param {string} type - 'gameover' or 'win'
 */
function showEndscreen(type) {
  if (world) world.stopGame();
  if (window.UI?.showEndscreen) window.UI.showEndscreen(type);
}

/**
 * Back to menu handler
 */
function backToMenu() {
  if (gameStarted && !gameEnded) {
    showPauseMenu();
  } else {
    goToMainMenu();
  }
}

/**
 * Pause the game
 */
function pauseGame() {
  gamePaused = true;
  if (world) world.pauseGame();
  if (window.AudioManager) window.AudioManager.stopMusic();
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
  if (world) world.resumeGame();
  if (window.AudioManager) window.AudioManager.playMusic();
}

/**
 * Show the pause menu overlay
 */
function showPauseMenu() {
  gamePaused = true;
  if (world) world.pauseGame();
  if (window.AudioManager) window.AudioManager.stopMusic();
  document.getElementById("game-container").classList.add("game-paused");
  document.getElementById("pause-dialog").classList.add("active");
}

/**
 * Hide the pause menu and resume
 */
function hidePauseMenu() {
  document.getElementById("pause-dialog").classList.remove("active");
  document.getElementById("game-container").classList.remove("game-paused");
  gamePaused = false;
  if (world) world.resumeGame();
  if (window.AudioManager) window.AudioManager.playMusic();
}

/**
 * Restart game from pause menu
 */
function restartGameFromPause() {
  document.getElementById("pause-dialog").classList.remove("active");
  document.getElementById("game-container").classList.remove("game-paused");
  restartGame();
}

/**
 * Go to main menu from pause
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
    updateButtonForResume(startBtn, restartBtn);
  } else {
    updateButtonForStart(startBtn, restartBtn);
  }
}

/**
 * Update button for resume state
 * @param {HTMLElement} startBtn - Start button
 * @param {HTMLElement} restartBtn - Restart button
 */
function updateButtonForResume(startBtn, restartBtn) {
  if (startBtn) {
    startBtn.innerHTML = "<span>▶</span> Resume Game";
    startBtn.onclick = resumeGame;
  }
  if (restartBtn) restartBtn.classList.remove("hidden");
}

/**
 * Update button for start state
 * @param {HTMLElement} startBtn - Start button
 * @param {HTMLElement} restartBtn - Restart button
 */
function updateButtonForStart(startBtn, restartBtn) {
  if (startBtn) {
    startBtn.innerHTML = "<span>▶</span> Start Game";
    startBtn.onclick = startGame;
  }
  if (restartBtn) restartBtn.classList.add("hidden");
}

/**
 * Go to main menu and reload
 */
function goToMainMenu() {
  if (window.AudioManager) window.AudioManager.stopAll();
  location.reload();
}

/**
 * Show info dialog
 */
function showInfoDialog() {
  document.getElementById("info-dialog").classList.add("active");
}

/**
 * Show keybindings dialog
 */
function showKeybindingsDialog() {
  document.getElementById("keybindings-dialog").classList.add("active");
}

/**
 * Show impressum dialog
 */
function showImpressumDialog() {
  document.getElementById("impressum-dialog").classList.add("active");
}

/**
 * Hide a dialog by ID
 * @param {string} dialogId - The dialog ID
 */
function hideDialog(dialogId) {
  document.getElementById(dialogId).classList.remove("active");
}

/**
 * Close dialog on backdrop click
 * @param {Event} event - Click event
 * @param {string} dialogId - The dialog ID
 */
function closeDialogOnBackdrop(event, dialogId) {
  if (event.target.classList.contains("dialog-overlay")) {
    hideDialog(dialogId);
  }
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
  let elem = document.documentElement;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    requestFullscreen(elem);
  } else {
    exitFullscreen();
  }
}

/**
 * Request fullscreen on element
 * @param {HTMLElement} elem - Element to fullscreen
 */
function requestFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}

/**
 * Exit fullscreen mode
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Handle keydown events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
  handleEscapeKey(e);
  if (gameStarted) handleGameKeyDown(e);
}

/**
 * Handle escape key for dialogs
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEscapeKey(e) {
  if (e.keyCode !== 27) return;
  hideDialog("info-dialog");
  hideDialog("keybindings-dialog");
  hideDialog("impressum-dialog");
  if (gamePaused && document.getElementById("pause-dialog").classList.contains("active")) {
    hidePauseMenu();
  }
}

/**
 * Handle game control keydown
 * @param {KeyboardEvent} e - Keyboard event
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
 * Handle keyup events
 * @param {KeyboardEvent} e - Keyboard event
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
document.addEventListener("DOMContentLoaded", () => {
  initMobileControls();
  handleOrientationChange();
});
