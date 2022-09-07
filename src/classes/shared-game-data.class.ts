import { GameObject } from "./game-object.class";
import { InputHandler } from "./input-handler.class";

export class SharedGameData {
  public gameObjects: Array<GameObject> = [];
  public deltaTime = 0;
  public inputHandler!: InputHandler;
}
