import { Canvas } from "./canvas.class";
import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";
import { InputHandler } from "./input-handler.class";

export class Game {
  private readonly canvas!: Canvas;
  private readonly data: SharedGameData = new SharedGameData();
  private readonly inputHandler!: InputHandler;

  private gameObjects: Array<GameObject> = [];
  private prevTimeStamp = 0;
  private deltaTime = 0;

  private animationRequest!: number;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.inputHandler = new InputHandler();

    this.initSharedData();
  }

  private initSharedData(): void {
    this.data.geometry.width = this.canvas.width;
    this.data.geometry.height = this.canvas.height;
    this.data.gameObjects = this.gameObjects;
    this.data.inputHandler = this.inputHandler;
  }

  public start(timestamp = 0): void {
    this.handleTimeStamp(timestamp);
    this.update();
    this.clear();
    this.draw();

    this.animationRequest = requestAnimationFrame(this.start.bind(this));
  }

  public stop(): void {
    cancelAnimationFrame(this.animationRequest);
  }

  private handleTimeStamp(timestamp: number): void {
    this.deltaTime = timestamp - this.prevTimeStamp;
    this.prevTimeStamp = timestamp;
    this.data.deltaTime = this.deltaTime;
  }

  private clear(): void {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private update(): void {
    this.gameObjects.forEach((gameObject: GameObject) =>
      gameObject.update(this.data)
    );
  }

  private draw(): void {
    this.gameObjects.forEach((gameObject: GameObject) =>
      gameObject.draw(this.canvas.context)
    );

    this.drawHelpers();
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
}
