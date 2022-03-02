const player = function(sign) {
  return {
    sign
  };
};

const appStorage = (function() {
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
    return boardState
  };

  const saveBoardState = function() {
    console.log('saving')
    let boardState = {
      currentPlayer: gameController.getCurrentPlayer(),
      board: gameController.getBoard()
    };
    localStorage.setItem(BOARD_STATE_KEY, JSON.stringify(boardState))
  };

  // Init game

  return {
    getBoardState,
    saveBoardState
  };
})();

const gameBoard = (function() {
  let boardElement = $('#board');

  const update = function() {
    updateTurnDisplay();
  }

  const reset = function() {
    boardElement.children('.tile').toArray().forEach( tile => {
      $(tile).children('p').text('');
    })
    update();
  }

  const updateTurnDisplay = function() {
    $('#turn-display').hide(0, function() {
      $(this).text(`${gameController.getCurrentPlayer().sign}\'s turn`).show();
    });
  };

  const setTileSign = function(tile, sign) {
    $(tile).children('p').fadeOut(0, function() {
      $(this).text(sign).fadeIn(200);
    });
  };

  const populate = function() {
    let board = gameController.getBoard();
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
          .click(gameController.tileClicked);
      }
    }
  };
  
  return {
    reset,
    update,
    populate,
    setTileSign
  };
})();

const gameController = (function() {
  let playerX = player('X');
  let playerO = player('O');
  const defaultPlayer = playerX; // X starts first by default
  let currentPlayer;
  let board;

  const switchPlayer = function() {
    currentPlayer = JSON.stringify(currentPlayer) === JSON.stringify(playerX) ?
      playerO :
      playerX ;
  }

  const gameUpdate = function() {
    gameBoard.update();
    appStorage.saveBoardState()
  };

  const gameReset = function() {
    board = board.map(row => row.map(() => null));
    currentPlayer = gameController.defaultPlayer;
    gameBoard.reset();
    gameUpdate();
  }

  const tileClicked = function() {
    let sign = currentPlayer.sign;
    let row = $(this).attr('data-row');
    let col = $(this).attr('data-col');

    board[row][col] = sign;
    gameBoard.setTileSign(this, sign);

    switchPlayer();
    gameUpdate();
  };

  const init = function() {
    let boardState = appStorage.getBoardState();
    board = boardState.board;
    currentPlayer = boardState.currentPlayer;
    gameBoard.populate();
    gameUpdate();
    $('#reset-button').click(gameReset);
  }

  const getBoard = () => board;
  const getCurrentPlayer = () => currentPlayer;

  return {
    start: init,
    tileClicked,
    defaultPlayer,
    getBoard,
    getCurrentPlayer
  };
})();

(function() {
  gameController.start();
})();