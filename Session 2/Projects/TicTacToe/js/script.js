const gameBoard = (function() {
  let boardElement = $('#board');
  let board = [];
  
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
        }).appendTo('#board');
      }
    }
  })();

  return {
  }
})();