import { Draw } from "../interfaces/draw.interface";
import { Update } from "../interfaces/update.inteface";
import { SharedGameData } from "./game.class";

export abstract class GameObject implements Update, Draw {
  public abstract update(gameData?: SharedGameData): void;
  public abstract draw(context: CanvasRenderingContext2D): void;
}
