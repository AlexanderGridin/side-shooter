import { InputKey } from "../enumerations/input-key.enum";

export class InputHandler {
  private readonly keysPressedState: Record<string, boolean> = {};
  private readonly keysPrevPressedState: Record<string, boolean> = {};

  private readonly keysClickedState: Record<string, boolean> = {};

  private lastKeyPressed!: InputKey;

  constructor() {
    this.initKeysStates();
    this.setEventListeners();
  }

  private initKeysStates(): void {
    Object.values(InputKey).forEach((key: string) => {
      this.keysPressedState[key] = false;
      this.keysPrevPressedState[key] = false;

      this.keysClickedState[key] = false;
    });
  }

  private setEventListeners(): void {
    document.addEventListener("keydown", (e) => {
      const keyCode = e.code as InputKey;

      if (this.keysPressedState[keyCode] !== undefined) {
        this.lastKeyPressed = keyCode;
        this.keysPressedState[keyCode] = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      const keyCode = e.code as InputKey;

      if (this.keysPressedState[keyCode] !== undefined) {
        this.keysPressedState[keyCode] = false;
      }
    });
  }

  public update(): void {
    const keyCodes: Array<string> = Object.values(InputKey);

    keyCodes.forEach((keyCode: string) => {
      this.keysClickedState[keyCode] =
        !this.keysPrevPressedState[keyCode] && this.keysPressedState[keyCode];
      this.keysPrevPressedState[keyCode] = this.keysPressedState[keyCode];
    });
  }

  public isKeyPressed(key: InputKey): boolean {
    return this.keysPressedState[key];
  }

  public isKeyClicked(key: InputKey): boolean {
    return this.keysClickedState[key];
  }

  public isLastPressed(key: InputKey): boolean {
    console.log(this.lastKeyPressed);
    return this.lastKeyPressed === key;
  }
}
