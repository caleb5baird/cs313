<?php require('../php-chunks/connect-database.php'); ?>
<?php
$choreId = htmlspecialchars($_POST['choreId']);
$userId = htmlspecialchars($_POST['userId']);

$query = "UPDATE chores_to_users
				SET chore_completed=true WHERE user_id=:userId AND chore_id=:choreId";
try {
	$statement = $db->prepare($query);
	$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
	$statement->bindValue(":choreId", $choreId, PDO::PARAM_INT);

	$statement->execute();
} catch (PDOException $ex){
	echo "Error: exception thrown. Exception = " . $ex;
}

die();

?>
