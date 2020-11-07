"use-strict";

const main = () => {
  const buildDom = (html) => {
    const main = document.querySelector("main");
    main.innerHTML = html;
  };

  const buildSplashScreen = () => {
    buildDom(`
        <section class="splash-screen">
            <h1>Eternal Enemies</h1>
            <label>Enter your name:
              <input type="text" id="name">
            </label>
            <button>Start</button>
        </section>
        `);
    const nameInput = document.getElementById("name");
    const startButton = document.querySelector("button");
    startButton.addEventListener("click", () => {
      let name = nameInput.value;
      buildGameScreen(name);
    });
  };

  const buildGameScreen = (name) => {
    buildDom(`
            <section class="game-screen">
              <div>
                <p>Player's name: ${name}</p>
                <p>Score: <span id="score"></span></p>
              </div>
              <canvas></canvas>
            </section>
            
        `);

    const width = document.querySelector(".game-screen").offsetWidth;
    const height = document.querySelector(".game-screen").offsetHeight;

    const canvasElement = document.querySelector("canvas");

    canvasElement.setAttribute("width", width);
    canvasElement.setAttribute("height", height);

    let scoreEle = document.querySelector('#score');

    const game = new Game(canvasElement, name, scoreEle);
    game.gameOverCallback(buildGameOver);

    game.startLoop();

    const setPlayerDirection = (event) => {
      if (event.code === "ArrowUp") {
        game.player.setDirection(-1);
      } else if (event.code === "ArrowDown") {
        game.player.setDirection(1);
      }
    };

    document.addEventListener("keydown", setPlayerDirection);
  };

  const setScore = (playerName, newScore) => {
    // recoger los scores si ya existen en localStorage (almacenados como string)
    const topScoresStr = localStorage.getItem('topScores');
    // crear un array vacío por si no hemos encontrado nada en localStorage (si topScoresStr es null)
    let topScoresArr = [];
    // y si hay un string de scores en localStorage (si topScoresStr no es null), convertirlo a objeto
    if(topScoresStr) topScoresArr = JSON.parse(topScoresStr);

    // actualizar este objeto de scores con el último score que hemos recibido
    const newScoreObj = { name: playerName, score: newScore };
    topScoresArr.push(newScoreObj);

    // convertirlo de nuevo a string
    const updatedScoresStr = JSON.stringify(topScoresArr);
    // almacenarlo en localStorage
    localStorage.setItem('topScores', updatedScoresStr);

    // devolver topScoresArr para poder mostrar los scores en la pantalla de gameOver
    return topScoresArr;
  }

  const buildGameOver = (name, score) => {
    // recoger el array de scores
    const scores = setScore(name, score);
    // ordenar los scores en orden ascendiente
    let orderedScores = [...scores].sort((a, b) => {
      return b.score - a.score;
    })
    // para cada objeto score dentro de ese array, devolver un elemento <li> (y pasar scoreElements dentro de buildDom())
    const scoreElements = orderedScores.reduce((acc, scoreObj) => {
      return `${acc} <li>${scoreObj.name}: ${scoreObj.score}</li>`;
    }, '')

    buildDom(`
            <section class="game-over">
                <h1>Game Over Screen</h1>
                <h3>Score: ${score} seconds for ${name}</h3>
                <button>Restart</button>
                <ul>${scoreElements}</ul>
            </section>
        `);

    const restartButton = document.querySelector("button");
    restartButton.addEventListener("click", () => buildGameScreen(name));
  };

  buildSplashScreen();
};

window.addEventListener("load", main);
