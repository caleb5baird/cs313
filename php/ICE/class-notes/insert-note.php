<?php
$courseId = htmlspecialchars($_POST["course_id"]);
$date = htmlspecialchars($_POST["date"]);
$content = htmlspecialchars($_POST["content"]);
?>
<?php require("php-chunks/connect-database.php"); ?>
<?php
$query = "INSERT INTO note (course_id, content, date) VALUES
	(:courseID, :content, :date)";

$statement = $db->prepare($query);

$statement->bindValue(":courseID", $courseId);
$statement->bindValue(":content", $content);
$statement->bindValue(":date", $date);


	header("Location: course-details.php?course_id=$couseId");
	die();
?>
