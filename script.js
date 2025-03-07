// function Game(gameboard) {
//     const gameBoardName = gameboard;
//     return {gameboard, gameBoardName}
// }

function GameBoard() {
    const gridSize = 3;
    const board = [];


    for (let i = 0; i < gridSize; i++){
        board[i] = [];
        for (let j = 0; j < gridSize; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row,col,player) => {
        if(board[row][col].getValue() === 0) {
            board[row][col].addToken(player);
            return true;
        }
        return false;
    }

    const checkWinner = () => {
        // Check rows, columns and diagonals
        for(let i = 0; i < gridSize; i++) {
            if(
                board[i][0].getValue() !== 0 &&
                board[i][0].getValue() === board[i][1].getValue()  &&
                board[i][1].getValue() === board[i][2].getValue() 
            ) {
                return board[i][0].getValue();
            }

            if(
                board[0][i].getValue() !== 0 &&
                board[0][i].getValue() === board[1][i].getValue()  &&
                board[1][i].getValue() === board[2][i].getValue() 
            ) {
                return board[0][i].getValue();
            }
        }

            //check diagonals
            if(
                board[0][0].getValue() !== 0 && 
                board[0][0].getValue() === board[1][1].getValue() && 
                board[1][1].getValue() === board[2][2].getValue()
            ) {
                return board[0][0].getValue();
            }

            if(
                board[0][2].getValue() !== 0 &&
                board[0][2].getValue() === board[1][1].getValue() &&
                board[1][1].getValue() === board[2][1].getValue
            ) {
                return board[0][2].getValue()
            }

        
        return null;
    }

    
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return {getBoard, placeToken, checkWinner, printBoard}
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController() {
    playerOne = "Player One";
    playerTwo = "Player Two";

    let board = GameBoard();

    const players = [
        {
            name: playerOne,
            token: "x"
        },

        {
            name: playerTwo,
            token: "o"
        }
    ];

    let activePlayer = players[0];
    let gameOver = false;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        if (!gameOver) {
            console.log(`${getActivePlayer().name}'s turn.`);
        }
    }

    const playRound = (row,col) => {
        if(gameOver) {
            console.log("Game is over! Start a new game.");
            return;
        }

        console.log(`${getActivePlayer().name} is making a move at (${row}, ${col})...`)

        if (!board.placeToken(row,col,getActivePlayer().token)){
            console.log("Invalid move! Try again.");
            return;
        }
        const  winner = board.checkWinner();
        if(winner) {
            board.printBoard();
            console.log(`Game Over! ${winner === 1 ? players[0].name : players[1].name} wins!`)
            gameOver = true;
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    const newGame = () => {
        gameOver = false; 
        activePlayer = players[0];
        board = GameBoard();
        console.log("New game has been started, play rounds to begin!")
    }

    return{playRound, getActivePlayer, newGame};

}

const game = GameController();

game.playRound(0, 0); // Player One
game.playRound(0, 1); // Player Two
game.playRound(1, 1); // Player One
game.playRound(0, 2); // Player Two
game.playRound(2, 2); // Player One wins

///////////////////////////////////////////////////////