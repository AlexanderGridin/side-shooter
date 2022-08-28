import { InputKey } from "../enumerations/input-key.enum";
import { colors } from "../static-data/colors";
import { Canvas } from "./canvas.class";
import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";

interface CollisionData {
  xCollision: boolean;
  yCollision: boolean;

  topCollision: boolean;
  rightCollision: boolean;
  bottomCollision: boolean;
  leftCollision: boolean;
}

type Direction = "top" | "right" | "bottom" | "left" | "none";

export class Player extends GameObject {
  public readonly width = 64;
  public readonly height = 64;

  private initialSpeed = 3;
  public speed = this.initialSpeed;

  public posX!: number;
  public posY!: number;
  public direction!: Direction;

  private collisionData!: CollisionData;
  private gameData!: SharedGameData;

  private isShowHelpers = true;

  constructor(posX: number, posY: number) {
    super();

    this.posX = posX;
    this.posY = posY;
  }

  public update(gameData: SharedGameData): void {
    this.collisionData = this.getCollisionData(gameData.geometry);
    this.gameData = gameData;

    this.handleHelpers();
    this.handleWorldCollision();
    this.detectDirection();
    this.calculateMovement();
  }

  private handleHelpers(): void {
    const { inputHandler } = this.gameData;

    if (inputHandler.isKeyPressed(InputKey.X)) {
      this.isShowHelpers = true;
    }

    if (inputHandler.isKeyPressed(InputKey.C)) {
      this.isShowHelpers = false;
    }
  }

  private detectDirection(): void {
    const { inputHandler } = this.gameData;

    if (inputHandler.isKeyClicked(InputKey.W)) {
      this.direction = "top";
      return;
    }

    if (inputHandler.isKeyClicked(InputKey.S)) {
      this.direction = "bottom";
      return;
    }

    if (inputHandler.isKeyClicked(InputKey.D)) {
      this.direction = "right";
      return;
    }

    if (inputHandler.isKeyClicked(InputKey.A)) {
      this.direction = "left";
      return;
    }
  }

  private calculateMovement(): void {
    const { inputHandler } = this.gameData;

    if (inputHandler.isKeyPressed(InputKey.W) && this.direction === "top") {
      this.moveForward();
      return;
    }

    if (inputHandler.isKeyPressed(InputKey.S) && this.direction === "bottom") {
      this.moveBakward();
      return;
    }

    if (inputHandler.isKeyPressed(InputKey.A) && this.direction === "left") {
      this.moveLeft();
      return;
    }

    if (inputHandler.isKeyPressed(InputKey.D) && this.direction === "right") {
      this.moveRight();
      return;
    }

    this.direction = "none";
  }

  private moveForward(): void {
    this.posY -= this.speed;
  }

  private moveBakward(): void {
    this.posY += this.speed;
  }

  private moveRight(): void {
    this.posX += this.speed;
  }

  private moveLeft(): void {
    this.posX -= this.speed;
  }

  private handleWorldCollision(): void {
    const { topCollision, rightCollision, bottomCollision, leftCollision } =
      this.collisionData;
    const { inputHandler } = this.gameData;

    if (
      (topCollision && inputHandler.isKeyPressed(InputKey.W)) ||
      (rightCollision && inputHandler.isKeyPressed(InputKey.D)) ||
      (bottomCollision && inputHandler.isKeyPressed(InputKey.S)) ||
      (leftCollision && inputHandler.isKeyPressed(InputKey.A))
    ) {
      this.speed = 0;
    } else {
      this.speed = this.initialSpeed;
    }
  }

  private getCollisionData(gameGeometry: {
    width: number;
    height: number;
  }): CollisionData {
    return {
      xCollision:
        this.posX - this.speed < this.width * 0.5 ||
        this.posX + this.speed + this.width * 0.5 > gameGeometry.width,
      yCollision:
        this.posY - this.speed < this.height * 0.5 ||
        this.posY + this.speed + this.height * 0.5 > gameGeometry.height,

      topCollision: this.posY - this.speed < this.height * 0.5,
      rightCollision:
        this.posX + this.speed + this.width * 0.5 > gameGeometry.width,
      bottomCollision:
        this.posY + this.speed + this.height * 0.5 > gameGeometry.height,
      leftCollision: this.posX - this.speed < this.width * 0.5,
    };
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
      });
    }
  }

  public drawPlayer(context: CanvasRenderingContext2D): void {
    context.fillStyle = colors.nord.green;
    context.fillRect(
      this.posX - this.width * 0.5,
      this.posY - this.height * 0.5,
      this.width,
      this.height
    );
  }

  private drawHelpers({
    context,
    isShowCorners,
  }: {
    context: CanvasRenderingContext2D;
    isShowCorners?: boolean;
  }): void {
    context.fillStyle = colors.nord.red;

    this.drawCenterHelper(context);
    this.drawDirectionHelper(context);
    this.drawTextHelpers(context);

    if (isShowCorners) {
      this.drawCornersHelpers(context);
    }
  }

  private drawTextHelpers(context: CanvasRenderingContext2D): void {
    context.font = "16px 'Yanone Kaffeesatz'";
    context.fillText(
      `x: ${this.posX.toFixed(0)}`,
      this.posX - this.width * 0.5,
      this.posY - this.height * 0.5 - 50
    );
    context.fillText(
      `y: ${this.posY.toFixed(0)}`,
      this.posX - this.width * 0.5,
      this.posY - this.height * 0.5 - 30
    );

    context.fillText(
      `Speed: ${this.speed}`,
      this.posX - this.width * 0.5,
      this.posY - this.height * 0.5 - 10
    );
  }

  private drawCenterHelper(context: CanvasRenderingContext2D): void {
    const width = 10;
    const height = 10;

    context.fillRect(this.posX - width * 0.5, this.posY - height * 0.5, 10, 10);
  }

  private drawCornersHelpers(context: CanvasRenderingContext2D): void {
    const width = 10;
    const height = 10;

    //top left
    context.fillRect(
      this.posX - this.width * 0.5,
      this.posY - this.height * 0.5,
      width,
      height
    );

    //top right
    context.fillRect(
      this.posX + this.width * 0.5 - width,
      this.posY - this.height * 0.5,
      width,
      height
    );

    //bottom right
    context.fillRect(
      this.posX + this.width * 0.5 - width,
      this.posY + this.height * 0.5 - height,
      width,
      height
    );

    //bottom left
    context.fillRect(
      this.posX - this.width * 0.5,
      this.posY + this.height * 0.5 - height,
      width,
      height
    );
  }

  private drawDirectionHelper(context: CanvasRenderingContext2D): void {
    context.strokeStyle = colors.nord.red;
    context.beginPath();

    context.moveTo(this.posX, this.posY);

    if (this.direction === "top") {
      context.lineTo(this.posX, this.posY - this.width * 0.5);
    }

    if (this.direction === "right") {
      context.lineTo(this.posX + this.width * 0.5, this.posY);
    }

    if (this.direction === "bottom") {
      context.lineTo(this.posX, this.posY + this.width * 0.5);
    }

    if (this.direction === "left") {
      context.lineTo(this.posX - this.width * 0.5, this.posY);
    }

    context.stroke();
  }
}
