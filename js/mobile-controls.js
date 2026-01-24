/**
 * Mobile controls handler for touch devices
 */

/**
 * Check if the device supports touch
 * @returns {boolean} True if touch device
 */
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if device is in portrait orientation
 * @returns {boolean} True if portrait mode
 */
function isPortrait() {
  return window.innerHeight > window.innerWidth;
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
 * Bind touch events to a mobile button
 * @param {string} buttonId - The button element ID
 * @param {string} keyboardKey - The keyboard key to simulate
 */
function bindMobileButton(buttonId, keyboardKey) {
  let button = document.getElementById(buttonId);
  if (!button) return;
  button.addEventListener("touchstart", (e) => handleTouchStart(e, keyboardKey));
  button.addEventListener("touchend", (e) => handleTouchEnd(e, keyboardKey));
  button.addEventListener("touchcancel", (e) => handleTouchEnd(e, keyboardKey));
}

/**
 * Handle touch start event
 * @param {TouchEvent} e - The touch event
 * @param {string} keyboardKey - The keyboard key
 */
function handleTouchStart(e, keyboardKey) {
  e.preventDefault();
  keyboard[keyboardKey] = true;
}

/**
 * Handle touch end event
 * @param {TouchEvent} e - The touch event
 * @param {string} keyboardKey - The keyboard key
 */
function handleTouchEnd(e, keyboardKey) {
  e.preventDefault();
  keyboard[keyboardKey] = false;
}

/**
 * Disable context menu on all mobile buttons
 */
function disableContextMenuOnMobileButtons() {
  let buttons = document.querySelectorAll(".mobile-btn");
  buttons.forEach((button) => {
    button.addEventListener("contextmenu", (e) => e.preventDefault());
  });
}

/**
 * Handle orientation changes
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
 * Pause game when in portrait mode
 */
function pauseGameForPortrait() {
  if (!gameStarted || gameEnded || gamePaused) return;
  pausedForPortrait = true;
  if (world) world.pauseGame();
  if (window.AudioManager) window.AudioManager.stopMusic();
}

/**
 * Resume game when switching to landscape
 */
function resumeGameFromPortrait() {
  if (!pausedForPortrait || gameEnded) return;
  pausedForPortrait = false;
  if (world && world.gamePaused) {
    world.resumeGame();
    if (window.AudioManager) window.AudioManager.playMusic();
  }
}

window.addEventListener("orientationchange", handleOrientationChange);
window.addEventListener("resize", handleOrientationChange);
