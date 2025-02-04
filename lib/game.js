const State = require("./state");

class Game {
  constructor(level, Display, Level) {
    this.level = level;
    this.display = new Display(document.body, level);
    this.state = State.start(level);
    this.arrowKeysTracker = this.#trackKeys([
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ]);
    this.levelConstructor = Level;
  }

  run() {
    this.#runAnimation(this.#updateFrame);
  }

  /**
   * This function computes a new state,
   * syncs the display and returns a boolean
   * true for still playing false for won/lost
   */
  #updateFrame = (time) => {
    this.state = this.state.update(
      time,
      this.arrowKeysTracker,
      this.levelConstructor
    );
    this.display.syncState(this.state);
  };

  /**
   * This function syncs the timing of the browsers refresh rate
   * to the timing inside the game, so there are no glitches
   */
  #runAnimation(updateFrame) {
    let lastTime = null;
    function frame(time) {
      if (lastTime != null) {
        let timeStep = Math.min(time - lastTime, 100) / 1000;
        updateFrame(timeStep);
      }
      lastTime = time;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  #trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
      if (keys.includes(event.key)) {
        down[event.key] = event.type == "keydown";
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    return down;
  }
}

module.exports = Game;
