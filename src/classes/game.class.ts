import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";
import { Player } from "./player.class";
import { FpsCounter } from "./fps-counter.class";
import { InputKey } from "../enumerations/input-key.enum";
import { Grid } from "./grid.class";
import { colors } from "../static-data/colors";
import { canvas } from "./canvas.class";
import { inputHandler } from "./input-handler.class";

export class Game {
  private readonly data: SharedGameData = new SharedGameData();

  private gameObjects: Array<GameObject> = [];
  private prevTimeStamp = 0;
  private deltaTime = 0;

  private animationRequest!: number;
  private isGameStarted = false;
  private isDrawHelpers = true;
  private isWasFirstStart = false;

  constructor() {
    this.initSharedData();
    this.setupGameObjects();
    this.update();
    this.draw();

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === InputKey.J && !this.isGameStarted) {
        this.isGameStarted = true;

        document.body.style.border = `5px solid ${colors.nord.green}`;
        document.body.style.backgroundColor = `${colors.nord.green}`;

        if (!this.isWasFirstStart) {
          this.isWasFirstStart = true;
          this.start();

          return;
        }

        this.requestFrame();
        return;
      }

      if (e.code === InputKey.J && this.isGameStarted) {
        this.isGameStarted = false;

        document.body.style.border = `5px solid ${colors.nord.lightGray}`;
        document.body.style.backgroundColor = `${colors.nord.darkGray}`;

        return;
      }
    });
  }

  private initSharedData(): void {
    this.data.gameObjects = this.gameObjects;
  }

  public start(): void {
    this.requestFrame();
  }

  private setupGameObjects(): void {
    this.clearObjects();

    this.addObject(new Grid());
    this.addObject(new Player(canvas.centerPoint.x, canvas.centerPoint.y));
    // this.addObject(new Player(canvas.center.x + 64 * 2, canvas.center.y));
    // this.addObject(new Player(canvas.center.x + 64 * 4, canvas.center.y));
    // this.addObject(new Player(canvas.center.x - 64 * 2, canvas.center.y));
    // this.addObject(new Player(canvas.center.x - 64 * 4, canvas.center.y));
    this.addObject(new FpsCounter());
  }

  private requestFrame(timestamp = 0): void {
    this.handleTimeStamp(timestamp);

    this.clear();
    this.update();
    this.draw();

    if (this.isGameStarted) {
      this.animationRequest = requestAnimationFrame(
        this.requestFrame.bind(this)
      );
    }
  }

  public stop(): void {
    cancelAnimationFrame(this.animationRequest);
  }

  private handleTimeStamp(timestamp: number): void {
    const newDeltaTime = timestamp - this.prevTimeStamp;

    if (Math.ceil(this.deltaTime) !== Math.ceil(newDeltaTime)) {
      console.log(newDeltaTime);
    }

    this.deltaTime = newDeltaTime;
    this.prevTimeStamp = timestamp;
    this.data.deltaTime = this.deltaTime;
  }

  private clear(): void {
    canvas.clear();
  }

  public update(): void {
    inputHandler.update();

    this.gameObjects.forEach((gameObject: GameObject) =>
      gameObject.update(this.data)
    );
  }

  public draw(): void {
    this.gameObjects.forEach((gameObject: GameObject) => gameObject.draw());

    if (this.isDrawHelpers) {
      this.drawHelpers();
    }
  }

  private drawHelpers(): void {
    canvas.drawLine({
      start: {
        x: canvas.centerPoint.x,
        y: 0,
      },
      end: {
        x: canvas.centerPoint.x,
        y: canvas.height,
      },
      color: colors.nord.red,
    });

    canvas.drawLine({
      start: {
        x: 0,
        y: canvas.centerPoint.y,
      },
      end: {
        x: canvas.width,
        y: canvas.centerPoint.y,
      },
      color: colors.nord.red,
    });
  }

  public addObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
    this.data.gameObjects = this.gameObjects;
  }

  public addObjects(gameObjects: Array<GameObject>): this {
    this.gameObjects = this.gameObjects.concat(gameObjects);
    this.data.gameObjects = this.gameObjects;

    return this;
  }

  public clearObjects(): void {
    this.gameObjects = [];
    this.data.gameObjects = this.gameObjects;
  }
}
