/**
 * Level container class that holds all game objects for a level
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2200;

  /**
   * Create a new level
   * @param {MoveableObject[]} enemies - Array of enemy objects
   * @param {Cloud[]} clouds - Array of cloud objects
   * @param {BackgroundObject[]} backgroundObjects - Array of background objects
   * @param {Coin[]} coins - Array of coin objects
   * @param {CollectibleBottle[]} bottles - Array of collectible bottles
   */
  constructor(enemies, clouds, backgroundObjects, coins = [], bottles = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
