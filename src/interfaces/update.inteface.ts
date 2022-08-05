import { SharedGameData } from "../classes/game.class";

export interface Update {
  update: (gameData?: SharedGameData) => void;
}
