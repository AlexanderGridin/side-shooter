import { Direction } from "../enumerations/direction.enum";
import { InputKey } from "../enumerations/input-key.enum";
import { colors } from "../static-data/colors";
import { GameObject } from "./game-object.class";
import { PointsMap } from "./points-map.class";
import { SharedGameData } from "./shared-game-data.class";

interface CollisionData {
  topCollision: boolean;
  rightCollision: boolean;
  bottomCollision: boolean;
  leftCollision: boolean;
}

export class Point {
  constructor(public x: number, public y: number) {}
}

export class Player extends GameObject {
  public readonly width = 64;
  public readonly height = 64;

  private initialSpeed = 5;
  public speed = this.initialSpeed;

  public posX!: number;
  public posY!: number;
  public pointsMap = new PointsMap();
  public direction!: Direction;

  private collisionData!: CollisionData;
  private gameData!: SharedGameData;

  private isShowHelpers = true;

  constructor(posX: number, posY: number) {
    super();

    this.posX = posX;
    this.posY = posY;

    this.pointsMap.initForRectangle({
      centerPoint: {
        x: posX,
        y: posY,
      },
      width: this.width,
      height: this.height,
    });
  }

  public update(gameData: SharedGameData): void {
    this.gameData = gameData;
    this.collisionData = this.getCollisionData(gameData.geometry);

    this.handleWorldCollision();
    this.detectDirection();
    this.calculateMovement();
    this.handleHelpers();
  }

  private getCollisionData(gameGeometry: {
    width: number;
    height: number;
  }): CollisionData {
    const { width, height } = gameGeometry;
    const { topCenter, rightCenter, bottomCenter, leftCenter } = this.pointsMap;

    return {
      topCollision: topCenter.y - this.initialSpeed <= 0,
      rightCollision: rightCenter.x + this.initialSpeed >= width,
      bottomCollision: bottomCenter.y + this.initialSpeed >= height,
      leftCollision: leftCenter.x - this.initialSpeed <= 0,
    };
  }

  private handleWorldCollision(): void {
    const { topCollision, rightCollision, bottomCollision, leftCollision } =
      this.collisionData;
    const { inputHandler } = this.gameData;
    const { W, D, S, A } = InputKey;

    if (topCollision && inputHandler.isKeyPressed(W)) {
      this.handleTopWorldCollision();
      return;
    }

    if (rightCollision && inputHandler.isKeyPressed(D)) {
      this.handleRightWorldCollision();
      return;
    }

    if (bottomCollision && inputHandler.isKeyPressed(S)) {
      this.handleBottomWorldCollision();
      return;
    }

    if (leftCollision && inputHandler.isKeyPressed(A)) {
      this.handleLeftWorldCollision();
      return;
    }

    this.resetSpeed();
  }

  private handleTopWorldCollision(): void {
    const { topCenter } = this.pointsMap;

    if (topCenter.y === this.initialSpeed) {
      return;
    }

    if (topCenter.y - this.initialSpeed < 0) {
      this.speed =
        this.initialSpeed - Math.abs(topCenter.y - this.initialSpeed);
      return;
    }

    this.speed = 0;
  }

  private handleRightWorldCollision(): void {
    const { width } = this.gameData.geometry;
    const { rightCenter } = this.pointsMap;

    if (width - rightCenter.x === this.initialSpeed) {
      return;
    }

    if (rightCenter.x + this.initialSpeed > width) {
      this.speed =
        this.initialSpeed - (rightCenter.x + this.initialSpeed - width);
      return;
    }

    this.speed = 0;
  }

  private handleBottomWorldCollision(): void {
    const { height } = this.gameData.geometry;
    const { bottomCenter } = this.pointsMap;

    if (height - bottomCenter.y === this.initialSpeed) {
      return;
    }

    if (bottomCenter.y + this.initialSpeed > height) {
      this.speed =
        this.initialSpeed - (bottomCenter.y + this.initialSpeed - height);
      return;
    }

    this.speed = 0;
  }

