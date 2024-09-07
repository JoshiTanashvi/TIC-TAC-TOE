const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const singlePlayerBtn = document.getElementById('singlePlayer');
const doublePlayerBtn = document.getElementById('doublePlayer');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isSinglePlayer = false;
let isGameActive = true;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

singlePlayerBtn.addEventListener('click', () => {
    resetGame();
    isSinglePlayer = true;
    statusText.textContent = "Single Player Mode";
});

doublePlayerBtn.addEventListener('click', () => {
    resetGame();
    isSinglePlayer = false;
    statusText.textContent = "Double Player Mode";
});

cells.forEach(cell => cell.addEventListener('click', handleClick));

function handleClick(event) {
    const cellIndex = event.target.id;

    if (board[cellIndex] !== '' || !isGameActive) {
        return;
    }

    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `${currentPlayer} wins!`;
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        statusText.textContent = "It's a tie!";
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (isSinglePlayer && currentPlayer === 'O') {
        computerMove();
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    board[bestMove] = 'O';
    document.getElementById(bestMove).textContent = 'O';
    currentPlayer = 'X';

    if (checkWin()) {
        statusText.textContent = "O wins!";
        isGameActive = false;
    } else if (board.every(cell => cell !== '')) {
        statusText.textContent = "It's a tie!";
        isGameActive = false;
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWin()) {
        return isMaximizing ? -1 : 1;
    } else if (board.every(cell => cell !== '')) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    isGameActive = true;
}
