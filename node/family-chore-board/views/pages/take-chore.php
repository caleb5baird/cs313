<?php require('../php-chunks/connect-database.php'); ?>
<?php
$choreId = htmlspecialchars($_POST['choreId']);
$userId = htmlspecialchars($_POST['userId']);

$query = "INSERT INTO chores_to_users (chore_id, user_id) VALUES (:choreId, :userId)";
$statement = $db->prepare($query);
$statement->bindValue(":choreId", $choreId, PDO::PARAM_INT);
$statement->bindValue(":userId", $userId, PDO::PARAM_INT);

$statement->execute();

die();

?>