  private handleLeftWorldCollision(): void {
    const { leftCenter } = this.pointsMap;

    if (leftCenter.x === this.initialSpeed) {
      return;
    }

    if (leftCenter.x - this.initialSpeed < 0) {
      this.speed =
        this.initialSpeed - Math.abs(leftCenter.x - this.initialSpeed);
      return;
    }

    this.speed = 0;
  }

  private resetSpeed(): void {
    this.speed = this.initialSpeed;
  }

  private detectDirection(): void {
    const { inputHandler } = this.gameData;
    const { W, S, A, D } = InputKey;
    const { Top, Right, Bottom, Left } = Direction;

    if (inputHandler.isKeyClicked(W)) {
      this.direction = Top;
      return;
    }

    if (inputHandler.isKeyClicked(S)) {
      this.direction = Bottom;
      return;
    }

    if (inputHandler.isKeyClicked(D)) {
      this.direction = Right;
      return;
    }

    if (inputHandler.isKeyClicked(A)) {
      this.direction = Left;
      return;
    }
  }

  private calculateMovement(): void {
    const { inputHandler } = this.gameData;
    const { W, S, A, D } = InputKey;
    const { Top, Right, Bottom, Left, None } = Direction;

    if (inputHandler.isKeyPressed(W) && this.isDirection(Top)) {
      this.moveForward();
      return;
    }

    if (inputHandler.isKeyPressed(D) && this.isDirection(Right)) {
      this.moveRight();
      return;
    }

    if (inputHandler.isKeyPressed(S) && this.isDirection(Bottom)) {
      this.moveBakward();
      return;
    }

    if (inputHandler.isKeyPressed(A) && this.isDirection(Left)) {
      this.moveLeft();
      return;
    }

    this.direction = None;
  }

  private isDirection(direction: Direction): boolean {
    return this.direction === direction;
  }

  private moveForward(): void {
    this.posY -= this.speed;
    this.pointsMap.updateRectangleMap({
      x: null,
      y: this.posY,
      width: this.width,
      height: this.height,
    });
  }

  private moveRight(): void {
    this.posX += this.speed;
    this.pointsMap.updateRectangleMap({
      x: this.posX,
      y: null,
      width: this.width,
      height: this.height,
    });
  }

  private moveBakward(): void {
    this.posY += this.speed;
    this.pointsMap.updateRectangleMap({
      x: null,
      y: this.posY,
      width: this.width,
      height: this.height,
    });
  }

  private moveLeft(): void {
    this.posX -= this.speed;
    this.pointsMap.updateRectangleMap({
      x: this.posX,
      y: null,
      width: this.width,
      height: this.height,
    });
  }

  private handleHelpers(): void {
    const { inputHandler } = this.gameData;

    if (inputHandler.isKeyClicked(InputKey.X)) {
      this.isShowHelpers = !this.isShowHelpers;
    }
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.save();
    this.drawContent(context);
    context.restore();
  }

  public drawContent(context: CanvasRenderingContext2D): void {
    this.drawPlayer(context);

    if (this.isShowHelpers) {
      this.drawHelpers({
        context,
        isShowCorners: false,
        isShowCenters: false,
      });
    }
  }

  public drawPlayer(context: CanvasRenderingContext2D): void {
    const { topLeft } = this.pointsMap;

    context.fillStyle = colors.nord.green;
    context.fillRect(topLeft.x, topLeft.y, this.width, this.height);
  }

  private drawHelpers({
    context,
    isShowCorners,
    isShowCenters,
  }: {
    context: CanvasRenderingContext2D;
    isShowCorners?: boolean;
    isShowCenters?: boolean;
  }): void {
    context.fillStyle = colors.nord.red;

    this.drawCenterHelper(context);
    this.drawDirectionHelper(context);
    this.drawTextHelpers(context);

    if (isShowCorners) {
      this.drawCornersHelpers(context);
    }

    if (isShowCenters) {
      this.drawCenterHelpers(context);
    }
  }

