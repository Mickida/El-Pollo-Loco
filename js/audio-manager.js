/**
 * AudioManager - Centralized audio control for the game
 * Handles background music, sound effects, and mute state persistence
 */
const AudioManager = {
  STORAGE_KEY: "elpollo_mute",

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

  muted: false,
  initialized: false,
  lastPlayTime: {},
  minInterval: 200,
  isSnoring: false,
  _walkIndex: 0,

  /**
   * Initialize audio manager and load all sounds
   */
  init() {
    if (this.initialized) return;
    this.muted = localStorage.getItem(this.STORAGE_KEY) === "true";
    this.initMusic();
    this.initWalkSounds();
    this.initSoundEffects();
    this.applyMuteState();
    this.initialized = true;
  },

  /**
   * Initialize background music
   */
  initMusic() {
    this.sounds.music = new Audio("audio/background-music.mp3");
    this.sounds.music.loop = true;
    this.sounds.music.volume = 0.2;
  },

  /**
   * Initialize walk sound sequence
   */
  initWalkSounds() {
    this.sounds.walk = [
      new Audio("audio/walk1.wav"),
      new Audio("audio/walk2.wav"),
      new Audio("audio/walk3.wav"),
      new Audio("audio/walk4.wav"),
    ];
    this.sounds.walk.forEach((a) => (a.volume = 0.1));
  },

  /**
   * Initialize all sound effects
   */
  initSoundEffects() {
    this.sounds.jump = this.createSound("audio/jump.ogg", 0.3);
    this.sounds.hurt = this.createSound("audio/hurt.ogg", 0.3);
    this.sounds.gameOver = this.createSound("audio/game-over.wav", 0.6);
    this.sounds.win = this.createSound("audio/win.wav", 0.8);
    this.sounds.splash = this.createSound("audio/splash.wav", 0.1);
    this.sounds.coin = this.createSound("audio/coin.wav", 0.4);
    this.sounds.chickenDead = this.createSound("audio/chickens-dead.wav", 0.2);
    this.sounds.smallChickenDead = this.createSound("audio/little-chickens-dead.wav", 0.2);
    this.sounds.endbossHit = this.createSound("audio/endboss-hit.mp3", 0.4);
    this.initSnoringSound();
  },

  /**
   * Create an audio element with specified volume
   * @param {string} src - Audio file path
   * @param {number} volume - Volume level (0-1)
   * @returns {HTMLAudioElement} Audio element
   */
  createSound(src, volume) {
    let audio = new Audio(src);
    audio.volume = volume;
    return audio;
  },

  /**
   * Initialize snoring sound with loop
   */
  initSnoringSound() {
    this.sounds.snoring = new Audio("audio/snore.wav");
    this.sounds.snoring.volume = 0.3;
    this.sounds.snoring.loop = true;
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
    if (!this.sounds.music || this.muted) return;
    this.sounds.music.pause();
    this.sounds.music.currentTime = 0;
    setTimeout(() => this.tryPlayMusic(), 50);
  },

  /**
   * Attempt to play music with error handling
   */
  tryPlayMusic() {
    if (this.sounds.music && !this.muted) {
      this.sounds.music.play().catch(() => {});
    }
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
   * @param {string} name - Name of the sound
   */
  playSfx(name) {
    if (this.muted) return;
    const sound = this.sounds[name];
    if (!sound || !this.canPlaySound(name)) return;
    this.lastPlayTime[name] = Date.now();
    this.playSound(sound, name);
  },

  /**
   * Check if enough time has passed to play sound again
   * @param {string} name - Sound name
   * @returns {boolean} True if can play
   */
  canPlaySound(name) {
    const now = Date.now();
    const lastTime = this.lastPlayTime[name] || 0;
    return now - lastTime >= this.minInterval;
  },

  /**
   * Play a sound (handles arrays and single sounds)
   * @param {HTMLAudioElement|Array} sound - Sound to play
   * @param {string} name - Sound name for logging
   */
  playSound(sound, name) {
    if (Array.isArray(sound)) {
      this.playSequenceSound(sound);
    } else {
      this.playSingleSound(sound);
    }
  },

  /**
   * Play next sound in a sequence
   * @param {Array} sounds - Array of audio elements
   */
  playSequenceSound(sounds) {
    const idx = this._walkIndex % sounds.length;
    const sfx = sounds[idx];
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
    this._walkIndex = (this._walkIndex + 1) % sounds.length;
  },

  /**
   * Play a single sound
   * @param {HTMLAudioElement} sound - Audio element
   */
  playSingleSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  },

  /**
   * Stop all sounds
   */
  stopAll() {
    this.isSnoring = false;
    Object.values(this.sounds).forEach((sound) => {
      this.stopSound(sound);
    });
  },

  /**
   * Stop a single sound or array of sounds
   * @param {HTMLAudioElement|Array} sound - Sound to stop
   */
  stopSound(sound) {
    if (Array.isArray(sound)) {
      sound.forEach((s) => this.resetAudio(s));
    } else if (sound) {
      this.resetAudio(sound);
    }
  },

  /**
   * Reset an audio element to initial state
   * @param {HTMLAudioElement} audio - Audio element
   */
  resetAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
  },

  /**
   * Start playing snoring sound
   */
  startSnoring() {
    if (this.muted || this.isSnoring) return;
    if (this.sounds.snoring) {
      this.isSnoring = true;
      this.sounds.snoring.currentTime = 0;
      this.sounds.snoring.play().catch(() => (this.isSnoring = false));
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
   * @returns {boolean} True if muted
   */
  isMuted() {
    return this.muted;
  },

  /**
   * Reset audio manager to default state
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

window.AudioManager = AudioManager;
