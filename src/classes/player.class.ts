import { GameObject } from "./game-object.class";
import { SharedGameData } from "./game.class";

export class Player extends GameObject {
  public readonly width = 64;
  public readonly height = 128;

  public speed = 3;
  public posX!: number;
  public posY!: number;

  constructor(posX: number, posY: number) {
    super();

    this.posX = posX;
    this.posY = posY;
  }

  public update(gameData: SharedGameData): void {
    if (!this.checkWorldCollision(gameData.geometry)) {
      this.speed = this.speed * -1;
    }

    this.posX += this.speed;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.fillRect(this.posX, this.posY, this.width, this.height);
  }

  private checkWorldCollision(gameGeometry: {
    width: number;
    height: number;
  }): boolean {
    return this.posX >= 0 && this.posX + this.width < gameGeometry.width;
  }
}
