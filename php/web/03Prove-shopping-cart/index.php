<?php session_start() ?>
<!DOCTYPE html>
<html>
	<head>
		<title>BiCode Services</title>
		<?php include("header.php") ?>
		<?php include("services.php") ?>
		<h2>iPhone Repair</h2>
		<hr>
		<div class="items">
			<div class="item">
				<img src="images/iphone-screen-repair.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('iphoneSR')">Add to Cart</button>
						<span>$19.99 Screen Replacement</span>
					</div>
					<div class="button">
						<button onclick="addToCart('iphoneSRD')">Add to Cart</button>
						<span>$29.99 Screen Replacement With Digitizer</span>
					</div>
				</div>
			</div>
			<div class="item">
				<img src="images/iphone-battery-replacement.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('iphoneBR')">Add to Cart</button>
						<span>$24.99 Battery Replacement</span>
					</div>
				</div>
			</div>
		</div>
		<h2>iPad Repair</h2>
		<hr>
		<div class="items">
			<div class="item">
				<img src="images/ipad-screen-repair.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('ipadSR')">Add to Cart</button>
						<span>$29.99 Screen Replacement</span>
					</div>
					<div class="button">
						<button onclick="addToCart('ipadSRD')">Add to Cart</button>
						<span>$49.99 Screen Replacement With Digitizer</span>
					</div>
				</div>
			</div>
			<div class="item">
				<img src="images/ipad-battery-replacement.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('ipadBR')">Add to Cart</button>
						<span>$39.99 Battery Replacement</span>
					</div>
				</div>
			</div>
		</div>
		<h2>MacBook</h2>
		<hr>
		<div class="items">
			<div class="item">
				<img src="images/macbook-battery-replacement.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('MBR')">Add to Cart</button>
						<span>$69.99 Battery Replacement</span>
					</div>
				</div>
			</div>
			<div class="item">
				<img src="images/macbook-screen-repair.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('MSR')">Add to Cart</button>
						<span>$199.99 Screen Repair</span>
					</div>
				</div>
			</div>
			<div class="item">
				<img src="images/ram.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('8RU')">Add to Cart</button>
						<span>$59.99 8GB Ram Upgrade (2x4GB)</span>
					</div>
					<div class="button">
						<button onclick="addToCart('16RU')">Add to Cart</button>
						<span>$99.99 16GB Ram Upgrade (2x8GB)</span>
					</div>
				</div>
			</div>
			<div class="item">
				<img src="images/HDD.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('HDD500')">Add to Cart</button>
						<span>$39.99 HDD Upgrade (500GB)</span>
					</div>
					<div class="button">
						<button onclick="addToCart('HDD1')">Add to Cart</button>
						<span>$49.99 HDD Upgrade (1TB)</span>
					</div>
					<div class="button">
						<button onclick="addToCart('HDD2')">Add to Cart</button>
						<span>$69.99 HDD Upgrade (2TB)</span>
					</div>
				</div>
			</div>
			<div class="item">
				<img src="images/SSD.png" alt="" class="item-pic"/>
				<div class="text">
					<div class="button">
						<button onclick="addToCart('SSD256')">Add to Cart</button>
						<span>$79.99 SSD Upgrade (256GB)</span>
					</div>
					<div class="button">
						<button onclick="addToCart('SSD500')">Add to Cart</button>
						<span>$149.99 SSD Upgrade (500GB)</span>
					</div>
					<div class="button">
						<button onclick="addToCart('SSD1')">Add to Cart</button>
						<span>$289.99 SSD Upgrade (1TB)</span>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
