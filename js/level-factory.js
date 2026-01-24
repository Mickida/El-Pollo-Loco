/**
 * Factory functions for creating level objects
 */

/**
 * Reset level to initial state
 */
function resetLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCoins(),
    createBottles()
  );
}

/**
 * Create enemy objects for the level
 * @returns {Array} Array of enemy objects
 */
function createEnemies() {
  return [
    new Chicken(400),
    new Chicken(700),
    new SmallChicken(1000),
    new SmallChicken(1300),
    new SmallChicken(1500),
    new Chicken(1800),
    new Chicken(2100),
    new Endboss(),
  ];
}

/**
 * Create cloud objects for the level
 * @returns {Array} Array of cloud objects
 */
function createClouds() {
  return [
    new Cloud(0),
    new Cloud(500),
    new Cloud(1000),
    new Cloud(1500),
    new Cloud(2000),
    new Cloud(2500),
  ];
}

/**
 * Create coin objects for the level
 * @returns {Array} Array of coin objects
 */
function createCoins() {
  return [
    new Coin(350, 280),
    new Coin(600, 200),
    new Coin(900, 150),
    new Coin(1200, 250),
    new Coin(1600, 180),
  ];
}

/**
 * Create bottle objects for the level
 * @returns {Array} Array of bottle objects
 */
function createBottles() {
  return [
    new CollectibleBottle(450, 350),
    new CollectibleBottle(750, 350),
    new CollectibleBottle(1050, 350),
    new CollectibleBottle(1400, 350),
    new CollectibleBottle(1800, 350),
  ];
}

/**
 * Create background objects for the level
 * @returns {Array} Array of background objects
 */
function createBackgroundObjects() {
  return [
    ...createBackgroundLayer(-720, "2"),
    ...createBackgroundLayer(0, "1"),
    ...createBackgroundLayer(720, "2"),
    ...createBackgroundLayer(720 * 2, "1"),
    ...createBackgroundLayer(720 * 3, "2"),
  ];
}

/**
 * Create a single background layer
 * @param {number} x - X position
 * @param {string} variant - Layer variant (1 or 2)
 * @returns {Array} Array of background objects for this layer
 */
function createBackgroundLayer(x, variant) {
  return [
    new BackgroundObject("img/5_background/layers/air.png", x),
    new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, x),
    new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, x),
    new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, x),
  ];
}
