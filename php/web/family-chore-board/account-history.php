<?php session_start() ?>
<?php include('php-chunks/connect-database.php'); ?>
<?php include('php-chunks/login-redirect.php') ?>

<?php
try {
	//Get userId
	$userId = htmlspecialchars($_GET['userId']);
	//Get name
	$query = "SELECT name FROM users WHERE id=:userId";
	$statement = $db->prepare($query);
	$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
	$statement->execute();
	$name = $statement->fetch();
	$name = $name['name'];
	//Get balance
	$query = "SELECT account_balance FROM users WHERE id=:userId";
	$statement = $db->prepare($query);
	$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
	$statement->execute();
	$balance = $statement->fetch();
	$balance = $balance['account_balance'];
} catch (PDOException $ex) {
	echo "Error: exception = $ex";
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Account history</title>
		<?php include('php-chunks/header.php') ?>
		<div class="heading">
		<?php
			echo "<a href='choreboard.php'>Back to Choreboard</a>";
			echo "<span>$name's Account</span>";
			echo "<span>$balance</span>";
		?>
		</div>
		<div class="table">
			<div class="tableHead row">
				<span class="date">Date</span>
				<span class="type"></span>
				<span class="description">Description</span>
				<span class="amount">Amount</span>
			</div>
			<?php
			  try {
			  $query = "SELECT date, type, description, amount, new_balance
			  FROM transactions WHERE user_id = :userId ORDER BY date DESC, id DESC";
			  $statement = $db->prepare($query);
			  $statement->bindValue(":userId", $userId, PDO::PARAM_INT);
			  $statement->execute();
			  $rows = $statement->fetchAll();
			  $alternate = 0;
			  foreach ($rows as $row) {
			  //set veriables
			  $date = $row['date'];
			  $type = $row['type'];
			  $description = $row['description'];
			  $amount = $row['amount'];
			  $newBalance = $row['new_balance'];
			  if ($alternate % 2 == 0)
			  echo "<div class='row dark'>";
				  else
				  echo "<div class='row light'>";
					  echo "<span class='date'>$date</span>";
					  // echo "<span class='type'>$type</span>";
					  echo "<span class='description'>$description</span>";
					  echo "<span class='amount'>";
						  echo "<span>$$amount</span>";
						  echo "<span>$$newBalance</span>";
						  echo "</span>";
					  echo "</div>";
				  $alternate++;
				  }
				  } catch (PDOException $ex) {
				  echo "Error: exception = $ex";
				  }
				  ?>
		</div>
	</body>
</html>
