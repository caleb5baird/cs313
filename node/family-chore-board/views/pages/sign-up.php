<?php session_start() ?>
<?php require('../php-chunks/connect-database.php'); ?>
<?php
if (isset($_POST['name'])) {
	$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
}
if (isset($_POST['password'])) {
	$password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
	$hashPassword = password_hash($password, PASSWORD_DEFAULT);
}
echo "password = $password<br><br>";
echo "hashPassword = $hashPassword<br><br>";
try {
	$query = 'INSERT INTO users (name, password) VALUES (:name, :password)';
	$stmt = $db->prepare($query);
	$stmt->bindValue(":name", $name, PDO::PARAM_STR);
	$stmt->bindValue(":password", $hashPassword, PDO::PARAM_STR);
	$stmt->execute();

	echo "I got here";
	$_SESSION['name'] = $name;
	$_SESSION['loggedIn'] = true;
	header("Location: ../choreboard.php");
	exit();
} catch (PDOException $ex) {
	echo "Error: $ex";
}

$_SESSION['loggedIn'] = false;
header("Location: ../login-page.php");
exit();

?>
