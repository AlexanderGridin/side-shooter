import { GameObject } from "./game-object.class";
import { InputHandler } from "./input-handler.class";

export class SharedGameData {
  public geometry: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  public gameObjects: Array<GameObject> = [];
  public deltaTime = 0;
  public inputHandler!: InputHandler;
}
