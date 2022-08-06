import { GameObject } from "./game-object.class";

export class SharedGameData {
  public geometry: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  public gameObjects: Array<GameObject> = [];
  public deltaTime = 0;
}
