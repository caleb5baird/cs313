<?php
$query = "SELECT id FROM users WHERE name=:name";
$statement = $db->prepare($query);
$statement->bindValue(":name", $name, PDO::PARAM_STR);
$statement->execute();
$userId = $statement->fetch();
$userId = $userId['id'];
echo "<div class='choreboardHeader'>";
	$streakQuery = "SELECT streak FROM users WHERE name=:name";
	$streakStatement = $db->prepare($streakQuery);
	$streakStatement->bindValue(":name", $name, PDO::PARAM_STR);
	$streakStatement->execute();
	$streak = $streakStatement->fetch();
	$streak = $streak['streak'];
	echo "<a href='account-history.php?userId=$userId' class='balance'>";
	try {
		$bal = $db->query("SELECT account_balance FROM users WHERE id=$userId");
		$balance = $bal->fetch();
		$balance = $balance['account_balance'];
		echo "Account Balance = $$balance";
	} catch (PDOException $ex) {
		echo "Error: exception = $ex";
	}
	echo "</a>";
	if($streak > 1) {
		echo "<span class='streak'>$streak day streak!</span>";
	}
	echo "<div class='dropdown'>";
		echo "<div class='name'>$name</div>";
		echo "<div class='dropdown-content'>";
			echo "<a href='php/logout.php'>Log Out</a>";
		echo "</div>";
	echo "</div>";
echo "</div>";
echo "<div class='choreboard'>";
	echo "<div class='choreCategory'>";
		echo "<h3>To Do:</h3>";
		echo "<ul class='chores' id='$userId-toDo'>";
		// Each category will select the same columns from the same tables.
		$choreSelect = "SELECT c.name AS name, c.id, u.id AS userId FROM users u
			INNER JOIN chores_to_users ctu ON u.id=ctu.user_id
			INNER JOIN chores c ON ctu.chore_id=c.id ";
			// Do the thigs specific to toDo
			$category = "toDo";
			$choreWhere = "WHERE ctu.chore_completed=false AND u.id=$userId ORDER BY ctu.id";
			$bindName = true;
			$choreQuery = $choreSelect . $choreWhere;
			require("php-chunks/displayChores.php");
		echo "</ul>";
	echo "</div>";
	echo "<div class='choreCategory'>";
		echo "<h3>Done:</h3>";
		echo "<ul class='chores' id='$userId-done'>";
				// Do the thigs specific to done
				$category = "done";
				$choreWhere = "WHERE ctu.chore_completed=true AND u.id=$userId ORDER BY ctu.id";
				$bindName = true;
				$choreQuery = $choreSelect . $choreWhere;
			require("php-chunks/displayChores.php");
		echo "</ul>";
	echo "</div>";
	echo "<div class='choreCategory'>";
		echo "<h3>Additional Chores:</h3>";
		echo "<ul class='chores' id='$userId-additionalChores'>";
				// Do the thigs specific to additionalChores
				$category = "additionalChores";
				$bindName = false;
				$choreQuery = "SELECT name, id FROM chores WHERE id NOT IN (SELECT chore_id FROM chores_to_users) ORDER BY id";
			require("php-chunks/displayChores.php");
		echo "</ul>";
	echo "</div>";
echo "</div>";
?>
