<?php session_start() ?>
<?php require('../php-chunks/connect-database.php'); ?>
<?php
if (isset($_POST['name'])) {
	$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
}
if (isset($_POST['password'])) {
	$password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
}

var_dump($_POST);
echo "<br><br>";
var_dump($_SESSION);
echo "<br><br>";
try {
	$query = 'SELECT name, password FROM users WHERE name=:name';
	$stmt = $db->prepare($query);
	$stmt->bindValue(":name", $name, PDO::PARAM_STR);
	$stmt->execute();
	$row = $stmt->fetch();

	if (password_verify($password, $row['password'])) {
		$_SESSION['name'] = $name;
		$_SESSION['loggedIn'] = true;
		echo "<br><br>";
		var_dump($_SESSION);
		echo "<br><br>";
		header("Location: ../choreboard.php");
		exit();
	}
} catch (PDOException $ex) {
	echo "Error: $ex";
}

$_SESSION['loggedIn'] = false;
header("Location: ../login-page.php");
exit();

?>
