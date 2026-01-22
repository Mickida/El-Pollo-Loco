/**
 * Collectible bottle on the ground that can be picked up
 * @extends MoveableObject
 */
class CollectibleBottle extends MoveableObject {
  height = 80;
  width = 70;

  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Create a collectible bottle
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Animate the bottle with a simple glint effect
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 400);
  }
}
