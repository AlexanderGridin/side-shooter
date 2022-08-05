import { Canvas } from "./canvas.class";
import { Entity } from "./entity.class";

export class SharedGameData {
  public geometry: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  public entities: Array<Entity> = [];
}

export class Game {
  private readonly canvas!: Canvas;
  private readonly entities: Array<Entity> = [];
  private readonly data: SharedGameData = new SharedGameData();

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.initSharedData();
  }

  private initSharedData(): void {
    this.data.geometry.width = this.canvas.width;
    this.data.geometry.height = this.canvas.height;
    this.data.entities = this.entities;
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
    this.entities.forEach((entity) => entity.update(this.data));
  }

  private draw(): void {
    this.entities.forEach((entity) => entity.draw(this.canvas.context));
  }

  public addEntity(entity: Entity): void {
    this.entities.push(entity);
    this.data.entities = this.entities;
  }
}
