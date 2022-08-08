import { Canvas } from "./classes/canvas.class";
import { Game } from "./classes/game.class";
import { Player } from "./classes/player.class";
import { FpsCounter } from "./classes/fps-counter.class";
import { useToggler } from "./utils/use-toggler.util";

const main = () => {
  const canvas = new Canvas({
    selector: "#canvas",
  });

  const game = new Game(canvas).addObjects([
    new Player(canvas.width * 0.5, canvas.height * 0.5),
    new FpsCounter(),
  ]);

  useToggler({
    selector: "button",
    activeText: "Stop",
    disabledText: "Start",
    useWhenActive: game.start.bind(game),
    useWhedDisabled: game.stop.bind(game),
  });
};

window.addEventListener("load", main);
