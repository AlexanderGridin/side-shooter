import { PointsMap } from "./points-map.class";

class HelpersDrawingConfig {
  public isDrawCenter = false;
  public isDrawDirection = false;
  public isDrawCorners = false;
  public isDrawText = false;
  public isDrawEdgeCenters = false;
}

export class Helpers {
  private readonly gameObject!: { pointsMap: PointsMap };
  private readonly drawingConfig: HelpersDrawingConfig =
    new HelpersDrawingConfig();

  constructor({
    gameObject,
    drawingConfig,
  }: {
    gameObject: { pointsMap: PointsMap };
    drawingConfig: Partial<HelpersDrawingConfig>;
  }) {
    this.gameObject = gameObject;
    this.initDrawingConfig(drawingConfig);
  }

  private initDrawingConfig(config: Partial<HelpersDrawingConfig>): void {
    const configKeys = Object.keys(config);

    if (!configKeys.length) {
      return;
    }

    configKeys.forEach((key: string) => {
      this.drawingConfig[key as keyof HelpersDrawingConfig] =
        !!config[key as keyof HelpersDrawingConfig];
    });
  }

  public draw(): void {}
}
