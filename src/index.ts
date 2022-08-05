import { Canvas } from "./classes/canvas.class";
import { Game } from "./classes/game.class";
import { Player } from "./classes/player.class";

const main = () => {
  const canvas = new Canvas({
    selector: "#canvas",
  });

  const game = new Game(canvas);
  game.addEntity(new Player(100, 100));
  game.start();
};

window.addEventListener("load", main);
