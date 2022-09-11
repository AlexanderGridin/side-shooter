import { GameObject } from "./game-object.class";

export class SharedGameData {
  public gameObjects: Array<GameObject> = [];
  public deltaTime = 0;
}
