<?php session_start() ?>
<?php
if (isset( $_SESSION["serviceId"])){
	unset($_SESSION["serviceId"]);
}
$url="/index.php";
echo '<META HTTP-EQUIV=REFRESH CONTENT="1; '.$url.'">';
?>
