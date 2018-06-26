<?php session_start() ?>
<?php require('php-chunks/connect-database.php'); ?>
<?php require('php-chunks/login-redirect.php') ?>
<!DOCTYPE html>
<html>
	<head>
		<title>Choreboard</title>
		<?php require('php-chunks/header.php'); ?>
<?php
$name = $_SESSION['name'];
$password = $_SESSION['password'];
foreach ($db->query("SELECT is_admin FROM users WHERE name='$name'") as $row) {
	if ($row['is_admin']) {
		// echo "<p>including admin-dashboard</p>";
		require('php-chunks/admin-dashboard.php');
	} else {
		// echo "<p>including user-dashboard</p>";
		require('php-chunks/user-dashboard.php');
	}
}
?>
	</body>
</html>
