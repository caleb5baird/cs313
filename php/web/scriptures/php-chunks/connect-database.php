<?php
	try {
		$dbUrl = getenv('DATABASE_URL');
		if (!$dbUrl) { $dbUrl = 'postgres://postgres:@scriptures-pg:5432/postgres'; }

		$dbopts = parse_url($dbUrl);
		$dbHost = $dbopts["host"];
		$dbPort = $dbopts["port"];
		$dbUser = $dbopts["user"];
		$dbPassword = $dbopts["pass"];
		$dbName = ltrim($dbopts["path"],'/');

		$db = new PDO("pgsql:host=$dbHost;port=$dbPort;dbname=$dbName", $dbUser, $dbPassword);
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch (PDOException $ex){
		echo "Error: exception thrown. Exception = " . $ex;
	}
?>