  private drawTextHelpers(context: CanvasRenderingContext2D): void {
    const { topLeft } = this.pointsMap;
    context.font = "16px 'Yanone Kaffeesatz'";

    this.drawPositionHelpers(context, topLeft.x, topLeft.y);
    this.drawSpeedHelper(context);
  }

  private drawPositionHelpers(
    context: CanvasRenderingContext2D,
    x: number,
    y: number
  ): void {
    const { topCenter, topLeft, bottomLeft } = this.pointsMap;

    if (topCenter.y >= this.height) {
      context.fillText(`x: ${x}`, topLeft.x, topLeft.y - 50);
      context.fillText(`y: ${y}`, topLeft.x, topLeft.y - 30);

      return;
    }

    context.fillText(`x: ${x}`, bottomLeft.x, bottomLeft.y + 55);
    context.fillText(`y: ${y}`, bottomLeft.x, bottomLeft.y + 35);
  }

  private drawSpeedHelper(context: CanvasRenderingContext2D): void {
    const { topCenter, topLeft, bottomLeft } = this.pointsMap;

    if (topCenter.y >= this.height) {
      context.fillText(`Speed: ${this.speed}`, topLeft.x, topLeft.y - 10);
      return;
    }

    context.fillText(`Speed: ${this.speed}`, bottomLeft.x, bottomLeft.y + 15);
  }

  private drawCenterHelper(context: CanvasRenderingContext2D): void {
    const { center } = this.pointsMap;

    const width = 10;
    const height = 10;

    context.fillRect(center.x - width * 0.5, center.y - height * 0.5, 10, 10);
  }

  private drawCenterHelpers(context: CanvasRenderingContext2D): void {
    const { topCenter, rightCenter, bottomCenter, leftCenter } = this.pointsMap;

    const width = 10;
    const height = 10;

    //top center
    context.fillRect(topCenter.x - width * 0.5, topCenter.y, width, height);

    //right center
    context.fillRect(
      rightCenter.x - width,
      rightCenter.y - width * 0.5,
      width,
      height
    );

    //bottom center
    context.fillRect(
      bottomCenter.x - width * 0.5,
      bottomCenter.y - height,
      width,
      height
    );

    //left center
    context.fillRect(leftCenter.x, leftCenter.y - width * 0.5, width, height);
  }

  private drawCornersHelpers(context: CanvasRenderingContext2D): void {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.pointsMap;

    const width = 10;
    const height = 10;

    //top left
    context.fillRect(topLeft.x, topLeft.y, width, height);

    //top right
    context.fillRect(topRight.x - width, topRight.y, width, height);

    //bottom right
    context.fillRect(
      bottomRight.x - width,
      bottomRight.y - height,
      width,
      height
    );

    //bottom left
    context.fillRect(bottomLeft.x, bottomLeft.y - height, width, height);
  }

  private drawDirectionHelper(context: CanvasRenderingContext2D): void {
    const { Top, Right, Bottom, Left } = Direction;
    const { center, topCenter, rightCenter, bottomCenter, leftCenter } =
      this.pointsMap;

    context.strokeStyle = colors.nord.red;
    context.beginPath();

    context.moveTo(center.x, center.y);

    if (this.isDirection(Top)) {
      context.lineTo(topCenter.x, topCenter.y);
    }

    if (this.isDirection(Right)) {
      context.lineTo(rightCenter.x, rightCenter.y);
    }

    if (this.isDirection(Bottom)) {
      context.lineTo(bottomCenter.x, bottomCenter.y);
    }

    if (this.isDirection(Left)) {
      context.lineTo(leftCenter.x, leftCenter.y);
    }

    context.stroke();
  }
}
