<?php
	try {
	$dbHost = "localhost";
	$dbPort = 5432;
	$dbUser = "postgres";
	$dbPassword = "quieroPasar 198691";
	$dbName = "postgres";
	echo "<p>I got to here</p>";

	$db = new PDO("pgsql:host=$dbHost;port=$dbPort;dbname=$dbName", $dbUser, $dbPassword);

	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch (PDOException $ex){
	echo "<p>Error: exception thrown. Exception = " . $ex . "</p>";
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width" />
		<title>Cinema</title>
	</head>
	<body>
		<h1>Movies</h1>
	</body>
</html>
