import { Direction } from "../enumerations/direction.enum";
import { InputKey } from "../enumerations/input-key.enum";
import { colors } from "../static-data/colors";
import { canvas } from "./canvas.class";
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
  private isShowCornerHelpers = false;
  private isShowCenterHelpers = false;

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

  public draw(): void {
    this.drawPlayer();

    if (this.isShowHelpers) {
      this.drawHelpers({
        isShowCorners: this.isShowCornerHelpers,
        isShowCenters: this.isShowCornerHelpers,
      });
    }
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

  private drawHelpers({
    isShowCorners,
    isShowCenters,
  }: {
    isShowCorners?: boolean;
    isShowCenters?: boolean;
  }): void {
    this.drawCenterHelper();
    this.drawDirectionHelper();
    this.drawTextHelpers();

    if (isShowCorners) {
      this.drawCornersHelpers();
    }

    if (isShowCenters) {
      this.drawCenterHelpers();
    }
  }

  private drawTextHelpers(): void {
    const { topLeft } = this.pointsMap;

    this.drawPositionHelpers(topLeft.x, topLeft.y);
    this.drawSpeedHelper();
  }

  private drawPositionHelpers(x: number, y: number): void {
    const { topCenter, topLeft, bottomLeft } = this.pointsMap;

    if (topCenter.y >= this.height) {
      canvas.drawText({
        text: `x: ${x}`,
        position: {
          x: topLeft.x,
          y: topLeft.y - 50,
        },
        fontSize: 16,
        fontFamily: "Yanone Kaffeesatz",
        color: colors.nord.red,
      });

      canvas.drawText({
        text: `y: ${y}`,
        position: {
          x: topLeft.x,
          y: topLeft.y - 30,
        },
        fontSize: 16,
        fontFamily: "Yanone Kaffeesatz",
        color: colors.nord.red,
      });

      return;
    }

    canvas.drawText({
      text: `x: ${x}`,
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y + 50,
      },
      fontSize: 16,
      fontFamily: "Yanone Kaffeesatz",
      color: colors.nord.red,
    });

    canvas.drawText({
      text: `y: ${y}`,
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y + 35,
      },
      fontSize: 16,
      fontFamily: "Yanone Kaffeesatz",
      color: colors.nord.red,
    });
  }

  private drawSpeedHelper(): void {
    const { topCenter, topLeft, bottomLeft } = this.pointsMap;

    if (topCenter.y >= this.height) {
      canvas.drawText({
        text: `Speed: ${this.speed}`,
        position: {
          x: topLeft.x,
          y: topLeft.y - 10,
        },
        fontSize: 16,
        fontFamily: "Yanone Kaffeesatz",
        color: colors.nord.red,
      });
      return;
    }

    canvas.drawText({
      text: `Speed: ${this.speed}`,
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y + 15,
      },
      fontSize: 16,
      fontFamily: "Yanone Kaffeesatz",
      color: colors.nord.red,
    });
  }

  private drawCenterHelper(): void {
    const { center } = this.pointsMap;

    const width = 10;
    const height = 10;

    canvas.drawRectangle({
      position: {
        x: center.x - width * 0.5,
        y: center.y - height * 0.5,
      },
      width: 10,
      height: 10,
      color: colors.nord.red,
    });
  }

  private drawCenterHelpers(): void {
    const { topCenter, rightCenter, bottomCenter, leftCenter } = this.pointsMap;

    const width = 10;
    const height = 10;

    //top center
    canvas.drawRectangle({
      position: {
        x: topCenter.x - width * 0.5,
        y: topCenter.y,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //right center
    canvas.drawRectangle({
      position: {
        x: rightCenter.x - width,
        y: rightCenter.y - height * 0.5,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //bottom center
    canvas.drawRectangle({
      position: {
        x: bottomCenter.x - width * 0.5,
        y: bottomCenter.y - height,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //left center
    canvas.drawRectangle({
      position: {
        x: leftCenter.x,
        y: leftCenter.y - height * 0.5,
      },
      width,
      height,
      color: colors.nord.red,
    });
  }

  private drawCornersHelpers(): void {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.pointsMap;

    const width = 10;
    const height = 10;

    //top left
    canvas.drawRectangle({
      position: {
        x: topLeft.x,
        y: topLeft.y,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //top right
    canvas.drawRectangle({
      position: {
        x: topRight.x - width,
        y: topRight.y,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //bottom right
    canvas.drawRectangle({
      position: {
        x: bottomRight.x - width,
        y: bottomRight.y - height,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //bottom left
    canvas.drawRectangle({
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y - height,
      },
      width,
      height,
      color: colors.nord.red,
    });
  }

  private drawDirectionHelper(): void {
    const { Top, Right, Bottom, Left } = Direction;
    const { center, topCenter, rightCenter, bottomCenter, leftCenter } =
      this.pointsMap;

    if (this.isDirection(Top)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: topCenter.x,
          y: topCenter.y,
        },
        color: colors.nord.red,
      });
      return;
    }

    if (this.isDirection(Right)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: rightCenter.x,
          y: rightCenter.y,
        },
        color: colors.nord.red,
      });
      return;
    }

    if (this.isDirection(Bottom)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: bottomCenter.x,
          y: bottomCenter.y,
        },
        color: colors.nord.red,
      });
      return;
    }

    if (this.isDirection(Left)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: leftCenter.x,
          y: leftCenter.y,
        },
        color: colors.nord.red,
      });
    }
  }
}
