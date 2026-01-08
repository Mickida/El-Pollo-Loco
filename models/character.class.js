class Character extends MoveableObject {
  height = 280;
  y = 155;

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
  }

  jump() {}
}
