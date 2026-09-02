-- SHEIN with Rejo — Supabase/PostgreSQL production schema
-- This migration mirrors the backend contract in backend/src/schema.sql.
-- The Express API connects to PostgreSQL server-side; the browser never receives
-- the database password or a service-role credential.

CREATE TABLE IF NOT EXISTS customers (
  id               BIGSERIAL PRIMARY KEY,
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  phone_normalized TEXT NOT NULL,
  email            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS customers_phone_normalized_idx
  ON customers (phone_normalized);

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
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT orders_status_check CHECK (
    status IN ('pending', 'reviewed', 'priced', 'paid', 'ordered', 'shipped', 'delivered', 'cancelled')
  ),
  CONSTRAINT orders_payment_status_check CHECK (
    payment_status IN ('pending', 'awaiting_confirmation', 'confirmed')
  )
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders (payment_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id);

CREATE TABLE IF NOT EXISTS order_items (
  id         BIGSERIAL PRIMARY KEY,
  order_id   BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  url        TEXT,
  size       TEXT,
  color      TEXT,
  quantity   INTEGER NOT NULL DEFAULT 1,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT order_items_quantity_check CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

CREATE TABLE IF NOT EXISTS order_item_screenshots (
  id            BIGSERIAL PRIMARY KEY,
  order_item_id BIGINT NOT NULL REFERENCES order_items (id) ON DELETE CASCADE,
  filename      TEXT NOT NULL,
  size_bytes    BIGINT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT screenshot_size_check CHECK (size_bytes IS NULL OR size_bytes > 0)
);

CREATE INDEX IF NOT EXISTS order_item_screenshots_item_idx
  ON order_item_screenshots (order_item_id);

CREATE TABLE IF NOT EXISTS order_status_history (
  id              BIGSERIAL PRIMARY KEY,
  order_id        BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status      TEXT NOT NULL,
  changed_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT status_history_new_status_check CHECK (
    new_status IN ('pending', 'reviewed', 'priced', 'paid', 'ordered', 'shipped', 'delivered', 'cancelled')
  )
);

CREATE INDEX IF NOT EXISTS order_status_history_order_idx
  ON order_status_history (order_id, created_at);

CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keep updated_at reliable even if a future code path forgets to set it.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS customers_set_updated_at ON customers;
CREATE TRIGGER customers_set_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS orders_set_updated_at ON orders;
CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Defense in depth: tables are not publicly readable through Supabase's Data API.
-- The Express backend uses the server-side PostgreSQL connection instead.
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
