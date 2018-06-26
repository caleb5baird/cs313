<?php session_start() ?>
<!DOCTYPE html>
<html>
	<head>
		<title>BiCode Services</title>
		<?php include("header.php") ?>
		<?php include("services.php") ?>
		<?php $service_ids = $_SESSION["serviceId"]; ?>
			<form action="confirmation.php" method="POST" onsubmit="return validate()" onreset="setFocus('fName')">
				<h1>My Cart</h1>
				<h2>Services</h2>
				<table class="services">
					<?php
						$totalPrice = 0;
			if (isset ($service_ids)){
				foreach ($service_ids as $id) {
					echo "<tr>";
					echo "<td><button class='cart-button' onclick=\"removeFromCart('".$id."')\">Delete</button></td>";
					echo "<td class='descript'>".$services[$id]['description']."</td>";
					echo "<td>\$".$services[$id]['price']."</td>";
					echo "</tr>";
					$totalPrice += $services[$id]["price"];
				}
			}
					?>
					<tr>
						<td></td>
						<td style="text-align: right">Total:</td>
						<td>$<?php echo $totalPrice ?></td>
					</tr>
				</table>
				<br>
				<h2>Check Out</h2>
				<hr>
				<h2>Shipping Information</h2>
				<div>
					<input type="text" name="fName" id="fName" placeholder="First Name" onblur="noText('fName')">
					<input type="text" name="lName" id="lName" placeholder="Last Name" onblur="noText('lName')">
					<input type="text" name="phoneNumber" id="phone" placeholder="Phone Number" onKeyUp='addPhoneDashes(this)' onblur="phoneNumberIsBad(this)" />
				</div>
				<div>
					<input type="text" name="street" id="address" placeholder="Address" onblur="noText('address')">
					<input type="text" name="city" id="city" placeholder="City" onblur="noText('city')">
					<select id="state" name="state" onblur="noState()">
						<option>-State-</option>
					<?php
						include("states.php");
						foreach ($states as $state) {
						echo "<option>$state</option>";
						}
					?>
					</select>
				</div>
				<input type="submit" value="Checkout">
				<a id="continue-shopping" href="index.php">Continue Shopping</a>
			</form>
