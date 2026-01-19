/* UI renderer that injects templates into the page and keeps project structure intact */
(function () {
  function renderAll() {
    const root = document.getElementById("ui-root");
    if (!root) return;

    root.innerHTML = "";
    // Insert landing + dialogs + game container
    root.insertAdjacentHTML("beforeend", window.Templates.landing);
    root.insertAdjacentHTML("beforeend", window.Templates.infoDialog);
    root.insertAdjacentHTML("beforeend", window.Templates.keybindingsDialog);
    root.insertAdjacentHTML("beforeend", window.Templates.gameContainer);
  }

  // Render as soon as DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
  });

  // Expose helper for tests or manual re-render
  window.UI = {
    renderAll,
  };
})();
