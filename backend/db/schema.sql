-- create enum type for todo state (safeguard against existing type)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'todo_state') THEN
    CREATE TYPE todo_state AS ENUM ('INCOMPLETE', 'COMPLETE');
  END IF;
END $$;

-- Create table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  state todo_state NOT NULL DEFAULT 'INCOMPLETE',
  description text NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL
);

