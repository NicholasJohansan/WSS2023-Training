<?php
  $board = [];

  function regenerate_board() {
    global $board;
    $board = [];
    for ($i = 0; $i < 6; $i++) {
      array_push($board, []);
      for ($j = 0; $j < 6; $j++) {
        array_push($board[$i], 0);
      }
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

  function checkBox($num, $row, $col) {
    global $board, $box_groups;
    $box_id = strval($row) . '-' . strval($col);
    // function filter($var) {
    //   global $box_id;
    //   return in_array($box_id, $var);
    // }
    $found_nums = [];
    
    // echo $box_id;
    $box_group = array_values(array_filter($box_groups, function($var) use ($box_id) {
      return in_array($box_id, $var);
    }))[0];
    // echo '{ ' . $box_id . '}';
    // echo '[';
    if ($box_group) {
      foreach ($box_group as $board_box_id) {
        // echo ' ' . $board_box_id . ' ';
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
    // echo ']';
    return in_array($num, $found_nums);
  }

  function checkColumns($num, $row, $col) {
    global $board;
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

  function checkRows($num, $row, $col) {
    global $board;
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

  $valid = false;

  while (!($valid)) {
    regenerate_board();
    $flagged = false;
    for ($i = 0; $i < 6; $i++) {
      for ($j = 0; $j < 6; $j++) {
        $available = [1, 2, 3, 4, 5, 6];
        $got_num = false;
        // echo ' n ';
        while ($got_num === false) {
          // echo ' s<br>';
          if (!($available)) {
            $flagged = true;
            continue;
          } else {
            $rand_index = array_rand($available);
            $num_chosen = $available[$rand_index];
    
            if (!(checkRows($num_chosen, $i, $j)) and !(checkColumns($num_chosen, $i, $j)) and !(checkBox($num_chosen, $i, $j))) {
              $board[$i][$j] = $num_chosen;
              $got_num = true;
              // echo '<br> c <br>';
              // echo $num_chosen;
              // echo '<br> c <br>';
              break;
            } else {
              $available = array_filter($available, function($var) {
                global $num_chosen;
                return $var !== $num_chosen;
              });
            }
          }
        }
      }
    }
    if (!($flagged)) {
      $valid = true;
    }
  }
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