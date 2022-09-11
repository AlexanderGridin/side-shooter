import { InputKey } from "../enumerations/input-key.enum";

class Key {
  public isPressed = false;
  public isPrevPressed = false;
  public isClicked = false;
}

export class InputHandler {
  private readonly keysMap: Record<string, Key> = {};
  private keysForUpdate: Array<InputKey> = [];

  constructor() {
    this.initKeysStates();
    this.setEventListeners();
  }

  private initKeysStates(): void {
    Object.values(InputKey).forEach((key: string) => {
      this.keysMap[key] = new Key();
    });
  }

  private setEventListeners(): void {
    document.addEventListener("keydown", (e) => {
      const keyCode = e.code as InputKey;

      if (this.keysMap[keyCode] === undefined) {
        return;
      }

      this.keysMap[keyCode].isPressed = true;

      if (this.keysForUpdate.indexOf(keyCode) !== -1) {
        return;
      }

      this.keysForUpdate.push(keyCode);
    });

    document.addEventListener("keyup", (e) => {
      const keyCode = e.code as InputKey;

      if (this.keysMap[keyCode] !== undefined) {
        this.keysMap[keyCode].isPressed = false;
      }
    });
  }

  public update(): void {
    const map = this.keysMap;

    this.keysForUpdate.forEach((keyCode: string) => {
      const isClicked = !map[keyCode].isPrevPressed && map[keyCode].isPressed;

      map[keyCode].isClicked = isClicked;
      map[keyCode].isPrevPressed = map[keyCode].isPressed;

      if (map[keyCode].isPressed) {
        return;
      }

      this.keysForUpdate = this.keysForUpdate.filter(
        (keyForUpdate) => keyForUpdate !== keyCode
      );
    });
  }

  public isKeyPressed(key: InputKey): boolean {
    return this.keysMap[key].isPressed;
  }

  public isKeyClicked(key: InputKey): boolean {
    return this.keysMap[key].isClicked;
  }
}

export const inputHandler = new InputHandler();
