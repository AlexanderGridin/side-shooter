import { InputKey } from "../enumerations/input-key.enum";

export class InputHandler {
  public keys: Array<InputKey> = [];

  constructor() {
    document.addEventListener("keydown", (e) => {
      const pressedKey = e.code as InputKey;

      if (this.keys.indexOf(pressedKey) === -1) {
        this.keys.push(pressedKey);
      }
    });

    document.addEventListener("keyup", (e) => {
      const uppedKey = e.code as InputKey;
      const uppedKeyIndex = this.keys.indexOf(uppedKey);

      if (uppedKeyIndex !== -1) {
        this.keys.splice(uppedKeyIndex, 1);
      }
    });
  }

  public isKeyPressed(key: InputKey): boolean {
    return this.keys.indexOf(key) !== -1;
  }
}
