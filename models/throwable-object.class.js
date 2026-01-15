class ThrowableObject extends MoveableObject {
  constructor(x, y) {
    super();
    this.loadImage("img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 80;
    this.throw(x, y);
  }

  throw(x, y) {
    this.speedY = 30;
    this.x = x;
    this.y = y;
    this.applyGravity();
    setInterval(() => {
      this.x += 10;
    }, 25);
  }
}
