<?php require("php-chunks/connect-database.php"); ?>
<?php

$query = "SELECT id, name, number FROM course";

$statement = $db->prepare($query);
//bind variables that I need to use
//
$statement->execute();
$courses = $statement->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>
	<head>
		<title>Index</title>
		<?php require("php-chunks/header.php"); ?>
		<h1>Courses</h1>

<?php
foreach ($courses as $course) {
	$id = $course["id"];
	$name = $course["name"];
	$number = $course["number"];
	echo "<li><a href='course-details.php?course_id=$id'>$number - $name</a></li>\n";
}

?>
	</body>
</html>
