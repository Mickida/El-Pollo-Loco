/**
 * Audio helper functions for the game
 * Provides simple wrappers for common audio operations
 */

/**
 * Play a sound effect if AudioManager is available
 * @param {string} soundName - Name of the sound effect to play
 */
function playSoundEffect(soundName) {
  if (window.AudioManager) {
    window.AudioManager.playSfx(soundName);
  }
}

/**
 * Stop the snoring sound effect
 */
function stopSnoringSound() {
  if (window.AudioManager) {
    window.AudioManager.stopSnoring();
  }
}
