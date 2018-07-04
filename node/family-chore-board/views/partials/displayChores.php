<?php
try {
	$statement = $db->prepare($choreQuery);
	$statement->execute();
	foreach ($statement as $choreRow) {
	// foreach ($db->query($choreQuery) as $choreRow) {
		$choreName = $choreRow['name'];
		$choreId = $choreRow['id'];
		echo "<li id='chore-$choreId'>";
		echo "<span>$choreName<a ";
		if ($category == "toDo"){
			echo "class='button'>Done</a></span>";
		} elseif ($category == "done") {
			echo "class='button done'>Done</a></span>";
		} elseif ($category == "additionalChores") {
			echo "class='button'>Take</a></span>";
		}
			echo "<hr>";
			echo "<input type='hidden' name='userId' id='userId' value='$userId' />";
			echo "<ul class='tasks'>";
				$taskQuery = "SELECT t.description AS task, t.id AS taskId, ttc.task_completed AS completed FROM tasks t
					INNER JOIN task_to_chore ttc ON t.id = ttc.task_id
					INNER JOIN chores c ON ttc.chore_id = c.id
					WHERE c.id='$choreId' ORDER BY t.id";
				foreach ($db->query($taskQuery) as $taskRow) {
					// var_dump($taskRow);
					$task = $taskRow['task'];
					$taskId = $taskRow['taskid'];
					$completed = $taskRow['completed'];
					$checked = $completed ? 'checked' : '';
					echo "<li id='task-li-$taskId'>";
						echo "<input type='checkbox' name='tasks[]' id='task-$taskId' $checked/>";
						echo "<label for='$task'>$task</label>";
					echo "</li>";
				}
			echo "</ul>";
		echo "</li>";
	}
} catch (PDOException $ex) {
	echo "Error: exception = $ex";
}
?>
