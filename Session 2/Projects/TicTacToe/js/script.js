const player = function (sign) {
  return {
    sign
  };
};

const gameController = (function () {
  let playerX = player('X');
  let playerO = player('O');
  let currentPlayer;

  const switchPlayer = function () {
    currentPlayer = JSON.stringify(currentPlayer) === JSON.stringify(playerX) ?
      playerO :
      playerX ;
  }

  const getCurrentPlayer = () => currentPlayer;
  const setCurrentPlayer = player => currentPlayer = player;
  const defaultPlayer = playerX;

  return {
    switchPlayer,
    getCurrentPlayer,
    setCurrentPlayer,
    defaultPlayer
  };
})();

const gameBoard = (function () {
  let boardElement = $('#board');
  let board;

  const update = function() {
    appStorage.saveBoardState();
    updateTurnDisplay();
  }

  const resetBoard = function() {
    boardElement.children('.tile').toArray().forEach( tile => {
      $(tile).children('p').text('');
    })
    board = board.map(row => row.map(tile => null));
    gameController.setCurrentPlayer(gameController.defaultPlayer);
    update();
  }

  const updateTurnDisplay = function() {
    $('#turn-display').hide(0, function () {
      $(this).text(`${gameController.getCurrentPlayer().sign}\'s turn`).show();
    });
  };

  const tileClicked = function() {
    let sign = gameController.getCurrentPlayer().sign;
    let row = $(this).attr('data-row');
    let col = $(this).attr('data-col');

    board[row][col] = sign;
    $(this).children('p').fadeOut(0, function () {
      $(this).text(sign).fadeIn(200);
    });

    gameController.switchPlayer();
    update();
  };

  // Populate board
  const populateBoard = function() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let options = board[row][col] ?
          { 'text': board[row][col] } :
          {};
        $('<div>', {
          'data-row': row,
          'data-col': col,
          'class': 'tile',
          'role': 'button'
        }).append($('<p>', options))
          .appendTo('#board')
          .click(tileClicked);
      }
    }
  };

  const init = () => {
    populateBoard();
    updateTurnDisplay();
    $('#reset-button').click(resetBoard);
  };

  const getBoard = () => board;
  const setBoard = newBoard => board = newBoard;
  
  return {
    init,
    getBoard,
    setBoard
  };
})();

const appStorage = (function () {
  BOARD_STATE_KEY = "boardState";

  const getBoardState = function() {
    let boardState = localStorage.getItem(BOARD_STATE_KEY) || '{}';
    boardState = JSON.parse(boardState);
    if ($.isEmptyObject(boardState)) {
      // Set board to be empty 3x3 by default
      boardState.board = [];
      for (let i = 0; i < 3; i++) {
        boardState.board.push([]);
        for (let j = 0; j < 3; j++) {
          boardState.board[i].push(null);
        }
      }
      boardState.currentPlayer = gameController.defaultPlayer;
    }
    gameController.setCurrentPlayer(boardState.currentPlayer);
    gameBoard.setBoard(boardState.board);
  };

  const saveBoardState = function() {
    console.log('saving')
    let boardState = {
      currentPlayer: gameController.getCurrentPlayer(),
      board: gameBoard.getBoard()
    };
    localStorage.setItem(BOARD_STATE_KEY, JSON.stringify(boardState))
  };

  // Init game
  (() => {
    getBoardState();
    gameBoard.init();
  })();

  return {
    getBoardState,
    saveBoardState
  };
})();