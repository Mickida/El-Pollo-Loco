# 🐔 El Pollo Loco

An exciting jump-and-run game in Mexican style, developed with pure JavaScript, HTML5 Canvas and CSS.

![El Pollo Loco](img/9_intro_outro_screens/start/startscreen_1.png)

## 📖 About the Game

El Pollo Loco is a classic 2D platformer game where you control **Pepe**, a brave character fighting through a dangerous world full of chickens. Your goal is to defeat the endboss by throwing salsa bottles at him!

## 🎮 Game Features

- **Smooth Animations**: Over 100 hand-drawn frames for realistic character movements
- **Enemy System**: Normal chickens, small chickens and a mighty endboss
- **Collectibles**: Coins and salsa bottles to collect
- **Throwing System**: Throw salsa bottles at your enemies
- **Status Bars**: Health, coins and bottles displayed
- **Responsive Design**: Playable on desktop and mobile devices
- **Mobile Controls**: Touch controls for smartphones and tablets
- **Audio System**: Background music and sound effects
- **Orientation Detection**: Automatic pause in portrait mode on mobile devices

## 🕹️ Controls

### Desktop

- **Arrow Keys ←/→**: Move
- **Spacebar**: Jump
- **D**: Throw bottle

### Mobile

- **Touch Buttons**: Virtual controls on screen

## 🚀 Installation & Start

1. **Clone repository**

   ```bash
   git clone https://github.com/YOUR-USERNAME/el-pollo-loco.git
   ```

2. **Open project**

   ```bash
   cd el-pollo-loco
   ```

3. **Start game**
   - Open the `index.html` file in a modern web browser
   - Or use a local web server:

     ```bash
     # With Python
     python -m http.server 8000

     # With Node.js (http-server)
     npx http-server
     ```

4. **Play!**
   - Open `http://localhost:8000` in your browser

## 🛠️ Technologies

- **HTML5 Canvas** - Rendering and graphics
- **Vanilla JavaScript** (OOP) - Game logic and mechanics
- **CSS3** - Styling and responsive design
- **Web Audio API** - Sound and music

## 📁 Project Structure

```
el-pollo-loco/
├── index.html              # Main HTML file
├── style.css              # Main stylesheet
├── audio/                 # Sound effects and music
├── img/                   # All game graphics
│   ├── 2_character_pepe/  # Character sprites
│   ├── 3_enemies_chicken/ # Enemy sprites
│   ├── 4_enemie_boss_chicken/ # Boss sprites
│   ├── 5_background/      # Background layers
│   ├── 6_salsa_bottle/    # Bottle sprites
│   ├── 7_statusbars/      # UI elements
│   └── 8_coin/            # Coins
├── js/                    # JavaScript logic
│   ├── game.js            # Main game controller
│   ├── audio-manager.js   # Audio management
│   ├── ui.js              # UI management
│   └── mobile-controls.js # Touch controls
├── models/                # Game classes (OOP)
│   ├── character.class.js # Player character
│   ├── chicken.class.js   # Chicken enemies
│   ├── endboss.class.js   # Boss enemy
│   ├── world.class.js     # Game world
│   └── ...                # Additional classes
├── levels/                # Level configurations
│   └── level1.js          # First level
└── styles/                # Additional stylesheets
    ├── game.css           # Game styles
    ├── mobile-controls.css # Mobile UI
    └── responsive.css     # Responsive design
```

## 🎯 Game Objective

1. Collect **coins** and **salsa bottles**
2. Defeat the **chickens** by jumping on them
3. Find the **endboss**
4. Throw **salsa bottles** at the endboss to defeat him
5. Watch your **health** - avoid enemies or eliminate them!

## 🎨 Object-Oriented Design

The game uses a clear OOP concept with inheritance:

- `DrawableObject` - Base class for all drawable objects
- `MoveableObject` - Extends DrawableObject with movement, collision and gravity
- `Character` - The playable character (Pepe)
- `Chicken` / `SmallChicken` / `Endboss` - Different enemy types
- `ThrowableObject` - Throwable salsa bottles
- `World` - Manages the game world and collisions
- `Level` - Level structure with enemies and objects

## 🌐 Browser Compatibility

The game runs in all modern browsers:

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 📱 Mobile Support

- Optimized for touch devices
- Virtual control buttons
- Automatic orientation detection
- Responsive canvas scaling

## 🎓 Project Context

This game was developed as part of the **Developer Akademie** and demonstrates:

- JavaScript OOP concepts
- Canvas API and animation
- Collision detection
- Game loop and performance
- Responsive web design
- Audio integration

## 📝 License

This project was created for educational purposes. The graphics and assets are part of the Developer Akademie course material.

## 👤 Author

Developed by **Daniel** as part of the Developer Akademie training.

---

**Have fun playing! 🎮🐔**
