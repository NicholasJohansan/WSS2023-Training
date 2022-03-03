const player = function(sign) {
  return {
    sign
  };
};

const appStorage = (function() {
  const BOARD_STATE_KEY = "boardState";

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
      boardState.state = 'ongoing'; // Game is ongoing by default
    } else {
      // Ensure that boardState has all the new properties added
      if (!boardState.state) boardState.state = 'ongoing';
    }
    return boardState;
  };

  const saveBoardState = function(currentPlayer, board, state) {
    let boardState = {
      currentPlayer,
      board,
      state
    };
    localStorage.setItem(BOARD_STATE_KEY, JSON.stringify(boardState));
  };

  return {
    getBoardState,
    saveBoardState
  };
})();

const gameBoard = (function() {
  let board = $('#board');
  let turnDisplay = $('#turn-display');

  const updateTurnDisplay = function(text) {
    turnDisplay.hide(0, function() {
      $(this).text(text).show();
    });
  };

  const setTileSign = function(tile, sign) {
    $(tile).children('p').fadeOut(0, function() {
      $(this).text(sign).fadeIn(200);
    });
    $(tile).removeAttr('role'); // To remove the click pointer
  };

  const populate = function(board) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let tileValue = {}
        let divAttrs = {
          'data-row': row,
          'data-col': col,
          'class': 'tile'
        };
        if (board[row][col]) {
          tileValue.text = board[row][col];
        } else {
          divAttrs.role = 'button';
        }
        $('<div>', divAttrs)
          .append($('<p>', tileValue))
          .appendTo('#board')
          .click(gameController.tileClicked);
      }
    }
  };

  const removeTileButtonRole = function() {
    board.children('.tile').toArray().forEach( tile => {
      $(tile).removeAttr('role', 'button');
    });
  };

  const win = function(winningSigns) {
    for (let winningSign of winningSigns) {
      let { col, row } = winningSign;
      board.children(`[data-row=${row}][data-col=${col}]`).animate({
        opacity: 0.5
      }, 400);
    }
    updateTurnDisplay(`${winningSigns[0].sign} wins!`);
    removeTileButtonRole();
  };

  const tie = function() {
    updateTurnDisplay('It\'s a tie!');
    removeTileButtonRole();
  }

  const update = function(currentPlayer) {
    updateTurnDisplay(`${currentPlayer.sign}\'s turn`);
  };

  const reset = function(currentPlayer) {
    board.children('.tile').toArray().forEach( tile => {
      $(tile).children('p').text('');
      $(tile).animate({opacity: 1}, 400);
      $(tile).attr('role', 'button');
    });
    update(currentPlayer);
  };
  
  return {
    reset,
    update,
    populate,
    setTileSign,
    win,
    tie,
    removeTileButtonRole
  };
})();

const gameController = (function() {
  let playerX = player('X');
  let playerO = player('O');
  const defaultPlayer = playerX; // X starts first by default
  let state;
  let currentPlayer;
  let board;

  const switchPlayer = function() {
    currentPlayer = JSON.stringify(currentPlayer) === JSON.stringify(playerX) ?
      playerO :
      playerX ;
  };

  const gameReset = function() {
    board = board.map(row => row.map(() => null));
    currentPlayer = gameController.defaultPlayer;
    gameBoard.reset(defaultPlayer);
    appStorage.saveBoardState(currentPlayer, board, state);
    ongoingState();
  };

  const isTie = function() {
    return board.every(row => row.every(tile => tile !== null));
  }

  const isWinning = function(signs) {
    return signs.length === 3 && signs[0].sign === signs[1].sign && signs[1].sign === signs[2].sign;
  };

  const getWinningSigns = function() {
    // Check for 3 same sign in a row
    outer:
    for (let row = 0; row < 3; row++) {
      let signs = [];
      for (let col = 0; col < 3; col++) {
        if (!board[row][col]) continue outer;
        signs.push({
          sign: board[row][col],
          row,
          col
        });
      }
      if (isWinning(signs)) return signs;
    }

    // Check for 3 same sign in a column
    outer:
    for (let col = 0; col < 3; col++) {
      let signs = [];
      for (let row = 0; row < 3; row++) {
        if (!board[row][col]) continue outer;
        signs.push({
          sign: board[row][col],
          row,
          col
        });
      }
      if (isWinning(signs)) return signs;
    }

    // Check diagonals
    let signs = [];
    for (let i = 0; i < 3; i++) {
      if (!board[i][i]) continue;
      signs.push({
        sign: board[i][i],
        row: i,
        col: i
      });
    } 
    if (isWinning(signs)) return signs;

    signs = [];
    for (let i = 2; i >= 0; i--) {
      if (!board[i][2-i]) continue;
      signs.push({
        sign: board[i][2-i],
        row: i,
        col: 2-i
      });
    } 
    if (isWinning(signs)) return signs;

    return null;
  };

  const winState = function(winningSigns) {
    state = 'end';
    gameBoard.win(winningSigns);
  }

  const tieState = function() {
    state = 'tie';
    gameBoard.tie();
  }

  const ongoingState = function() {
    state = 'ongoing';
    gameBoard.update(currentPlayer);
  }

  const processBoard = function() {
    let winningSigns = getWinningSigns();
    if (!winningSigns) {
      if (isTie()) {
        tieState();
      } else {
        ongoingState();
      }
    } else {
      winState(winningSigns);
    }
    appStorage.saveBoardState(currentPlayer, board, state);
  }

  const tileClicked = function() {
    let sign = currentPlayer.sign;
    let row = $(this).attr('data-row');
    let col = $(this).attr('data-col');
    let tileValue = $(this).children('p').text()

    if (tileValue !== '') return; // Tile has been clicked on before
    if (state !== 'ongoing') return; // Game not ongoing

    board[row][col] = sign;
    gameBoard.setTileSign(this, sign);
    
    switchPlayer();
    processBoard();
  };

  const setBoardStates = function() {
    let boardState = appStorage.getBoardState();
    board = boardState.board;
    currentPlayer = boardState.currentPlayer;
    state = boardState.state
  };

  const loadGame = function() {
    gameBoard.populate(board);
    processBoard();
  }

  const init = function() {
    setBoardStates();
    loadGame();
    $('#reset-button').click(gameReset);
  };

  return {
    start: init,
    tileClicked,
    defaultPlayer
  };
})();

(function() {
  gameController.start();
})();