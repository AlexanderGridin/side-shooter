import { Draw } from "../interfaces/draw.interface";
import { Update } from "../interfaces/update.inteface";
import { colors } from "../static-data/colors";
import { Canvas } from "./canvas.class";

export class Grid implements Update, Draw {
  private canvas!: Canvas;
  private cellWidth!: number;
  private cellHeight!: number;

  private rows = 0;
  private cols = 0;

  constructor(canvas: Canvas, cellWidth = 64, cellHeight = 64) {
    this.canvas = canvas;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
  }

  public update(): void {
    this.rows = Math.ceil(this.canvas.height / this.cellHeight);
    this.cols = Math.ceil(this.canvas.width / this.cellWidth);
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.save();

    this.setupDrawindContext(context);
    this.drawRows(context);
    this.drawCols(context);

    context.restore();
  }

  private setupDrawindContext(context: CanvasRenderingContext2D): void {
    context.strokeStyle = colors.nord.orange;
    context.lineWidth = 1;
  }

  private drawRows(context: CanvasRenderingContext2D): void {
    for (let i = 1; i < this.rows; i++) {
      context.beginPath();
      context.moveTo(0, i * this.cellHeight);
      context.lineTo(this.canvas.width, i * this.cellWidth);
      context.stroke();
    }
  }

  private drawCols(context: CanvasRenderingContext2D): void {
    for (let i = 1; i < this.cols; i++) {
      context.beginPath();
      context.moveTo(i * this.cellWidth, 0);
      context.lineTo(i * this.cellWidth, this.canvas.height);
      context.stroke();
    }
  }
}
