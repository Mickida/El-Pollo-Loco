class Cloud extends MoveableObject {
  y = 40;
  height = 250;
  width = 500;
  levelWidth = 720 * 4; // Default level width

  constructor(x = null, levelWidth = 720 * 4) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.levelWidth = levelWidth;
    this.x = x !== null ? x : Math.random() * this.levelWidth;
    this.speed = 0.15 + Math.random() * 0.1; // Slight speed variation
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
      // Recycle cloud when it moves off-screen to the left
      if (this.x + this.width < -100) {
        this.x = this.levelWidth + Math.random() * 500;
      }
    }, 1000 / 60);
  }
}
