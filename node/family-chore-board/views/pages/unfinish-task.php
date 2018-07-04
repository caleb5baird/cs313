<?php require('../php-chunks/connect-database.php'); ?>
<?php
$taskId = htmlspecialchars($_POST['taskId']);
$choreId = htmlspecialchars($_POST['choreId']);
var_dump($_POST);

$query = "UPDATE task_to_chore
				SET task_completed=false WHERE chore_id=:choreId AND task_id=:taskId";
try {
	$statement = $db->prepare($query);
	$statement->bindValue(":choreId", $choreId, PDO::PARAM_INT);
	$statement->bindValue(":taskId", $taskId, PDO::PARAM_INT);

	$statement->execute();
	echo "i got here<br><br>";
} catch (PDOException $ex){
	echo "Error: exception thrown. Exception = " . $ex;
}

die();

?>
