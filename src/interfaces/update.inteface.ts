import { SharedGameData } from "../classes/shared-game-data.class";

export interface Update {
  update: (gameData?: SharedGameData) => void;
}
