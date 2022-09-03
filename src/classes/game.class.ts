import { Canvas } from "./canvas.class";
import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";
import { InputHandler } from "./input-handler.class";
import { Player } from "./player.class";
import { FpsCounter } from "./fps-counter.class";
import { InputKey } from "../enumerations/input-key.enum";
import { Grid } from "./grid.class";
import { colors } from "../static-data/colors";

export class Game {
  private readonly canvas!: Canvas;
  private readonly data: SharedGameData = new SharedGameData();
  private readonly inputHandler!: InputHandler;

  private gameObjects: Array<GameObject> = [];
  private prevTimeStamp = 0;
  private deltaTime = 0;

  private animationRequest!: number;
  private isGameStarted = false;
  private isDrawHelpers = false;
  private isWasFirstStart = false;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.inputHandler = new InputHandler();

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
    this.data.geometry.width = this.canvas.width;
    this.data.geometry.height = this.canvas.height;
    this.data.gameObjects = this.gameObjects;
    this.data.inputHandler = this.inputHandler;
  }

  public start(): void {
    this.requestFrame();
  }

  private setupGameObjects(): void {
    this.clearObjects();

    this.addObject(new Grid(this.canvas));
    this.addObject(
      new Player(this.canvas.width * 0.5, this.canvas.height * 0.5)
    );
    this.addObject(new FpsCounter());
  }

  private requestFrame(timestamp = 0): void {
    this.handleTimeStamp(timestamp);
    this.update();
    this.clear();
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
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public update(): void {
    this.inputHandler.update();

    this.gameObjects.forEach((gameObject: GameObject) =>
      gameObject.update(this.data)
    );
  }

  public draw(): void {
    this.gameObjects.forEach((gameObject: GameObject) =>
      gameObject.draw(this.canvas.context)
    );

    if (this.isDrawHelpers) {
      this.drawHelpers();
    }
  }

  private drawHelpers(): void {
    this.canvas.context.save();

    this.canvas.context.lineWidth = 1;
    this.canvas.context.strokeStyle = "#BF616A";

    this.canvas.context.beginPath();
    this.canvas.context.moveTo(this.canvas.width * 0.5, 0);
    this.canvas.context.lineTo(this.canvas.width * 0.5, this.canvas.height);
    this.canvas.context.stroke();

    this.canvas.context.beginPath();
    this.canvas.context.moveTo(0, this.canvas.height * 0.5);
    this.canvas.context.lineTo(this.canvas.width, this.canvas.height * 0.5);
    this.canvas.context.stroke();

    this.canvas.context.restore();
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
