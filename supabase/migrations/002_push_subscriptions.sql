-- Push subscriptions table
-- Stores one row per browser/device per user.
-- A user can have multiple subscriptions (phone + tablet, etc.)

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint   TEXT        NOT NULL,
  p256dh     TEXT        NOT NULL,
  auth       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON push_subscriptions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX idx_push_subscriptions_user ON push_subscriptions (user_id);
