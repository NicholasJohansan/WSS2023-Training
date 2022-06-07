<?php

$values = [];
$found_duplicate = true;
if (isset($_GET['roll'])) {
  for ($i = 0; $i < 5; $i++) {
    $values[$i] = random_int(1, 6);
  }

  $found_values = [];
  $found_duplicate = false;
  foreach ($values as $value) {
    if (in_array($value, $found_values)) {
      $found_duplicate = true;
      break;
    } else {
      array_push($found_values, $value);
    }
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
  <div id="container">
    <div id="rolls">
      <?php if ($values): ?>
        <?php foreach ($values as $value) { ?>
          <div class="roll"><?= $value ?></div>
        <?php } ?>
      <?php else: ?>
        <?php for ($i = 0; $i < 5; $i++) { ?>
          <div class="roll"></div>
        <?php } ?>
      <?php endif ?>
    </div>
    <?php if ($found_duplicate): ?>
      <p>To win, you have to get all numbers rolled to be different.</p>
    <?php else: ?>
      <p>Congrats, you have won!<p>
    <?php endif ?>
    <?php if ($found_duplicate): ?>
      <form method="get">
        <input type="text" name="roll" hidden>
        <input type="submit" value="Roll">
      </form>
    <?php endif ?>
  </div>
</body>
</html>