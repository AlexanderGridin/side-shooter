import { Direction } from "../enumerations/direction.enum";
import { InputKey } from "../enumerations/input-key.enum";
import { colors } from "../static-data/colors";
import { canvas } from "./canvas.class";
import { GameObject } from "./game-object.class";
import { Helpers } from "./helpers.class";
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

  private readonly helpers!: Helpers<Player>;

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

    this.helpers = new Helpers<Player>({
      gameObject: this,
      drawingConfig: {
        isDrawText: true,
        isDrawCenter: true,
        isDrawDirection: true,
      },
    });
    this.helpers.enable();
  }

  public update(gameData: SharedGameData): void {
    this.gameData = gameData;
    this.collisionData = this.getCanvasCollisionData();

    this.handleWorldCollision();
    this.detectDirection();
    this.calculateMovement();
    this.handleHelpers();
  }

  private getCanvasCollisionData(): CollisionData {
    const { width, height } = canvas;
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
    const { width } = canvas;
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
    const { height } = canvas;
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

  public isDirection(direction: Direction): boolean {
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
      this.helpers.toggle();
    }
  }

  public draw(): void {
    this.drawPlayer();
    this.helpers.draw();
  }

  public drawPlayer(): void {
    const { topLeft } = this.pointsMap;

    canvas.drawRectangle({
      position: {
        x: topLeft.x,
        y: topLeft.y,
      },
      width: this.width,
      height: this.height,
      color: colors.nord.green,
    });
  }
}
