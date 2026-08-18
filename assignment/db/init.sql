CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, done)
SELECT *
FROM (
    VALUES
        ('Study', false),
        ('Gym', true),
        ('Shopping', false)
) AS seed(title, done)
WHERE NOT EXISTS (
    SELECT 1 FROM tasks
);