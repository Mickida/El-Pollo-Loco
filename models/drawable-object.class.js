/**
 * Base class for all drawable game objects
 */
class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  // Hitbox offset for more accurate collision detection
  // These values shrink the hitbox from each side
  hitboxOffsetTop = 0;
  hitboxOffsetBottom = 0;
  hitboxOffsetLeft = 0;
  hitboxOffsetRight = 0;

  /**
   * Load a single image
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Load multiple images into the cache
   * @param {string[]} arr - Array of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draw the object on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draw debug frame around hitbox (disabled in production)
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  drawFrame(ctx) {
    // Debug hitbox drawing - uncomment for debugging
  }
}
