import { SharedGameData } from "../classes/shared-game-data.class";

export interface Draw {
  draw: (context: CanvasRenderingContext2D, gameData?: SharedGameData) => void;
}
