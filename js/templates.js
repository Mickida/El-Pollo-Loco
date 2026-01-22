/* Templates for UI rendering */
const Templates = {
  landing: `
    <div id="landing-page" class="landing-page">
      <div class="landing-content">
        <h1 class="game-title">El Pollo Loco</h1>
        <p class="game-subtitle">The crazy chicken adventure awaits!</p>
        <div class="button-container">
          <button id="start-btn" class="btn btn-primary" onclick="startGame()"><span>▶</span> Start Game</button>
          <button id="restart-btn" class="btn btn-primary hidden" onclick="restartGame()"><span>🔄</span> Restart Game</button>
          <button id="info-btn" class="btn btn-secondary" onclick="showInfoDialog()"><span>ℹ</span> Instructions</button>
          <button id="keys-btn" class="btn btn-secondary" onclick="showKeybindingsDialog()"><span>⌨</span> Keybindings</button>
          <button id="fullscreen-btn" class="btn btn-secondary" onclick="toggleFullscreen()"><span>⛶</span> Fullscreen</button>
        </div>
      </div>
    </div>
  `,

  infoDialog: `
    <div id="info-dialog" class="dialog-overlay" onclick="closeDialogOnBackdrop(event, 'info-dialog')">
      <div class="dialog">
        <button class="dialog-close" onclick="hideDialog('info-dialog')">✕</button>
        <h2>Game Instructions</h2>
        <div class="dialog-content">
          <h3>🎯 Goal of the Game</h3>
          <p>Help Pepe, the brave character, navigate the dangerous desert and defeat the crazy final boss rooster!</p>

          <h3>📖 Story</h3>
          <p>Pepe wanders through the Mexican desert when suddenly wild chickens attack. To survive, he must collect salsa bottles and throw them at the chickens. At the end awaits the feared El Pollo Loco — a huge, crazy rooster!</p>

          <h3>🎮 How to Play</h3>
          <ul>
            <li><strong>Move:</strong> Use the arrow keys to control Pepe</li>
            <li><strong>Jump:</strong> Press SPACE to jump over obstacles</li>
            <li><strong>Throw:</strong> Press D to throw salsa bottles</li>
            <li><strong>Collect:</strong> Gather coins and bottles along your way</li>
          </ul>

          <h3>⚠️ Tips</h3>
          <ul>
            <li>Jump on chickens to defeat them</li>
            <li>Collect enough bottles before facing the final boss</li>
            <li>Pay attention to your health bar at the top-left</li>
          </ul>
        </div>
      </div>
    </div>
  `,

  keybindingsDialog: `
    <div id="keybindings-dialog" class="dialog-overlay" onclick="closeDialogOnBackdrop(event, 'keybindings-dialog')">
      <div class="dialog">
        <button class="dialog-close" onclick="hideDialog('keybindings-dialog')">✕</button>
        <h2>Keybindings</h2>
        <div class="dialog-content">
          <table class="keybindings-table">
            <tr><td><kbd>←</kbd></td><td>Move left</td></tr>
            <tr><td><kbd>→</kbd></td><td>Move right</td></tr>
            <tr><td><kbd>↑</kbd></td><td>Move up (climb)</td></tr>
            <tr><td><kbd>↓</kbd></td><td>Move down (crouch)</td></tr>
            <tr><td><kbd>SPACE</kbd></td><td>Jump</td></tr>
            <tr><td><kbd>D</kbd></td><td>Throw bottle</td></tr>
          </table>
        </div>
      </div>
    </div>
  `,

  gameContainer: `
    <div id="game-container" class="game-container hidden">
      <canvas id="canvas" width="720" height="480"></canvas>
      <div class="game-controls">
        <button id="mute-btn" class="btn btn-small" onclick="AudioManager.toggleMute(); this.blur();" title="Mute">🔊</button>
        <button class="btn btn-small" onclick="restartGame(); this.blur();" title="Restart">🔄</button>
        <button class="btn btn-small" onclick="toggleFullscreen(); this.blur();" title="Fullscreen">⛶</button>
        <button class="btn btn-small" onclick="backToMenu(); this.blur();" title="Menu">☰</button>
      </div>
    </div>
  `,

  endscreen: `
    <div id="endscreen" class="endscreen-overlay hidden">
      <div class="endscreen-content">
        <img id="endscreen-image" src="" alt="Game Over" class="endscreen-image">
        <div class="endscreen-buttons">
          <button class="btn btn-primary" onclick="restartGame()"><span>🔄</span> Restart</button>
          <button class="btn btn-secondary" onclick="goToMainMenu()"><span>🏠</span> Home</button>
        </div>
      </div>
    </div>
  `,
};

// Expose Templates to global scope for simplicity (no bundler)
window.Templates = Templates;
