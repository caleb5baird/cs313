<h1>Welcome <?php echo $name ?>!</h1>

<?php
$adminName = $name;
foreach ($db->query("SELECT name, id FROM users WHERE is_admin=false ORDER BY id") as $kid) {
	$name = $kid['name'];
	$id = $kid['id'];
	require('php-chunks/user-dashboard.php');
}
?>






