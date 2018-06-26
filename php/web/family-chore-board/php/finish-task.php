<?php require('../php-chunks/connect-database.php'); ?>
<?php
$taskId = htmlspecialchars($_POST['taskId']);
$choreId = htmlspecialchars($_POST['choreId']);

$query = "UPDATE task_to_chore
				SET task_completed=true WHERE chore_id=:choreId AND task_id=:taskId";
try {
	$statement = $db->prepare($query);
	$statement->bindValue(":choreId", $choreId, PDO::PARAM_INT);
	$statement->bindValue(":taskId", $taskId, PDO::PARAM_INT);
	echo "i got here<br><br>";

	$statement->execute();
} catch (PDOException $ex){
	echo "Error: exception thrown. Exception = " . $ex;
}

die();

?>
