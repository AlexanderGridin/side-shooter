import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";
import { canvas } from "./canvas.class";
import { colors } from "../static-data/colors";

export class FpsCounter extends GameObject {
  private fps = 0;

  private fontSize = 24;
  private fontFamily = "Arial";

  private posX = canvas.width - 140;
  private posY = 10;

  public update(gameData: SharedGameData): void {
    this.fps = 1000 / gameData.deltaTime;
  }

  public draw(): void {
    canvas.drawText({
      position: {
        x: this.posX,
        y: this.posY + this.fontSize,
      },
      text: `FPS: ${this.fps.toFixed(2)}`,
      color: colors.nord.green,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
    });
  }
}
