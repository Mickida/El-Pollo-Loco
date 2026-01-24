let level1 = new Level(
  [
    new Chicken(400),
    new Chicken(700),
    new SmallChicken(1000),
    new SmallChicken(1300),
    new SmallChicken(1500),
    new Chicken(1800),
    new Chicken(2100),
    new Endboss(),
  ],
  [
    new Cloud(0),
    new Cloud(500),
    new Cloud(1000),
    new Cloud(1500),
    new Cloud(2000),
    new Cloud(2500),
  ],
  [
    new BackgroundObject("img/5_background/layers/air.png", -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

    new BackgroundObject("img/5_background/layers/air.png", 720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

    new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      720 * 2,
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      720 * 2,
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      720 * 2,
    ),

    new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      720 * 3,
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      720 * 3,
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      720 * 3,
    ),
  ],
  [
    new Coin(350, 280),
    new Coin(600, 200),
    new Coin(900, 150),
    new Coin(1200, 250),
    new Coin(1600, 180),
  ],
  [
    new CollectibleBottle(450, 350),
    new CollectibleBottle(750, 350),
    new CollectibleBottle(1050, 350),
    new CollectibleBottle(1400, 350),
    new CollectibleBottle(1800, 350),
  ],
);
