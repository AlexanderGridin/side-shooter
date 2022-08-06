import { Canvas } from "./canvas.class";
import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";

export class Game {
  private readonly canvas!: Canvas;
  private readonly data: SharedGameData = new SharedGameData();

  private gameObjects: Array<GameObject> = [];
  private prevTimeStamp = 0;
  private deltaTime = 0;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.initSharedData();
  }

  private initSharedData(): void {
    this.data.geometry.width = this.canvas.width;
    this.data.geometry.height = this.canvas.height;
    this.data.gameObjects = this.gameObjects;
  }

  public start(timestamp = 0): void {
    this.handleTimeStamp(timestamp);
    this.update();
    this.clear();
    this.draw();

    requestAnimationFrame(this.start.bind(this));
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
  }

  public addObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
    this.data.gameObjects = this.gameObjects;
  }

  public addObjects(gameObjects: Array<GameObject>): void {
    this.gameObjects = this.gameObjects.concat(gameObjects);
    this.data.gameObjects = this.gameObjects;
  }
}
