/**
 * AudioManager - Centralized audio control for the game
 * Handles background music, sound effects, and mute state persistence
 */
const AudioManager = {
  // Storage key for mute state
  STORAGE_KEY: "elpollo_mute",

  // Audio instances
  sounds: {
    music: null,
    walk: null,
    jump: null,
    hurt: null,
    gameOver: null,
    win: null,
    splash: null,
    snoring: null,
    coin: null,
    chickenDead: null,
    smallChickenDead: null,
    endbossHit: null,
  },

  // State
  muted: false,
  initialized: false,

  // Rate limiting for SFX (prevent spam)
  lastPlayTime: {},
  minInterval: 200, // ms between same sound plays

  /**
   * Initialize audio manager and load all sounds
   */
  init() {
    if (this.initialized) return;

    // Load mute state from localStorage
    this.muted = localStorage.getItem(this.STORAGE_KEY) === "true";

    // Create audio instances
    this.sounds.music = new Audio("audio/background-music.mp3");
    this.sounds.music.loop = true;
    this.sounds.music.volume = 0.2;

    // Load footstep sequence: walk1..walk4 (will be played sequentially)
    this.sounds.walk = [
      new Audio("audio/walk1.wav"),
      new Audio("audio/walk2.wav"),
      new Audio("audio/walk3.wav"),
      new Audio("audio/walk4.wav"),
    ];
    this.sounds.walk.forEach((a) => (a.volume = 0.1));
    this._walkIndex = 0;

    this.sounds.jump = new Audio("audio/jump.ogg");
    this.sounds.jump.volume = 0.3;

    this.sounds.hurt = new Audio("audio/hurt.ogg");
    this.sounds.hurt.volume = 0.3;

    this.sounds.gameOver = new Audio("audio/game-over.wav");
    this.sounds.gameOver.volume = 0.6;

    this.sounds.win = new Audio("audio/win.wav");
    this.sounds.win.volume = 0.8;

    this.sounds.splash = new Audio("audio/splash.wav");
    this.sounds.splash.volume = 0.1;

    this.sounds.snoring = new Audio("audio/snore.wav");
    this.sounds.snoring.volume = 0.3;
    this.sounds.snoring.loop = true;

    this.sounds.coin = new Audio("audio/coin.wav");
    this.sounds.coin.volume = 0.4;

    this.sounds.chickenDead = new Audio("audio/chickens-dead.wav");
    this.sounds.chickenDead.volume = 0.2;

    this.sounds.smallChickenDead = new Audio("audio/little-chickens-dead.wav");
    this.sounds.smallChickenDead.volume = 0.2;

    this.sounds.endbossHit = new Audio("audio/endboss-hit.mp3");
    this.sounds.endbossHit.volume = 0.4;

    // Apply initial mute state
    this.applyMuteState();

    this.initialized = true;
    console.log("AudioManager initialized, muted:", this.muted);
  },

  /**
   * Apply mute state to all audio elements
   */
  applyMuteState() {
    Object.values(this.sounds).forEach((sound) => {
      if (Array.isArray(sound)) {
        sound.forEach((s) => (s.muted = this.muted));
      } else if (sound) {
        sound.muted = this.muted;
      }
    });
  },

  /**
   * Toggle mute state and save to localStorage
   * @returns {boolean} New mute state
   */
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem(this.STORAGE_KEY, this.muted.toString());
    this.applyMuteState();
    this.updateMuteButton();
    return this.muted;
  },

  /**
   * Set mute state explicitly
   * @param {boolean} muted - Whether audio should be muted
   */
  setMuted(muted) {
    this.muted = muted;
    localStorage.setItem(this.STORAGE_KEY, this.muted.toString());
    this.applyMuteState();
    this.updateMuteButton();
  },

  /**
   * Update mute button icon based on current state
   */
  updateMuteButton() {
    const btn = document.getElementById("mute-btn");
    if (btn) {
      btn.innerHTML = this.muted ? "🔇" : "🔊";
      btn.title = this.muted ? "Unmute" : "Mute";
    }
  },

  /**
   * Play background music
   */
  playMusic() {
    if (!this.sounds.music) return;
    if (this.muted) return;

    // Reset and play with a small delay to ensure audio is ready
    this.sounds.music.pause();
    this.sounds.music.currentTime = 0;

    setTimeout(() => {
      if (this.sounds.music && !this.muted) {
        this.sounds.music.play().catch((e) => {
          console.log("Music autoplay blocked:", e.message);
        });
      }
    }, 50);
  },

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.sounds.music) {
      this.sounds.music.pause();
      this.sounds.music.currentTime = 0;
    }
  },

  /**
   * Play a sound effect with rate limiting
   * @param {string} name - Name of the sound (walk, jump, hurt, gameOver, win)
   */
  playSfx(name) {
    if (this.muted) return;

    const sound = this.sounds[name];
    if (!sound) return;

    // Rate limiting
    const now = Date.now();
    const lastTime = this.lastPlayTime[name] || 0;
    if (now - lastTime < this.minInterval) return;

    this.lastPlayTime[name] = now;

    // If sound is an array (sequence), play next in sequence
    if (Array.isArray(sound)) {
      const idx = this._walkIndex % sound.length;
      const sfx = sound[idx];
      try {
        sfx.currentTime = 0;
        sfx.play();
      } catch (e) {
        console.log(`SFX ${name}[${idx}] play failed:`, e.message);
      }
      this._walkIndex = (this._walkIndex + 1) % sound.length;
    } else {
      // Single Audio instance
      sound.currentTime = 0;
      sound.play().catch((e) => {
        console.log(`SFX ${name} play failed:`, e.message);
      });
    }
  },

  /**
   * Stop all sounds
   */
  stopAll() {
    this.isSnoring = false;
    Object.values(this.sounds).forEach((sound) => {
      if (Array.isArray(sound)) {
        sound.forEach((s) => {
          s.pause();
          s.currentTime = 0;
        });
      } else if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  },

  // Track snoring state
  isSnoring: false,

  /**
   * Start playing snoring sound (looped)
   */
  startSnoring() {
    if (this.muted) return;
    if (this.isSnoring) return; // Already snoring

    if (this.sounds.snoring) {
      this.isSnoring = true;
      this.sounds.snoring.currentTime = 0;
      this.sounds.snoring.play().catch((e) => {
        console.log("Snoring play failed:", e.message);
        this.isSnoring = false;
      });
    }
  },

  /**
   * Stop snoring sound
   */
  stopSnoring() {
    if (this.sounds.snoring && this.isSnoring) {
      this.sounds.snoring.pause();
      this.sounds.snoring.currentTime = 0;
      this.isSnoring = false;
    }
  },

  /**
   * Check if audio manager is muted
   * @returns {boolean}
   */
  isMuted() {
    return this.muted;
  },

  /**
   * Reset audio manager to default state (for game restart)
   * Does not read from localStorage - always starts unmuted
   */
  reset() {
    this.stopAll();
    this.muted = false;
    this.initialized = false;
    this.isSnoring = false;
    this.lastPlayTime = {};
    localStorage.removeItem(this.STORAGE_KEY);
  },
};

// Expose to global scope
window.AudioManager = AudioManager;
