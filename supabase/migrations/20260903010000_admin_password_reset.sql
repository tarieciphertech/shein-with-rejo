CREATE TABLE IF NOT EXISTS admin_password_reset_tokens (
  id          BIGSERIAL PRIMARY KEY,
  admin_id    BIGINT NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_password_reset_tokens_admin_idx
  ON admin_password_reset_tokens (admin_id);

CREATE INDEX IF NOT EXISTS admin_password_reset_tokens_expiry_idx
  ON admin_password_reset_tokens (expires_at);
