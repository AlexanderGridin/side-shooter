import { Canvas } from "./canvas.class";
import { GameObject } from "./game-object.class";

export class SharedGameData {
  public geometry: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  public gameObjects: Array<GameObject> = [];
}

export class Game {
  private readonly canvas!: Canvas;
  private readonly gameObjects: Array<GameObject> = [];
  private readonly data: SharedGameData = new SharedGameData();

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.initSharedData();
  }

  private initSharedData(): void {
    this.data.geometry.width = this.canvas.width;
    this.data.geometry.height = this.canvas.height;
    this.data.gameObjects = this.gameObjects;
  }

  public start(): void {
    this.update();
    this.clear();
    this.draw();

    requestAnimationFrame(this.start.bind(this));
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

  public addEntity(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
    this.data.gameObjects = this.gameObjects;
  }
}
