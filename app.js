// GAME BOARD MODULE
const GameBoard = (() => {
  const _gameboard = new Array(9);

  const setGameBoard = (index, sign) => {
    _gameboard[index] = sign;
  };

  const getGameBoard = () => {
    return _gameboard;
  };

  return { setGameBoard, getGameBoard };
})();

// HANDLE THE GAME START SCREEN
const Gamestart = (() => {
  const start = () => {
    const startCard = document.querySelector(".startcard");
    const scoreCard = document.querySelector(".scorecard");
    const gameBoardDiv = document.querySelector(".gameboard");
    const player1input = document.getElementById("nameplayer1").value;
    const player2input = document.getElementById("nameplayer2").value;
    const player1name = document.getElementById("player1name");
    const player2name = document.getElementById("player2name");

    if (player1input === "" || player2input === "") {
      alert("Enter players name");
      return;
    } else {
      player1name.textContent = player1input;
      player2name.textContent = player2input;

      startCard.style.display = "none";
      scoreCard.style.display = "flex";
      gameBoardDiv.style.display = "grid";
    }
  };

  const addSignToBox = (el, sign) => {
    if (el.innerHTML === "") {
      el.innerHTML = sign;
      el.style.cursor = "not-allowed";
    }
  };

  return { start, addSignToBox };
})();

// DISPLAY THE GAME
const Displaycontroller = (() => {
  const startBtn = document.getElementById("startgame");
  const boxes = document.querySelectorAll(".box");

  boxes.forEach(box => {
    box.addEventListener("click", () => Gamestart.addSignToBox(box, "X"));
  });
  // GAME START BUTTON
  startBtn.addEventListener("click", Gamestart.start);
})();

// PLAYER FACTORY FUNCTION
const Player = (name, sign) => {
  return {
    name,
    sign,
  };
};
