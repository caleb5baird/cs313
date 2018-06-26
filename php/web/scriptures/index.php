<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width" />
		<title>Scriptures</title>
	</head>
	<body>
		<form action="index_submit" method="get" accept-charset="utf-8">

		</form>

<?php
	include("php-chunks/connec-database.php");
	try {
	print "<p>pgsql:host=$dbHost;port=$dbPort;dbname=$dbName</p>\n\n";

	foreach ($db->query('SELECT book, chapter, verse, content FROM scripture') as $row)
	{
		echo "<p>";
		echo "<strong>";
		echo $row['book'] . ' ';
		echo $row['chapter'] . ':';
		echo $row['verse'];
		echo "</strong>";
		echo ' - "' . $row['content'] . '"';
		echo "</p>";
	}

?>
	</body>
</html>
