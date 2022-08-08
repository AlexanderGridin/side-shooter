import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";

export class FpsCounter extends GameObject {
  private fps = 0;

  private fontSize = 24;
  private fontFamily = "Arial";

  private posX!: number;
  private posY = 10;

  public update(gameData: SharedGameData): void {
    this.posX = gameData.geometry.width - 130;
    this.fps = 1000 / gameData.deltaTime;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.save();

    context.fillStyle = "#88C0D0";
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillText(
      `FPS: ${this.fps.toFixed(2)}`,
      this.posX,
      this.posY + this.fontSize
    );

    context.restore();
  }
}
