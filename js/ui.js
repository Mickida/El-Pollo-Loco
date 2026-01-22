/* UI renderer that injects templates into the page and keeps project structure intact */
(function () {
  function renderAll() {
    const root = document.getElementById("ui-root");
    if (!root) return;

    root.innerHTML = "";
    // Insert landing + dialogs + game container + endscreen
    root.insertAdjacentHTML("beforeend", window.Templates.landing);
    root.insertAdjacentHTML("beforeend", window.Templates.infoDialog);
    root.insertAdjacentHTML("beforeend", window.Templates.keybindingsDialog);
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

    // Set the appropriate image based on game outcome
    if (type === "win") {
      endscreenImg.src = "img/You won, you lost/You won A.png";
      endscreenImg.alt = "You Won!";
    } else {
      endscreenImg.src = "img/You won, you lost/Game Over.png";
      endscreenImg.alt = "Game Over";
    }

    endscreen.classList.remove("hidden");
  }

  /**
   * Hide the endscreen
   */
  function hideEndscreen() {
    const endscreen = document.getElementById("endscreen");
    if (endscreen) {
      endscreen.classList.add("hidden");
    }
  }

  // Render as soon as DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    // Initialize AudioManager and update mute button state
    if (window.AudioManager) {
      window.AudioManager.init();
      window.AudioManager.updateMuteButton();
    }
  });

  // Expose helpers for tests or manual re-render
  window.UI = {
    renderAll,
    showEndscreen,
    hideEndscreen,
  };
})();
