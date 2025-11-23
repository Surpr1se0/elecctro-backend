-- create enum type for todo state (safeguard against existing type)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'todo_state') THEN
    CREATE TYPE todo_state AS ENUM ('INCOMPLETE', 'COMPLETE');
  END IF;
END $$;

-- Create table todos
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  state todo_state NOT NULL DEFAULT 'INCOMPLETE',
  description text NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL
);

-- Create user table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Add column user_id to todos table
ALTER TABLE todos
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;