-- SHEIN with Rejo — database schema (idempotent)

CREATE TABLE IF NOT EXISTS customers (
  id               BIGSERIAL PRIMARY KEY,
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  phone_normalized TEXT NOT NULL,
  email            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS customers_phone_normalized_idx ON customers (phone_normalized);

CREATE TABLE IF NOT EXISTS orders (
  id             BIGSERIAL PRIMARY KEY,
  reference      TEXT NOT NULL UNIQUE,
  customer_id    BIGINT NOT NULL REFERENCES customers (id),
  delivery_area  TEXT NOT NULL,
  delivery_notes TEXT,
  contact_method TEXT NOT NULL DEFAULT 'WhatsApp',
  status         TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  admin_notes    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id         BIGSERIAL PRIMARY KEY,
  order_id   BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  url        TEXT,
  size       TEXT,
  color      TEXT,
  quantity   INTEGER NOT NULL DEFAULT 1,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

CREATE TABLE IF NOT EXISTS order_item_screenshots (
  id            BIGSERIAL PRIMARY KEY,
  order_item_id BIGINT NOT NULL REFERENCES order_items (id) ON DELETE CASCADE,
  filename      TEXT NOT NULL,
  size_bytes    BIGINT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_item_screenshots_item_idx ON order_item_screenshots (order_item_id);

CREATE TABLE IF NOT EXISTS order_status_history (
  id              BIGSERIAL PRIMARY KEY,
  order_id        BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status      TEXT NOT NULL,
  changed_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_status_history_order_idx ON order_status_history (order_id, created_at);

CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
