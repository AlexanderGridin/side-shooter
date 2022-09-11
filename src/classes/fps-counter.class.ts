import { GameObject } from "./game-object.class";
import { canvas } from "./canvas.class";
import { colors } from "../static-data/colors";
import { Point } from "./point.class";

export class FpsCounter extends GameObject {
  private fps = 60;

  private timeOfPrevFrame = 0;
  private timeOfLasUpdate = 0;

  private readonly fontSize = 24;
  private readonly fontFamily = "Arial";

  private readonly position: Point = new Point(
    canvas.width - 100,
    this.fontSize + 10
  );

  public update(): void {
    const currentTime = new Date().getTime();

    if (currentTime - this.timeOfLasUpdate > 1000) {
      this.fps = 1000 / (currentTime - this.timeOfPrevFrame);
      this.timeOfLasUpdate = currentTime;
    }

    this.timeOfPrevFrame = currentTime;
  }

  public draw(): void {
    const { x, y } = this.position;

    canvas.drawText({
      position: {
        x,
        y,
      },
      text: `FPS: ${this.fps.toFixed()}`,
      color: colors.nord.green,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
    });
  }
}
