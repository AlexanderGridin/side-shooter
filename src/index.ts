import { Canvas } from "./classes/canvas.class";
import { GameObject } from "./classes/game-object.class";
import { Game } from "./classes/game.class";
import { Player } from "./classes/player.class";

const gameObjects: Array<GameObject> = [new Player(100, 100)];

const main = () => {
  const canvas = new Canvas({
    selector: "#canvas",
  });

  const game = new Game(canvas);
  game.addObjects(gameObjects);
  game.start();
};

window.addEventListener("load", main);
