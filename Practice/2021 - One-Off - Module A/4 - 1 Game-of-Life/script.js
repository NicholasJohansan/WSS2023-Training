let input = document.querySelector('#input');
let output = document.querySelector('#output');
let submitButton = document.querySelector('button');

let cellMaker = function(live, row, col) {
  return {
    row,
    col,
    live
  }
}

let gridMaker = function(inputText) {
  let lines = inputText.split('\n');
  let [rows, cols] = lines[0].split(' ').map(val => parseInt(val));
  let grid = [];
  for (let row = 0; row < rows; row++) {
    let rowLine = lines[row+1];
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
  const getAdjacentCells = function(cell) {
    let { row, col } = cell;
    let adjacentCells = [];
    let possibleAdjacentCells = [
      [row-1, col-1], [row-1, col], [row-1, col+1],
      [row  , col-1],               [row  , col+1],
      [row+1, col-1], [row+1, col], [row+1, col+1]
    ];
    for (let possibleAdjacentCell of possibleAdjacentCells) {
      let [ row, col ] = possibleAdjacentCell;
      if ((row >= 0 && row < grid.length) && (col >= 0 && col < grid[cell.row].length)) {
        adjacentCells.push(grid[row][col]);
      }
    }
    return adjacentCells;
  }
  const processCell = function(cell, adjacentCells) {
    adjacentLiveCells = adjacentCells.filter(cell => cell.live);
    livingAdjacentCells = adjacentLiveCells.length;
    if (cell.live) {
      let living = !(livingAdjacentCells < 2 || livingAdjacentCells > 3);
      return cellMaker(
        living,
        cell.row,
        cell.col
      )
    } else {
      if (livingAdjacentCells === 3) {
        return cellMaker(
          true,
          cell.row,
          cell.col
        )
      }
    }
    return cell
  }
  const step = function() {
    let newGrid = [];
    for (let row = 0; row < grid.length; row++) {
      newGrid.push([]);
      for (let col = 0; col < grid[row].length; col++) {
        let cell = grid[row][col];
        let adjacentCells = getAdjacentCells(cell);
        newGrid[row].push(processCell(cell, adjacentCells));
      }
    }
    grid = newGrid;
  }
  const getString = function() {
    let lines = grid.map(row => row.map(cell => cell.live ? 'X' : '0').join(''));
    return `${rows} ${cols}\n${lines.join('\n')}`;
  }
  return {
    rows,
    cols,
    grid,
    step,
    getString
  }
}

submitButton.onclick = function() {
  let grid = gridMaker(input.value);
  grid.step();
  output.value = grid.getString();
}