let input = document.querySelector('#input');
let output = document.querySelector('#output');
let submitButton = document.querySelector('button');

let cellMaker = function(hasQueen, row, col) {
  return {
    row,
    col,
    hasQueen
  }
}

let gridMaker = function(inputText) {
  let lines = inputText.replaceAll(' ', '').split('\n');
  let grid = [];
  let [rows, cols] = [8, 8];
  for (let row = 0; row < rows; row++) {
    let rowLine = lines[row];
    grid.push([]);
    for (let col = 0; col < cols; col++) {
      let cell = rowLine[col];
      grid[row].push(cellMaker(
        cell === 'X',
        row,
        col
      ))
    }
  }
  const recurseNextCell = function(nextLocationFunction, cell) {
    let [row, col] = nextLocationFunction(cell.row, cell.col);
    if (!((row >= 0 && row < rows) && (col >= 0 && col < cols))) return false;
    cell = grid[row][col];
    if (cell.hasQueen) return true;
    return recurseNextCell(nextLocationFunction, cell);
  }
  const checkAttacks = function(cell) {
    let nextLocationFunctions = [
      (row, col) => [row-1, col-1], //topleft
      (row, col) => [row-1, col  ], //top
      (row, col) => [row-1, col+1], //topright
      (row, col) => [row  , col-1], //left
      (row, col) => [row  , col+1], //right
      (row, col) => [row+1, col-1], //botleft
      (row, col) => [row+1, col  ], //bot
      (row, col) => [row+1, col+1]  //botright
    ]
    let results = nextLocationFunctions.map(func => recurseNextCell(func, cell));
    return results.some(found => found);
  }
  const getAttackingRows = function() {
    let attackingRows = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        let cell = grid[row][col];
        if (!cell.hasQueen) continue;
        if (checkAttacks(cell)) {
          if (!attackingRows.includes(cell.row+1)) {
            attackingRows.push(cell.row+1);
          }
        }
      }
    }
    return attackingRows;
  }
  return {
    rows,
    cols,
    grid,
    getAttackingRows
  }
}

submitButton.onclick = function() {
  let grid = gridMaker(input.value);
  let attackingRows = grid.getAttackingRows();
  output.textContent = `Row contains Queens attacking each other: ${attackingRows.join(',') || '-'}`
}