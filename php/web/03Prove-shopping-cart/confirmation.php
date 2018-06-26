<?php session_start() ?>
<!DOCTYPE html>
<html>
	<head>
		<title>Order Confirmation</title>
		<?php include("header.php") ?>
		<?php include("services.php") ?>
		<?php $service_ids = $_SESSION["serviceId"]; ?>
			<form action="checkout.php">
				<h1>Order Confirmation</h1>
				<h2>Services</h2>
				<table class="services">
<?php
$totalPrice = 0;
if (isset ($service_ids)){
	foreach ($service_ids as $id) {
		echo "<tr>";
		echo "<td class='descript'>".$services[$id]['description']."</td>";
		echo "<td>\$".$services[$id]['price']."</td>";
		echo "</tr>";
		$totalPrice += $services[$id]["price"];
	}
}
?>
					<tr>
						<td style="text-align: right">Total:</td>
						<td>$<?php echo $totalPrice ?></td>
					</tr>
				</table>
				<hr>
				<h2>Ship To:</h2>
				<div id="ship-to">
<?php
echo "<p>" . $_POST["fName"] . " " . $_POST["lName"] . ", " . $_POST["phoneNumber"] . "</p>";
echo "<p>" . $_POST["street"] . " " . $_POST["city"] . ", " . $_POST["state"] . "</p>";

?>
					</p>
				</div>
				<input type="submit" value="Checkout">
				<a id="return-to-cart" href="cart.php">Return to Cart</a>
			</form>
