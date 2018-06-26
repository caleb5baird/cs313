<?php session_start() ?>
<!DOCTYPE html>
<html>
	<head>
		<title>Home</title>
		<?php
$link="/assignments.php";
$page="Assignments";
if (!isset ($_SESSION["pageCount"])) {
	$_SESSION["pageCount"] = 0;
}
else {
	$_SESSION["pageCount"]++;
}
$count = $_SESSION["pageCount"];
?>
		<?php include("header.php") ?>
		<div class="content">
			<p>I was raised in a family of 9 children. I am originally from provo utah, then when I was
			about 14 we moved to mexico where we lived for just a year. Then we moved to Star Valley
			Wyoming. After graduating from High School I served for two years as a missionary in
			Tennessee. After my mission I worked for about three months on the cunstruction of the Star
			Valley Temple. Then moved to Rexburg for college.</p>
			<div>
				<h2>Classes I have taken:</h2>
				<div class="row">
					<div class="column">
						<p>FDREL 250</p>
						<p>FDREL 275</p>
						<p>FDREL 225</p>
						<p>ESS 100</p>
						<p>Music 315</p>
						<p>FDAMF 101</p>
					</div>
					<div class="column">
						<p>CS 124</p>
						<p>CS 165</p>
						<p>CS 213</p>
						<p>CS 235</p>
						<p>CS 237</p>
						<p>CS 246</p>
						<p>CS 313</p>
					</div>
					<div class="column">
						<p>CHEM 105</p>
						<p>CHEM 105L</p>
						<p>PH 121</p>
						<p>ECEN 150</p>
						<p>ECEN 160</p>
						<p>FDSCI 101</p>
					</div>
				</div>
<?php
echo "<span id=\"pageCount\">$count</span>";
?>
			</div>
		</div>
	</body>
</html>
