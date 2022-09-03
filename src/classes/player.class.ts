import { InputKey } from "../enumerations/input-key.enum";
import { colors } from "../static-data/colors";
import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";

interface CollisionData {
  topCollision: boolean;
  rightCollision: boolean;
  bottomCollision: boolean;
  leftCollision: boolean;
}

type Direction = "top" | "right" | "bottom" | "left" | "none";

export class Player extends GameObject {
  public readonly width = 64;
  public readonly height = 64;

  private initialSpeed = 5;
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

    const targetYBottom = Math.round(this.posY + this.initialSpeed);
    const targetYTop = Math.round(this.posY - this.initialSpeed);

    const targetXRight = Math.round(this.posX + this.initialSpeed);
    const targetXLeft = Math.round(this.posX - this.initialSpeed);

    return {
      topCollision: targetYTop <= this.height * 0.5,
      rightCollision: Math.round(targetXRight + this.width * 0.5) >= width,
      bottomCollision: Math.round(targetYBottom + this.height * 0.5) >= height,
      leftCollision: Math.round(targetXLeft - this.width * 0.5) <= 0,
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
    const posYWithOffset = Math.round(this.posY - this.height * 0.5);

    if (posYWithOffset === this.initialSpeed) {
      return;
    }

    if (posYWithOffset - this.initialSpeed < 0) {
      this.speed =
        this.initialSpeed - Math.abs(posYWithOffset - this.initialSpeed);
      return;
    }

    this.speed = 0;
  }

  private handleRightWorldCollision(): void {
    const posXWithOffset = Math.round(this.posX + this.width * 0.5);
    const { width } = this.gameData.geometry;

    if (width - posXWithOffset === this.initialSpeed) {
      return;
    }

    if (posXWithOffset + this.initialSpeed > width) {
      this.speed =
        this.initialSpeed - (posXWithOffset + this.initialSpeed - width);
      return;
    }

    this.speed = 0;
  }

  private handleBottomWorldCollision(): void {
    const posYWithOffset = Math.round(this.posY + this.height * 0.5);
    const { height } = this.gameData.geometry;

    if (height - posYWithOffset === this.initialSpeed) {
      return;
    }

    if (posYWithOffset + this.initialSpeed > height) {
      this.speed =
        this.initialSpeed - (posYWithOffset + this.initialSpeed - height);
      return;
    }

    this.speed = 0;
  }

  private handleLeftWorldCollision(): void {
    const posXWithOffset = Math.round(this.posX - this.width * 0.5);

    if (posXWithOffset === this.initialSpeed) {
      return;
    }

    if (posXWithOffset - this.initialSpeed < 0) {
      this.speed =
        this.initialSpeed - Math.abs(posXWithOffset - this.initialSpeed);
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

    if (inputHandler.isKeyClicked(W)) {
      this.direction = "top";
      return;
    }

    if (inputHandler.isKeyClicked(S)) {
      this.direction = "bottom";
      return;
    }

    if (inputHandler.isKeyClicked(D)) {
      this.direction = "right";
      return;
    }

    if (inputHandler.isKeyClicked(A)) {
      this.direction = "left";
      return;
    }
  }

  private calculateMovement(): void {
    const { inputHandler } = this.gameData;
    const { W, S, A, D } = InputKey;

    if (inputHandler.isKeyPressed(W) && this.direction === "top") {
      this.moveForward();
      return;
    }

    if (inputHandler.isKeyPressed(D) && this.direction === "right") {
      this.moveRight();
      return;
    }

    if (inputHandler.isKeyPressed(S) && this.direction === "bottom") {
      this.moveBakward();
      return;
    }

    if (inputHandler.isKeyPressed(A) && this.direction === "left") {
      this.moveLeft();
      return;
    }

    this.direction = "none";
  }

  private moveForward(): void {
    this.posY -= this.speed;
  }

  private moveRight(): void {
    this.posX += this.speed;
  }

  private moveBakward(): void {
    this.posY += this.speed;
  }

  private moveLeft(): void {
    this.posX -= this.speed;
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

    if (this.posY >= 100) {
      context.fillText(
        `x: ${Math.round(this.posX) - Math.round(this.width * 0.5)}`,
        this.posX - this.width * 0.5,
        this.posY - this.height * 0.5 - 50
      );
      context.fillText(
        `y: ${Math.round(this.posY - this.height * 0.5)}`,
        this.posX - this.width * 0.5,
        this.posY - this.height * 0.5 - 30
      );

      context.fillText(
        `Speed: ${this.speed}`,
        this.posX - this.width * 0.5,
        this.posY - this.height * 0.5 - 10
      );

      return;
    }

    context.fillText(
      `x: ${Math.round(this.posX) - Math.round(this.width * 0.5)}`,
      this.posX - this.width * 0.5,
      this.posY + this.height * 0.5 + 55
    );
    context.fillText(
      `y: ${Math.round(this.posY - this.height * 0.5)}`,
      this.posX - this.width * 0.5,
      this.posY + this.height * 0.5 + 35
    );

    context.fillText(
      `Speed: ${this.speed}`,
      this.posX - this.width * 0.5,
      this.posY + this.height * 0.5 + 15
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
