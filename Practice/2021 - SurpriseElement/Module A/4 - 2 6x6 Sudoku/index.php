<?php

  $board = [];
  for ($i = 0; $i < 6; $i++) {
    array_push($board, []);
    for ($j = 0; $j < 6; $j++) {
      array_push($board[$i], 0);
    }
  }

  $box_groups = [
    [
      '0-0', '0-1', '0-2',
      '1-0', '1-1', '1-2'
    ],
    [
      '2-0', '2-1', '2-2',
      '3-0', '3-1', '3-2'
    ],
    [
      '4-0', '4-1', '4-2',
      '5-0', '5-1', '5-2'
    ],
    [
      '0-3', '0-4', '0-5',
      '1-3', '1-4', '1-5'
    ],
    [
      '2-3', '2-4', '2-5',
      '3-3', '3-4', '3-5'
    ],
    [
      '4-3', '4-4', '4-5',
      '5-3', '5-4', '5-5'
    ]
  ];

  function checkBox($num, $row, $col, $board) {
    global $box_groups;
    $box_id = strval($row) . '-' . strval($col);
    $found_nums = [];
    $box_group = array_values(array_filter($box_groups, function($var) use ($box_id) {
      return in_array($box_id, $var);
    }))[0];
    if ($box_group) {
      foreach ($box_group as $board_box_id) {
        if ($board_box_id === $box_id) {
          continue;
        }
        $row_col = explode('-', $board_box_id);
        $row = intval($row_col[0]);
        $col = intval($row_col[1]);
        $board_num = $board[$row][$col];
        if (!(in_array($board_num, $found_nums)) and $num !== 0) {
          array_push($found_nums, $board_num);
        }
      }
    }
    return in_array($num, $found_nums);
  }

  function checkColumns($num, $row, $col, $board) {
    $found_nums = [];
    for ($i = 0; $i < 6; $i++) {
      if ($i === $row) {
        continue;
      }
      $board_num = $board[$i][$col];
      if (!(in_array($board_num, $found_nums)) and $num !== 0) {
        array_push($found_nums, $board_num);
      }
    }
    return in_array($num, $found_nums);
  }

  function checkRows($num, $row, $col, $board) {
    $found_nums = [];
    for ($i = 0; $i < 6; $i++) {
      if ($i === $col) {
        continue;
      }
      $board_num = $board[$row][$i];
      if (!(in_array($board_num, $found_nums)) and $num !== 0) {
        array_push($found_nums, $board_num);
      }
    }
    return in_array($num, $found_nums);
  }

  
  function board_is_valid($num, $row, $col, $board) {
    return (!(checkRows($num, $row, $col, $board)) and !(checkColumns($num, $row, $col, $board)) and !(checkBox($num, $row, $col, $board)));
  }

  function recurse($board, $row, $col, $root = true) {
    $available = [1, 2, 3, 4, 5, 6];
    shuffle($available);
    while ($available) {
      $num_chosen = array_pop($available);
      if (board_is_valid($num_chosen, $row, $col, $board)) {
        $new_board = $board;
        $new_board[$row][$col] = $num_chosen;
        $new_col = 0;
        $new_row = 0;
        if ($row === 5 and $col === 5) {
          return $new_board;
        } else if ($col === 5) {
          $new_col = 0;
          $new_row = $row + 1;
        } else {
          $new_col = $col + 1;
          $new_row = $row;
        }
        
        $new_board = recurse($new_board, $new_row, $new_col);
        if ($new_board) {
          $board = $new_board;
          return $board;
        };
      };
    }
    return null;
  }
  $board = recurse($board, 0, 0);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="board">
    <?php for ($i = 0; $i < 6; $i++): ?>
      <div class="row">
        <?php for ($j = 0; $j < 6; $j++): ?>
          <div class="tile"><?= $board[$i][$j] ?></div>
        <?php endfor ?>
      </div>
    <?php endfor ?>
  </div>
</body>
</html>