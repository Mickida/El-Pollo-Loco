class BackgroundObject extends MoveableObject {
  width = canvas.width;
  height = canvas.height;
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
