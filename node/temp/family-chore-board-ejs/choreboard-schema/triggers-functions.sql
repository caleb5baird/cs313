--  Insert Transaction
CREATE FUNCTION insert_transaction() RETURNS trigger AS $insert_transaction$
BEGIN
	update users set account_balance = account_balance + NEW.amount where id=NEW.user_id;
	update transactions set new_balance = (SELECT account_balance FROM users WHERE id = NEW.user_id)
	WHERE id=NEW.id;
	RETURN NEW;
END;
$insert_transaction$ LANGUAGE plpgsql;
CREATE TRIGGER insert_transaction AFTER INSERT ON transactions
FOR EACH ROW EXECUTE PROCEDURE insert_transaction();

--  update chore_to_user
CREATE FUNCTION update_chore_to_user() RETURNS trigger AS $update_chore_to_user$
	DECLARE
	amount real;
	BEGIN
		--  if the only thing that has changed is setting it to done make the transaction
		IF NEW.chore_completed != OLD.chore_completed AND NEW.chore_completed = TRUE
			AND NEW.user_id = OLD.user_id AND NEW.chore_id = OLD.chore_id
			THEN
			amount := (SELECT choredough FROM chores WHERE id=NEW.chore_id);
			INSERT INTO transactions (amount, user_id, chore_id, new_balance, description)
			VALUES (amount, NEW.user_id, NEW.chore_id,
				(SELECT account_balance FROM users WHERE id=NEW.user_id) + amount,
				(SELECT name FROM chores WHERE id=NEW.chore_id));
			--  and complete all children tasks
			UPDATE task_to_chore SET task_completed = true WHERE chore_id = NEW.chore_id;

			--  if all the chores are done add to the streak
			IF NOT EXISTS(SELECT id FROM chores_to_users WHERE user_id=NEW.user_id AND chore_completed=false)
				THEN UPDATE users SET streak = streak + 1 WHERE id=NEW.user_id;
		END IF;
END If;
--  if the only thing that has changed is setting the status to not done than add a negative
--  transaction.
IF NEW.chore_completed != OLD.chore_completed AND NEW.chore_completed = FALSE
	AND NEW.user_id = OLD.user_id AND NEW.chore_id = OLD.chore_id
	THEN
	amount := (SELECT choredough FROM chores WHERE id=NEW.chore_id);
	INSERT INTO transactions (amount, user_id, chore_id, new_balance, description)
	VALUES (-amount, NEW.user_id, NEW.chore_id,
		(SELECT account_balance FROM users WHERE id=NEW.user_id) - amount,
		(SELECT name FROM chores WHERE id=NEW.chore_id));
	--  if all the chores were done than we need to take one away from the streak
	IF NOT EXISTS(SELECT id FROM chores_to_users WHERE user_id=NEW.user_id AND chore_completed=false AND chore_id!=NEW.chore_id)
		THEN UPDATE users SET streak = streak - 1 WHERE id=NEW.user_id;
	END IF;
END If;
RETURN NEW;
END;
$update_chore_to_user$ LANGUAGE plpgsql;
CREATE TRIGGER update_chore_to_user AFTER UPDATE ON chores_to_users
FOR EACH ROW EXECUTE PROCEDURE update_chore_to_user();
