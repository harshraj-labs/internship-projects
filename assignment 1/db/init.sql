CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL
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