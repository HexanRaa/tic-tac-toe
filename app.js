// GAME BOARD MODULE
const GameBoard = (() => {
  let _gameboard = new Array(9).fill(null);

  const setGameBoard = (index, sign) => {
    _gameboard[index] = sign;
  };

  const getGameBoard = () => {
    return _gameboard;
  };

  const resetBoard = () => {
    for (let i = 0; i < 9; i++) {
      return (_gameboard[i] = null);
    }
  };

  return { setGameBoard, getGameBoard, resetBoard };
})();

// PLAYER FACTORY FUNCTION
const Player = (name, sign) => {
  return {
    name,
    sign,
  };
};

// HANDLE THE GAME START SCREEN
const Gamestart = (() => {
  const startCard = document.querySelector(".startcard");
  const scoreCard = document.querySelector(".scorecard");
  const gameBoardDiv = document.querySelector(".gameboard");
  const playerXName = document.getElementById("nameplayer1");
  const playerOName = document.getElementById("nameplayer2");
  const player1El = document.getElementById("player1name");
  const player2El = document.getElementById("player2name");

  const start = () => {
    if (playerXName.value === "" || playerOName.value === "") {
      alert("Enter players name");
      return;
    } else {
      player1El.textContent = playerXName.value;
      player2El.textContent = playerOName.value;

      startCard.style.display = "none";
      scoreCard.style.display = "flex";
      gameBoardDiv.style.display = "grid";
    }
  };

  const setPlayers = () => {
    return [
      (playerX = Player(playerXName.value, "X")),
      (playerO = Player(playerOName.value, "O")),
    ];
  };

  return { start, setPlayers };
})();

// DISPLAY THE GAME
const Displaycontroller = (() => {
  const startBtn = document.getElementById("startgame");
  const boxes = document.querySelectorAll(".box");
  const playerXScoreEl = document.getElementById("playerXscore");
  const playerOScoreEl = document.getElementById("playerOscore");
  const winnerDiv = document.querySelector(".winner");
  const winnerTextEl = document.getElementById("winner-text");
  const playAgainBtn = document.getElementById("playagain");

  const displayWinner = winner => {
    winnerTextEl.textContent = `Winner is ${winner}`;
    winnerDiv.style.display = "flex";
  };

  const displayTie = winner => {
    winnerTextEl.textContent = `Tie Game`;
    winnerDiv.style.display = "flex";
    playAgainBtn.style.display = "none";
  };

  const closeDisplayText = () => {
    winnerDiv.style.display = "none";
  };

  const updateScore = (playerXScore, playerOScore) => {
    playerXScoreEl.textContent = playerXScore;
    playerOScoreEl.textContent = playerOScore;
  };

  const resetDisplayBoard = () => {
    boxes.forEach(box => {
      box.textContent = "";
      box.classList.remove("signed");
    });
  };

  const playAgain = () => {
    winnerDiv.style.display = "none";
  };

  boxes.forEach((box, index) => {
    box.addEventListener("click", () => Gamecontroller.handleClick(box, index));
  });

  // GAME START BUTTON
  startBtn.addEventListener("click", Gamestart.start);

  return {
    displayWinner,
    displayTie,
    closeDisplayText,
    playAgain,
    updateScore,
    resetDisplayBoard,
  };
})();

// THE GAME CONTROLLER

const Gamecontroller = (() => {
  let currentPlayer = "PlayerX";
  let playerXScore = 0;
  let playerOScore = 0;

  const addSignToBox = (el, sign) => {
    if (el.textContent === "") {
      el.textContent = sign;
      el.classList.add("signed");
    }
    // el.removeEventListener("click");
  };

  const handleClick = (box, index) => {
    if (currentPlayer === "PlayerX") {
      GameBoard.setGameBoard(index, "X");
      addSignToBox(box, "X");
      // currentPlayer = "PlayerO";
    } else {
      GameBoard.setGameBoard(index, "O");
      addSignToBox(box, "O");
      // currentPlayer = "PlayerX";
    }

    if (checkForWinner(GameBoard.getGameBoard())) {
      switch (currentPlayer) {
        case "PlayerX":
          playerXScore++;
          Displaycontroller.updateScore(playerXScore, playerOScore);
          Displaycontroller.resetDisplayBoard();
          GameBoard.resetBoard();
          break;
        case "PlayerO":
          playerOScore++;
          Displaycontroller.updateScore(playerXScore, playerOScore);
          Displaycontroller.resetDisplayBoard();
          GameBoard.resetBoard();
          break;
      }
    } else if (checkForTie(GameBoard.getGameBoard())) {
      Displaycontroller.displayTie();
      setTimeout(Displaycontroller.closeDisplayText, 2000);
      Displaycontroller.resetDisplayBoard();
      GameBoard.resetBoard();
    }
    currentPlayer === "PlayerX"
      ? (currentPlayer = "PlayerO")
      : (currentPlayer = "PlayerX");

    let players = Gamestart.setPlayers();
    if (playerXScore === 3) {
      Displaycontroller.displayWinner(players[0].name);
    } else if (playerOScore === 3) {
      Displaycontroller.displayWinner(players[1].name);
    }
  };

  const checkForWinner = board => {
    const _winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < _winningCombos.length; i++) {
      const [a, b, c] = _winningCombos[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
  };

  const checkForTie = board => {
    return board.every(box => box !== null);
  };

  return { handleClick };
})();
