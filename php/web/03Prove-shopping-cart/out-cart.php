<?php session_start() ?>
<?php
$id = $_POST["id"];
if (isset( $_SESSION["serviceId"])){
	$key = array_search($id, $_SESSION["serviceId"]);
	if ($key !== false) {
		unset($_SESSION["serviceId"][$key]);
		$_SESSION["serviceId"] = array_values($_SESSION["serviceId"]);
	}
}

	echo " Removed item : $id ";
	echo "Currently in cart: ";
	foreach ($_SESSION["serviceId"] as $service ) {
		echo "$service, ";
	}
?>
