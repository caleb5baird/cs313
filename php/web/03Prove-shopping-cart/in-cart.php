<?php session_start() ?>
<?php
$id = $_POST["id"];
if (!isset($_SESSION["serviceId"])) { $_SESSION["serviceId"] = array(); }
array_push($_SESSION["serviceId"], $id);
?>

<!DOCTYPE html>
<html>
	<body>
<?php
echo "<p>Adding item $id to cart</p>";
echo "<p>Currently in cart";
foreach ($_SESSION["serviceId"] as $service ) {
	echo "$service, ";
}
echo "</p>";
?>
	</body>
</html>

