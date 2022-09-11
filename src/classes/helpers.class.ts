import { PointsMap } from "./points-map.class";
import { canvas } from "./canvas.class";
import { colors } from "../static-data/colors";
import { Direction } from "../enumerations/direction.enum";

class HelpersDrawingConfig {
  public isDrawCenter = false;
  public isDrawDirection = false;
  public isDrawCorners = false;
  public isDrawText = false;
  public isDrawEdgeCenters = false;
}

interface ExpectedGameObject {
  pointsMap: PointsMap;
  width: number;
  height: number;
  speed: number;
  isDirection: (direction: Direction) => boolean;
}

export class Helpers<GameObjectType extends ExpectedGameObject> {
  private isDisabled = true;

  private readonly markerWidth = 5;
  private readonly markerHeight = 5;

  private readonly gameObject!: GameObjectType;
  private readonly drawingConfig: HelpersDrawingConfig =
    new HelpersDrawingConfig();

  constructor({
    gameObject,
    drawingConfig,
  }: {
    gameObject: GameObjectType;
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

  public draw(): void {
    if (this.isDisabled) {
      return;
    }

    const {
      isDrawCenter,
      isDrawDirection,
      isDrawText,
      isDrawCorners,
      isDrawEdgeCenters,
    } = this.drawingConfig;

    if (isDrawText) {
      this.drawText();
    }

    if (isDrawCenter) {
      this.drawCenter();
    }

    if (isDrawEdgeCenters) {
      this.drawEdgeCenters();
    }

    if (isDrawCorners) {
      this.drawCorners();
    }

    if (isDrawDirection) {
      this.drawDirection();
    }
  }

  private drawText(): void {
    const { topLeft } = this.gameObject.pointsMap;

    this.drawPosition(topLeft.x, topLeft.y);
    this.drawSpeed();
  }

  private drawPosition(x: number, y: number): void {
    const { height } = this.gameObject;
    const { topCenter, topLeft, bottomLeft } = this.gameObject.pointsMap;

    if (topCenter.y >= height) {
      canvas.drawText({
        text: `x: ${x}`,
        position: {
          x: topLeft.x,
          y: topLeft.y - 50,
        },
        fontSize: 16,
        fontFamily: "Yanone Kaffeesatz",
        color: colors.nord.red,
      });

      canvas.drawText({
        text: `y: ${y}`,
        position: {
          x: topLeft.x,
          y: topLeft.y - 30,
        },
        fontSize: 16,
        fontFamily: "Yanone Kaffeesatz",
        color: colors.nord.red,
      });

      return;
    }

    canvas.drawText({
      text: `x: ${x}`,
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y + 50,
      },
      fontSize: 16,
      fontFamily: "Yanone Kaffeesatz",
      color: colors.nord.red,
    });

    canvas.drawText({
      text: `y: ${y}`,
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y + 35,
      },
      fontSize: 16,
      fontFamily: "Yanone Kaffeesatz",
      color: colors.nord.red,
    });
  }

  private drawSpeed(): void {
    const { height, speed } = this.gameObject;
    const { topCenter, topLeft, bottomLeft } = this.gameObject.pointsMap;

    if (topCenter.y >= height) {
      canvas.drawText({
        text: `Speed: ${speed}`,
        position: {
          x: topLeft.x,
          y: topLeft.y - 10,
        },
        fontSize: 16,
        fontFamily: "Yanone Kaffeesatz",
        color: colors.nord.red,
      });
      return;
    }

    canvas.drawText({
      text: `Speed: ${speed}`,
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y + 15,
      },
      fontSize: 16,
      fontFamily: "Yanone Kaffeesatz",
      color: colors.nord.red,
    });
  }

  private drawCenter(): void {
    const { center } = this.gameObject.pointsMap;

    const width = this.markerWidth;
    const height = this.markerHeight;

    canvas.drawRectangle({
      position: {
        x: center.x - width * 0.5,
        y: center.y - height * 0.5,
      },
      width,
      height,
      color: colors.nord.red,
    });
  }

  private drawEdgeCenters(): void {
    const { topCenter, rightCenter, bottomCenter, leftCenter } =
      this.gameObject.pointsMap;

    const width = this.markerWidth;
    const height = this.markerHeight;

    //top center
    canvas.drawRectangle({
      position: {
        x: topCenter.x - width * 0.5,
        y: topCenter.y,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //right center
    canvas.drawRectangle({
      position: {
        x: rightCenter.x - width,
        y: rightCenter.y - height * 0.5,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //bottom center
    canvas.drawRectangle({
      position: {
        x: bottomCenter.x - width * 0.5,
        y: bottomCenter.y - height,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //left center
    canvas.drawRectangle({
      position: {
        x: leftCenter.x,
        y: leftCenter.y - height * 0.5,
      },
      width,
      height,
      color: colors.nord.red,
    });
  }

  private drawCorners(): void {
    const { topLeft, topRight, bottomRight, bottomLeft } =
      this.gameObject.pointsMap;

    const width = this.markerWidth;
    const height = this.markerHeight;

    //top left
    canvas.drawRectangle({
      position: {
        x: topLeft.x,
        y: topLeft.y,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //top right
    canvas.drawRectangle({
      position: {
        x: topRight.x - width,
        y: topRight.y,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //bottom right
    canvas.drawRectangle({
      position: {
        x: bottomRight.x - width,
        y: bottomRight.y - height,
      },
      width,
      height,
      color: colors.nord.red,
    });

    //bottom left
    canvas.drawRectangle({
      position: {
        x: bottomLeft.x,
        y: bottomLeft.y - height,
      },
      width,
      height,
      color: colors.nord.red,
    });
  }

  private drawDirection(): void {
    const { Top, Right, Bottom, Left } = Direction;
    const { center, topCenter, rightCenter, bottomCenter, leftCenter } =
      this.gameObject.pointsMap;

    if (this.gameObject.isDirection(Top)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: topCenter.x,
          y: topCenter.y,
        },
        color: colors.nord.red,
      });
      return;
    }

    if (this.gameObject.isDirection(Right)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: rightCenter.x,
          y: rightCenter.y,
        },
        color: colors.nord.red,
      });
      return;
    }

    if (this.gameObject.isDirection(Bottom)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: bottomCenter.x,
          y: bottomCenter.y,
        },
        color: colors.nord.red,
      });
      return;
    }

    if (this.gameObject.isDirection(Left)) {
      canvas.drawLine({
        start: {
          x: center.x,
          y: center.y,
        },
        end: {
          x: leftCenter.x,
          y: leftCenter.y,
        },
        color: colors.nord.red,
      });
    }
  }

  public enable(): void {
    this.isDisabled = false;
  }

  public disable(): void {
    this.isDisabled = true;
  }

  public toggle(): void {
    this.isDisabled = !this.isDisabled;
  }
}
