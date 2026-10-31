BEGIN;
CREATE SCHEMA IF NOT EXISTS daloy;
CREATE TABLE IF NOT EXISTS daloy.workspaces (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS daloy.workflows (
  workspace_id uuid NOT NULL REFERENCES daloy.workspaces(id) ON DELETE CASCADE,
  id text NOT NULL,
  position integer NOT NULL,
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  PRIMARY KEY (workspace_id, id)
);
CREATE TABLE IF NOT EXISTS daloy.connections (
  workspace_id uuid NOT NULL REFERENCES daloy.workspaces(id) ON DELETE CASCADE,
  id text NOT NULL,
  position integer NOT NULL,
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  PRIMARY KEY (workspace_id, id)
);
CREATE TABLE IF NOT EXISTS daloy.executions (
  workspace_id uuid NOT NULL REFERENCES daloy.workspaces(id) ON DELETE CASCADE,
  id text NOT NULL,
  position integer NOT NULL,
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  PRIMARY KEY (workspace_id, id)
);
COMMIT;
