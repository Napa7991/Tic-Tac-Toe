
// 12) display Controller
const displayController=(()=>{
    const renderMessage = (message)=>{
        document.querySelector("#message").innerHTML = message;
    }
    return{renderMessage}
})();

// 3
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];
    const render = () => {
        let boardHTML = ""
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }
    const update = (squareIndex, markValue) => {
        gameboard[squareIndex] = markValue;
        render();
    };

    // 7) Accessor - when clicked on x twice it should not modify the content but can access it
    // gameboard/board is a state eg:
    // gameboard or board = [
    //     'X', '', 'O',
    //     'X', 'O', 'X',
    //     'O', 'X', 'O'
    // ];
    const getGameboard = () => gameboard;



    return { render, update, getGameboard };
})();



const createPlayers = (name, mark) => {
    return { name, mark }
}

// 2
const Game = (() => {

    let players = [];
    let currentPlayerIndex;
    let gameOver = false;

    const start = () => {
        players = [
            createPlayers(document.querySelector("#Player1").value, "X"),
            createPlayers(document.querySelector("#Player2").value, "O")
        ]
        currentPlayerIndex = 0;
        Gameboard.render();
        // const squares = document.querySelectorAll(".square");
        // squares.forEach((square)=>{
        //     square.addEventListener("click",handleClick);
        // })
    }
    const handleClick = (event) => {

        // 11)
        if(gameOver){
            return;
        }

        let index = parseInt(event.target.id.split("-")[1]);

        // 7) a) checking if gameboard array with specific index is empty or not if not empty return , if empty continue the handle click functionality
        if (Gameboard.getGameboard()[index] !== "") {
            return;
        }
        Gameboard.update(index, players[currentPlayerIndex].mark);

        // 9 checking for winner - logic. Gameboard.getGameboard() - current state. player[currentPlayerIndex.mark check teh element inside]
        if (checkForWin(Gameboard.getGameboard())) {
            gameOver = true;
            // 12) a)
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins`)
        }
        // 10) checking tie
        else if(checkForTie(Gameboard.getGameboard())){
            gameOver = true;
            // 12 a)
            displayController.renderMessage(`Its a tie`)

        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    // 8) a);
    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        gameOver = false;
        document.querySelector("#message").innerHTML = "";
        Gameboard.render();
    }



    return { start, handleClick, restart }
})();

// 9) a) check for win
function checkForWin(board) {
    const winningCombo = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winningCombo.length; i++) {
        // here , array destructuring. e.g a=a,b=1,c=2 for winningCombo[i]
        const [a, b, c] = winningCombo[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}


// 10) a 
// It uses Array.prototype.every method to check every element in board array is not an empty array.

function checkForTie(board){
    return board.every(cell=>cell!=="")
}

// 8)Restarting
const restartBtn = document.querySelector("#restart");
restartBtn.addEventListener("click", () => [
    Game.restart()
])


// 1)
const startButton = document.querySelector("#start");
startButton.addEventListener("click", () => {
    Game.start();
})
