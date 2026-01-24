/**
 * UI renderer that injects templates into the page
 */
(function () {
  /**
   * Render all UI templates into the root element
   */
  function renderAll() {
    const root = document.getElementById("ui-root");
    if (!root) return;
    root.innerHTML = "";
    insertAllTemplates(root);
  }

  /**
   * Insert all templates into the root element
   * @param {HTMLElement} root - The root element
   */
  function insertAllTemplates(root) {
    root.insertAdjacentHTML("beforeend", window.Templates.landing);
    root.insertAdjacentHTML("beforeend", window.Templates.infoDialog);
    root.insertAdjacentHTML("beforeend", window.Templates.keybindingsDialog);
    root.insertAdjacentHTML("beforeend", window.Templates.impressumDialog);
    root.insertAdjacentHTML("beforeend", window.Templates.pauseDialog);
    root.insertAdjacentHTML("beforeend", window.Templates.gameContainer);
    root.insertAdjacentHTML("beforeend", window.Templates.endscreen);
    root.insertAdjacentHTML("beforeend", window.Templates.rotateOverlay);
  }

  /**
   * Show the endscreen with the appropriate image
   * @param {string} type - 'gameover' or 'win'
   */
  function showEndscreen(type) {
    const endscreen = document.getElementById("endscreen");
    const endscreenImg = document.getElementById("endscreen-image");
    if (!endscreen || !endscreenImg) return;
    setEndscreenImage(endscreenImg, type);
    endscreen.classList.remove("hidden");
  }

  /**
   * Set the endscreen image based on type
   * @param {HTMLImageElement} img - The image element
   * @param {string} type - 'gameover' or 'win'
   */
  function setEndscreenImage(img, type) {
    if (type === "win") {
      img.src = "img/You won, you lost/You won A.png";
      img.alt = "You Won!";
    } else {
      img.src = "img/You won, you lost/Game Over.png";
      img.alt = "Game Over";
    }
  }

  /**
   * Hide the endscreen
   */
  function hideEndscreen() {
    const endscreen = document.getElementById("endscreen");
    if (endscreen) endscreen.classList.add("hidden");
  }

  /**
   * Initialize UI on DOM ready
   */
  function initializeUI() {
    renderAll();
    initializeAudio();
  }

  /**
   * Initialize audio manager
   */
  function initializeAudio() {
    if (window.AudioManager) {
      window.AudioManager.init();
      window.AudioManager.updateMuteButton();
    }
  }

  document.addEventListener("DOMContentLoaded", initializeUI);

  window.UI = {
    renderAll,
    showEndscreen,
    hideEndscreen,
  };
})();
