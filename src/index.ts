import { Canvas } from "./classes/canvas.class";
import { Game } from "./classes/game.class";

const main = () => {
  const canvas = new Canvas({
    selector: "#canvas",
    width: 860,
    height: 480,
  });

  new Game(canvas);
};

window.addEventListener("load", main);
