import { Direction } from "../enumerations/direction.enum";
import { InputKey } from "../enumerations/input-key.enum";
import { colors } from "../static-data/colors";
import { canvas } from "./canvas.class";
import { GameObject } from "./game-object.class";
import { Helpers } from "./helpers.class";
import { PointsMap } from "./points-map.class";
import { inputHandler } from "./input-handler.class";

export class Player extends GameObject {
  public readonly width = 64;
  public readonly height = 128;

  public speed = 5;

  private readonly weight = 5;
  private readonly gravity = 0.9;

  private isOnTheGround = false;
  private isInTheJump = false;
  private isFirstUpdate = true;

  public posX!: number;
  public posY!: number;
  public pointsMap = new PointsMap<Player>(this);
  public direction!: Direction;

  private readonly helpers!: Helpers<Player>;

  constructor(posX: number, posY: number) {
    super();

    this.posX = posX;
    this.posY = posY;

    this.pointsMap.initForRectangle(this);

    this.helpers = new Helpers<Player>({
      gameObject: this,
      drawingConfig: {
        isDrawText: true,
        isDrawCenter: true,
        isDrawDirection: true,
        isDrawCorners: true,
        isDrawEdgeCenters: true,
      },
    });
    this.helpers.enable();
  }

  public update(): void {
    if (this.isFirstUpdate) {
      this.isFirstUpdate = false;
      return;
    }

    this.detectDirection();
    this.calculateMovement();
    this.handleHelpers();
  }

  private detectDirection(): void {
    const { A, D } = InputKey;
    const { Right, Left } = Direction;

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
    const { A, D, W } = InputKey;
    const { Right, Left, None } = Direction;

    if (!this.isOnTheGround && !this.isInTheJump) {
      this.moveDown();
    }

    if (
      inputHandler.isKeyClicked(W) &&
      !this.isInTheJump &&
      this.isOnTheGround
    ) {
      this.startJump();
    }

    if (this.isInTheJump) {
      this.jump();
    }

    if (inputHandler.isKeyPressed(D) && this.isDirection(Right)) {
      this.moveRight();
      return;
    }

    if (inputHandler.isKeyPressed(A) && this.isDirection(Left)) {
      this.moveLeft();
      return;
    }

    this.direction = None;
  }

  private moveDown(): void {
    const offset = Math.ceil(this.weight * this.gravity);

    if (this.pointsMap.bottomCenter.y + offset >= canvas.height) {
      this.posY = canvas.height - Math.ceil(this.height / 2);
      this.pointsMap.updateRectangleMap();

      this.isOnTheGround = true;
    } else {
      this.posY += offset;
      this.pointsMap.updateRectangleMap();
    }
  }

  private startJump(): void {
    this.isInTheJump = true;
    this.isOnTheGround = false;
  }

  private jump(): void {
    const jumpSpeed = 10;
    const jumpHeight = 150;

    const topLimit = canvas.height - this.height - jumpHeight;
    const offset = this.pointsMap.topCenter.y - jumpSpeed;

    if (offset <= topLimit) {
      this.isInTheJump = false;
    }

    this.posY -= jumpSpeed;
    this.pointsMap.updateRectangleMap();
  }

  public isDirection(direction: Direction): boolean {
    return this.direction === direction;
  }

  private moveRight(): void {
    if (this.pointsMap.rightCenter.x + this.speed >= canvas.width) {
      this.posX = canvas.width - Math.ceil(this.width / 2);
      this.pointsMap.updateRectangleMap();
      return;
    }

    this.posX += this.speed;
    this.pointsMap.updateRectangleMap();
  }

  private moveLeft(): void {
    if (this.pointsMap.leftCenter.x - this.speed <= 0) {
      this.posX = 0 + Math.ceil(this.width / 2);
      this.pointsMap.updateRectangleMap();
      return;
    }

    this.posX -= this.speed;
    this.pointsMap.updateRectangleMap();
  }

  private handleHelpers(): void {
    if (inputHandler.isKeyClicked(InputKey.X)) {
      this.helpers.toggle();
    }
  }

  public draw(): void {
    this.drawSelf();
    this.helpers.draw();
  }

  public drawSelf(): void {
    const { topLeft } = this.pointsMap;

    canvas.drawRectangle({
      position: {
        x: topLeft.x,
        y: topLeft.y,
      },
      width: this.width,
      height: this.height,
      color: colors.nord.yellow,
    });
  }
}
