const express = require('express');
const Database = require('better-sqlite3');
const app = express();
const db = new Database('tasks.db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
app.use(express.json())
app.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));

db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        done INTEGER NOT NULL
    )
`).run();

const count = db.prepare('SELECT COUNT(*) AS total FROM tasks').get();

if (count.total === 0) {
    const insert = db.prepare(
        'INSERT INTO tasks (title, done) VALUES (?, ?)'
    );

    insert.run('Study', 0);
    insert.run('Gym', 1);
    insert.run('Shopping', 0);
}

app.get('/', (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: "ok"
    });
});

app.get('/tasks', (req, res) => {
    const tasks = db.prepare('Select * FROM tasks').all();
    res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = db.prepare('Select * FROM tasks WHERE id = ?').get(id);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json({
            error: "Task not found"
        });
    }
});

app.post('/tasks', (req, res) => {
    if (req.body.title) {
        const insert = db.prepare(
            'INSERT INTO tasks (title,done) VALUES(?,?)'
        );
        const result = insert.run(req.body.title,0);
        const new_task = {
            id: result.lastInsertRowid,
            title: req.body.title,
            done: false
        };
        res.status(201).json(new_task);

    } else {
        res.status(400).json({
            error: "Title is Required"
        });
    }
});

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = db.prepare('Select * FROM tasks WHERE id = ?').get(id);    
    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const { title, done } = req.body;

    if (title === undefined && done === undefined) {
        return res.status(400).json({
            error: "Provide title and/or done"
        });
    }

    if (title !== undefined) {
        if (title === "") {
            return res.status(400).json({
                error: "Title cannot be empty"
            });
        }
        const update = db.prepare(
            'UPDATE tasks Set title = ? WHERE id =?'
        );
        const result = update.run(title,id);
    }

    if (done !== undefined) {
        if (typeof done !== "boolean") {
            return res.status(400).json({
                error: "Done must be true or false"
            });
        }
        const update = db.prepare(
            'UPDATE tasks Set done = ? WHERE id =?'
        );
        const result = update.run(done ? 1:0,id);
    }
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    res.status(200).json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const remove = db.prepare(
        'DELETE FROM tasks WHERE id = ?'
    );

    const result = remove.run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});