<?php
$courseId = htmlspecialchars($_GET["courses_id"]);
?>
<!DOCTYPE html>
<html>
	<head>
	<title>Course details</title>
		<?php require("php-chunks/header.php"); ?>
<?php echo $courseId ?>
	<form action="insert-note.php" method="POST" accept-charset="utf-8">
		<input type="hidden" name="course_id" id="course_id" value="<?php echo $courseId ?>" />
		<input type="date" name="date" id="date" placeholder="mm/dd/yy" /><br>
		<textarea name="content" placeholder="Content"></textarea><br>
		<input type="submit" value="Add Note" />


	</form>
	</body>
</html>
