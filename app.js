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
    for (let i = 0; i < _gameboard.length; i++) {
      _gameboard[i] = null;
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

  const restart = () => {
    startCard.style.display = "flex";
    scoreCard.style.display = "none";
    gameBoardDiv.style.display = "none";
  };

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

  return { start, setPlayers, restart };
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

  const displayTieGame = () => {
    winnerTextEl.textContent = `Tie Game`;
    winnerDiv.style.display = "flex";
  };

  const displayTieRound = () => {
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

  const resetScore = () => {
    playerXScoreEl.textContent = 0;
    playerOScoreEl.textContent = 0;
  };

  const resetDisplayBoard = () => {
    boxes.forEach(box => {
      box.textContent = "";
      box.classList.remove("signed");
    });
  };

  // GAMEBOARD BOXES EVENT LISTERNER
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => Gamecontroller.handleClick(box, index));
  });

  // GAME START BUTTON
  startBtn.addEventListener("click", Gamestart.start);

  // PLAY AGAIN BUTTON AFTER GAMEOVER
  playAgainBtn.addEventListener("click", () => Gamecontroller.playAgain());

  return {
    displayWinner,
    displayTieGame,
    displayTieRound,
    closeDisplayText,
    resetScore,
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
  };

  const handleClick = (box, index) => {
    let players = Gamestart.setPlayers();
    let currentbox = box.textContent;

    if (currentbox === "") {
      if (currentPlayer === "PlayerX") {
        GameBoard.setGameBoard(index, "X");
        addSignToBox(box, "X");
      } else {
        GameBoard.setGameBoard(index, "O");
        addSignToBox(box, "O");
      }
      // CHECKING FOR WINNER AND DISPLAYING
      if (checkForWinner(GameBoard.getGameBoard())) {
        switch (currentPlayer) {
          case "PlayerX":
            GameBoard.resetBoard();
            playerXScore++;
            Displaycontroller.updateScore(playerXScore, playerOScore);
            Displaycontroller.resetDisplayBoard();
            break;
          case "PlayerO":
            GameBoard.resetBoard();
            playerOScore++;
            Displaycontroller.updateScore(playerXScore, playerOScore);
            Displaycontroller.resetDisplayBoard();
            break;
        }
      } else if (checkForTie(GameBoard.getGameBoard())) {
        GameBoard.resetBoard();
        Displaycontroller.displayTieRound();
        setTimeout(Displaycontroller.closeDisplayText, 2000);
        Displaycontroller.resetDisplayBoard();
      }

      currentbox.textContent = "";

      // SWITCHING THE PLAYER TURNS
      currentPlayer === "PlayerX"
        ? (currentPlayer = "PlayerO")
        : (currentPlayer = "PlayerX");

      if (playerXScore === 3) {
        Displaycontroller.displayWinner(players[0].name);
      } else if (playerOScore === 3) {
        Displaycontroller.displayWinner(players[1].name);
      } else if (playerXScore === 3 && playerOScore === 3) {
        Displaycontroller.displayTieGame();
      }
    } else {
      alert("Move Played");
    }
  };

  // FUNCTION TO CHECK FOR WINNERS
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

  // FUNCTION TO CHECK FOR TIES
  const checkForTie = board => {
    return board.every(box => box !== null);
  };

  const playAgain = () => {
    GameBoard.resetBoard();
    Displaycontroller.resetDisplayBoard();
    Displaycontroller.resetScore();
    Gamestart.restart();
    Displaycontroller.closeDisplayText();
    currentPlayer = "PlayerX";
    playerXScore = 0;
    playerOScore = 0;
  };

  return { handleClick, playAgain };
})();
