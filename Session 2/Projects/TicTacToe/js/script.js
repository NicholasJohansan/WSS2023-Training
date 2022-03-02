const player = function(sign) {
  return {
    sign
  };
};

const gameController = (function() {
  let playerX = player('X');
  let playerO = player('O');
  let currentPlayer = playerX; // X goes first

  const switchPlayer = function() {
    currentPlayer = currentPlayer === playerX ?
    playerO :
    playerX ;
  }

  const getCurrentPlayer = () => currentPlayer;

  return {
    getCurrentPlayer,
    switchPlayer
  };
})();

const gameBoard = (function() {
  let boardElement = $('#board');
  let board = [];

  const tileClicked = function() {
    $(this).children('p').fadeOut(0, function() {
      $(this).text(gameController.getCurrentPlayer().sign).fadeIn(200);
    });
    gameController.switchPlayer();
    $('#turn-display').hide(0, function() {
      $(this).text(`${gameController.getCurrentPlayer().sign}\'s turn`).show();
    });
  };
  
  // Populate board
  (() => {
    for (let row = 0; row < 3; row++) {
      board.push([]);
      for (let col = 0; col < 3; col++) {
        board[row].push('');
        $('<div>', {
          'data-row': row,
          'data-col': col,
          'class': 'tile',
          'role': 'button'
        }).append($('<p>'))
          .appendTo('#board')
          .click(tileClicked);
      }
    }
  })();

  return {
  }
})();