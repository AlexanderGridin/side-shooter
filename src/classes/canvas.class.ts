export class Canvas {
  public readonly element!: HTMLCanvasElement;
  public readonly context!: CanvasRenderingContext2D;

  constructor({
    selector,
    width,
    height,
  }: {
    selector: string;
    width?: number;
    height?: number;
  }) {
    const element: HTMLCanvasElement | null =
      document.querySelector<HTMLCanvasElement>(selector);
    if (!element) {
      console.error("Canvas element not found!");
      return;
    }

    this.element = element;

    const context: CanvasRenderingContext2D | null =
      this.element.getContext("2d") || null;
    if (!context) {
      console.error("Canvas rendering context not found!");
      return;
    }

    this.context = context;

    // TODO: need to clarify why need 20 as correction
    this.element.width = width || window.innerWidth - 20;
    this.element.height = height || window.innerHeight - 20;
  }

  public get width(): number {
    if (!this.element) {
      console.error("Canvas element don't exist!");
      return 0;
    }

    return this.element.width;
  }

  public get height(): number {
    if (!this.element) {
      console.error("Canvas element don't exist!");
      return 0;
    }

    return this.element.height;
  }
}
