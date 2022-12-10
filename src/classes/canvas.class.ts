import { Point } from "./point.class";

export class Canvas {
  private _element!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;

  private defaultWidth = 640;
  private defaultHeight = 480;

  private isElementWasCreated = false;

  public centerPoint!: Point;

  constructor({
    id,
    width,
    height,
  }: {
    id?: string;
    width?: number;
    height?: number;
  }) {
    const DOMElement: HTMLCanvasElement | null =
      document.querySelector<HTMLCanvasElement>(`#${id}`);
    this._element = DOMElement ?? this.createElement({ id, width, height });

    if (!this.isElementWasCreated) {
      this.setElementInitialSize(width, height);
    }

    this.initCenterPoint();
    this._context = this._element.getContext("2d") as CanvasRenderingContext2D;
    // this.initResizing();
  }

  private createElement({
    id = "canvas-default-id",
    width = this.defaultWidth,
    height = this.defaultHeight,
  }): HTMLCanvasElement {
    const element = document.createElement("canvas");

    element.width = width;
    element.height = height;
    element.id = id;

    this.isElementWasCreated = true;

    return element;
  }

  private setElementInitialSize(
    width = this.defaultWidth,
    height = this.defaultHeight
  ): void {
    this._element.width = width;
    this._element.height = height;
  }

  private initCenterPoint(): void {
    this.centerPoint = new Point(
      this._element?.width * 0.5,
      this._element?.height * 0.5
    );
  }

  // TODO: weak point
  private initResizing(): void {
    // TODO: need to make normal resizing
    window.addEventListener("resize", () => {
      if (!this._element) {
        return;
      }

      this._element.width = this.windowWidth;
      this._element.height = this.windowHeight;
    });
  }

  private get windowWidth(): number {
    return window.innerWidth - 20;
  }

  private get windowHeight(): number {
    return window.innerHeight - 20;
  }

  public drawRectangle({
    position,
    width,
    height,
    color,
  }: {
    position: Point;
    width: number;
    height: number;
    color?: string;
  }): void {
    if (!this._context) {
      return;
    }

    this._context.save();

    this._context.fillStyle = color || "";
    this._context.fillRect(position.x, position.y, width, height);

    this._context.restore();
  }

  public drawLine({
    start,
    end,
    width,
    color,
  }: {
    start: Point;
    end: Point;
    width?: number;
    color?: string;
  }): void {
    if (!this._context) {
      return;
    }

    this._context.save();

    this._context.lineWidth = width || 1;
    this._context.strokeStyle = color || "";

    this._context.beginPath();

    this._context.moveTo(start.x, start.y);
    this._context.lineTo(end.x, end.y);

    this._context.stroke();

    this._context.restore();
  }

  public drawText({
    position,
    text,
    color = "",
    fontSize = 0,
    fontFamily = "",
  }: {
    position: Point;
    text: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  }): void {
    if (!this._context) {
      return;
    }

    this._context.save();

    this._context.fillStyle = color || "";
    this._context.font = `${fontSize}px "${fontFamily}"`;

    this._context.fillText(text, position.x, position.y);

    this._context.restore();
  }

  public clear(): void {
    if (!this._context) {
      return;
    }

    this._context.clearRect(0, 0, this.width, this.height);
  }

  public get element(): HTMLCanvasElement {
    return this._element;
  }

  public get drawingContext(): CanvasRenderingContext2D | null {
    return this._context ? this._context : null;
  }

  public get width(): number {
    return this._element?.width ?? 0;
  }

  public get height(): number {
    return this._element?.height ?? 0;
  }
}

export const canvas = new Canvas({
  id: "game",
  width: 900,
  height: 512,
});

document.body.appendChild(canvas.element as Node);
