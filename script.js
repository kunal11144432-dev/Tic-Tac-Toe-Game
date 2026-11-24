const boardElement = document.getElementById("board");
const cells = [...document.querySelectorAll(".cell")];
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const scoreXElement = document.getElementById("scoreXValue");
const scoreOElement = document.getElementById("scoreOValue");
const scoreTieElement = document.getElementById("scoreTieValue");
const scoreXCard = document.getElementById("scoreX");
const scoreOCard = document.getElementById("scoreO");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0, ties: 0 };

function setActivePlayer() {
  scoreXCard.classList.toggle("active", !gameOver && currentPlayer === "X");
  scoreOCard.classList.toggle("active", !gameOver && currentPlayer === "O");
}

function findWinner() {
  return winningLines.find((line) =>
    line.every((index) => board[index] && board[index] === board[line[0]])
  );
}

function play(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, ${currentPlayer}`);
  cell.disabled = true;

  const winningLine = findWinner();
  if (winningLine) {
    gameOver = true;
    scores[currentPlayer]++;
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    statusElement.textContent = `Player ${currentPlayer} wins!`;
    winningLine.forEach((winningIndex) => cells[winningIndex].classList.add("winner"));
    setActivePlayer();
    return;
  }

  if (board.every(Boolean)) {
    gameOver = true;
    scores.ties++;
    scoreTieElement.textContent = scores.ties;
    statusElement.textContent = "It's a tie!";
    setActivePlayer();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
  setActivePlayer();
}

function resetRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.className = "cell";
  });

  const labels = [
    "Top left", "Top center", "Top right",
    "Middle left", "Middle center", "Middle right",
    "Bottom left", "Bottom center", "Bottom right",
  ];
  cells.forEach((cell, index) => cell.setAttribute("aria-label", labels[index]));

  statusElement.textContent = "Player X's turn";
  setActivePlayer();
  cells[0].focus();
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => play(Number(cell.dataset.index)));
});

boardElement.addEventListener("keydown", (event) => {
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;

  const activeIndex = cells.indexOf(document.activeElement);
  if (activeIndex === -1) return;

  let nextIndex = activeIndex;
  if (event.key === "ArrowUp") nextIndex = (activeIndex + 6) % 9;
  if (event.key === "ArrowDown") nextIndex = (activeIndex + 3) % 9;
  if (event.key === "ArrowLeft") nextIndex = activeIndex % 3 === 0 ? activeIndex + 2 : activeIndex - 1;
  if (event.key === "ArrowRight") nextIndex = activeIndex % 3 === 2 ? activeIndex - 2 : activeIndex + 1;

  event.preventEventDefault?.();
  event.preventDefault();
  cells[nextIndex].focus();
});

resetButton.addEventListener("click", resetRound);
setActivePlayer();
