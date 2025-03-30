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
                board[1][1].getValue() === board[2][0].getValue()
            ) {
                return board[0][2].getValue();
            }
              
        return null;
    }

    const checkTie = () => {
        let gridFilled = [];
        for(let row = 0; row < gridSize; row++){
            for(let col = 0; col < gridSize; col++){
                if(board[row][col].getValue() != 0) {
                    // console.log(`Board (${row},${col}) ${board[row][col].getValue()}`)
                    gridFilled.push(true)
                } else {
                    gridFilled.push(false); 
                }
            }
        }

        if(gridFilled.every(Boolean)) {
            return true;
        }

        return null;
    }

    
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return {getBoard, placeToken, checkWinner, printBoard, checkTie}
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


function GameController(playerOne, playerTwo) {

    let board = GameBoard();

    const getBoard = () => board;

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
    let winnerMessage = null;
    let tieMessage = null; 

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        if (!gameOver) {
            activePlayerName = getActivePlayer().name;
            console.log(`${activePlayerName}'s turn.`);
        }
        return{activePlayerName};
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
        const tie = board.checkTie();

        if(winner) {
            board.printBoard();

            if(winner === "x") {
                winnerMessage = `Game Over! ${players[0].name} wins!`;
            } else {
                winnerMessage = `Game Over! ${players[1].name} wins!`;
            }

            console.log(winnerMessage);
            gameOver = true;
            return;
        }
        

        if(tie) {
            board.printBoard()  
            tieMessage = "Game Over! Its a tie!!"
            console.log(tieMessage)
            gameOver = true;
            return;
        }

        switchPlayerTurn();
        printNewRound();

        return {winnerMessage, tieMessage};
    };

    printNewRound();

    const newGame = () => {
        gameOver = false; 
        activePlayer = players[0];
        board = GameBoard();
        console.log("New game has been started, play rounds to begin!")
    }

    const getGameStatus = () => ({
        gameOver, 
        winnerMessage, 
        tieMessage
    });

    return{playRound, getActivePlayer, newGame, getBoard, getGameStatus, activePlayerName};

}



// game.playRound(0, 0); // Player One
// game.playRound(0, 1); // Player Two
// game.playRound(1, 1); // Player One
// game.playRound(0, 2); // Player Two
// game.playRound(2, 2); // Player One wins

///////////////////////////////////////////////////////

//new game Tie testing - need to add check if tie 

// game.newGame();

// game.playRound(0, 2); // Player One x
// game.playRound(0, 1); // Player Two
// game.playRound(1, 0); // Player One x
// game.playRound(0, 0); // Player Two 

// game.playRound(2, 1); // Player One x
// game.playRound(2, 0); // Player Two 
// game.playRound(2, 2); // Player One x

// game.playRound(1, 2); // Player Two 
// game.playRound(1, 1); // Player One x

//alternative tie mode 


// game.newGame();

// game.playRound(0, 1); // Player One x
// game.playRound(0, 0); // Player Two
// game.playRound(0, 2); // Player One x
// game.playRound(1, 1); // Player Two 

// game.playRound(1, 0); // Player One x
// game.playRound(1, 2); // Player Two 
// game.playRound(2, 0); // Player One x

// game.playRound(2, 1); // Player Two 
// game.playRound(2, 2); // Player One x


function renderGame(game) {

    const gameBoardContainer = document.querySelector(".gameboard-container");
    const gameResultsContainer = document.querySelector(".game-result-container");

    if(!gameBoardContainer){
        console.error("Gameboard container is not found!");
        return;
    }

    const drawBoard = () => {

        //this clears the gameboard so future updates are kept 
        gameBoardContainer.textContent = "";

        let board = game.getBoard().getBoard();

        for (let row = 0; row < board.length; row++){
            for(let col = 0; col < board[row].length; col++) {
                let playerSquare = document.createElement("div");
                playerSquare.classList.add("player-square");
                playerSquare.dataset.row = row;
                playerSquare.dataset.col = col;

                const cellValue = board[row][col].getValue();
                playerSquare.textContent = cellValue !== 0 ? cellValue : " ";

                playerSquare.addEventListener("click", () => handleCellClick(row,col));

                gameBoardContainer.appendChild(playerSquare);
            }
        }
    }

    const displayResult = () => {

        const gameStatus = game.getGameStatus();

        if (gameStatus.gameOver) {

            let gameResult = gameStatus.tieMessage || gameStatus.winnerMessage;
            console.log("display results", gameResult);

            let gameResultDiv = document.createElement("div");
            gameResultDiv.textContent = "";
            gameResultDiv.classList.add("results");
            gameResultDiv.textContent = gameResult;
    
            gameResultsContainer.appendChild(gameResultDiv);
        }


    }

    const handleCellClick = (row,col) => {
        game.playRound(row,col);
        drawBoard();

        const winner = game.getBoard().checkWinner();
        const tie = game.getBoard().checkTie();

        const gameStatus = game.getGameStatus();
        if (gameStatus.gameOver) {
            displayResult();  // Display the winner or tie result
        }
    }

    // displayResult();

    return {drawBoard,displayResult}

}

function playGame() {
            
    const playButton = document.querySelector(".playRound");

    if (!playButton){
        console.error("play button not found");
        return;
    }

    playButton.addEventListener("click", (event) => {

        event.preventDefault();

        const playerOne = document.querySelector("#PlayerOneName").value || "Player 1";
        const playerTwo = document.querySelector("#PlayerTwoName").value || "Player 2";

        console.log(`Game started: ${playerOne} vs ${playerTwo}`);

        console.log("Player One:", playerOne);
        console.log("Player Two:", playerTwo);

        const game = GameController(playerOne,playerTwo);
        const render = renderGame(game);
        render.drawBoard();
        render.displayResult();
    })

}

playGame();