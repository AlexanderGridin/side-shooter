import { Draw } from "../interfaces/draw.interface";
import { Update } from "../interfaces/update.inteface";
import { colors } from "../static-data/colors";
import { canvas } from "./canvas.class";

export class Grid implements Update, Draw {
  private cellWidth!: number;
  private cellHeight!: number;

  private rows = 0;
  private cols = 0;

  constructor(cellWidth = 64, cellHeight = 64) {
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  public update(): void {
    this.rows = Math.ceil(canvas.height / this.cellHeight);
    this.cols = Math.ceil(canvas.width / this.cellWidth);
  }

  public draw(): void {
    this.drawRows();
    this.drawCols();
  }

  private drawRows(): void {
    for (let i = 0; i <= this.rows; i++) {
      canvas.drawLine({
        start: {
          x: 0,
          y: i * this.cellHeight,
        },
        end: {
          x: canvas.width,
          y: i * this.cellWidth,
        },
        width: 2,
        color: colors.nord.lightGray,
      });
    }
  }

  private drawCols(): void {
    for (let i = 0; i <= this.cols; i++) {
      canvas.drawLine({
        start: {
          x: i * this.cellWidth,
          y: 0,
        },
        end: {
          x: i * this.cellWidth,
          y: canvas.height,
        },
        width: 2,
        color: colors.nord.lightGray,
      });
    }
  }
}
