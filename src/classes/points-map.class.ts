import { Point } from "./point.class";

export class PointsMap {
  public center!: Point;

  public topCenter!: Point;
  public rightCenter!: Point;
  public bottomCenter!: Point;
  public leftCenter!: Point;

  public topLeft!: Point;
  public topRight!: Point;
  public bottomRight!: Point;
  public bottomLeft!: Point;

  public initForRectangle({
    centerPoint,
    width,
    height,
  }: {
    centerPoint: Point;
    width: number;
    height: number;
  }): void {
    const { x, y } = centerPoint;

    this.center = new Point(x, y);

    this.topCenter = new Point(x, Math.ceil(y - height * 0.5));
    this.rightCenter = new Point(Math.ceil(x + width * 0.5), y);
    this.bottomCenter = new Point(x, Math.ceil(y + height * 0.5));
    this.leftCenter = new Point(Math.ceil(x - width * 0.5), y);

    this.topLeft = new Point(
      Math.ceil(x - width * 0.5),
      Math.ceil(y - height * 0.5)
    );
    this.topRight = new Point(
      Math.ceil(x + width * 0.5),
      Math.ceil(y - height * 0.5)
    );
    this.bottomRight = new Point(
      Math.ceil(x + width * 0.5),
      Math.ceil(y + height * 0.5)
    );
    this.bottomLeft = new Point(
      Math.ceil(x - width * 0.5),
      Math.ceil(y + height * 0.5)
    );
  }

  public updateRectangleMap({
    x,
    y,
    width,
    height,
  }: {
    x: number | null;
    y: number | null;
    width: number;
    height: number;
  }): void {
    if (x !== null) {
      this.center.x = x;

      this.topCenter.x = x;
      this.rightCenter.x = Math.ceil(x + width * 0.5);
      this.bottomCenter.x = x;
      this.leftCenter.x = Math.ceil(x - width * 0.5);

      this.topLeft.x = Math.ceil(x - width * 0.5);
      this.topRight.x = Math.ceil(x + width * 0.5);
      this.bottomRight.x = Math.ceil(x + width * 0.5);
      this.bottomLeft.x = Math.ceil(x - width * 0.5);
    }

    if (y !== null) {
      this.center.y = y;

      this.topCenter.y = Math.ceil(y - height * 0.5);
      this.rightCenter.y = y;
      this.bottomCenter.y = Math.ceil(y + height * 0.5);
      this.leftCenter.y = y;

      this.topLeft.y = Math.ceil(y - height * 0.5);
      this.topRight.y = Math.ceil(y - height * 0.5);
      this.bottomRight.y = Math.ceil(y + height * 0.5);
      this.bottomLeft.y = Math.ceil(y + height * 0.5);
    }
  }
}
