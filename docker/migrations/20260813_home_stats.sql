CREATE TABLE IF NOT EXISTS page_views (
  id          UUID        PRIMARY KEY,
  visitor_id  UUID        NOT NULL,
  path        TEXT        NOT NULL CHECK (char_length(path) BETWEEN 1 AND 500),
  visited_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);

CREATE TABLE IF NOT EXISTS home_stats_settings (
  singleton                       BOOLEAN     PRIMARY KEY DEFAULT true CHECK (singleton),
  page_visit_baseline             BIGINT      NOT NULL CHECK (page_visit_baseline >= 0),
  page_visit_tracking_started_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO home_stats_settings (singleton, page_visit_baseline)
VALUES (true, 1025)
ON CONFLICT (singleton) DO NOTHING;
