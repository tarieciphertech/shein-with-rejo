ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE admin_users
SET must_change_password = TRUE
WHERE must_change_password IS NULL;
