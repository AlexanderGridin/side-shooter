import { Canvas } from "./classes/canvas.class";
import { Game } from "./classes/game.class";

const main = () => {
  const canvas = new Canvas({
    selector: "#canvas",
    // width: 852,
    width: 896,
    height: 512,
  });

  new Game(canvas);
};

window.addEventListener("load", main);
