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
    const new_id = tasks[tasks.length - 1].id + 1;

    if (req.body.title) {

        const new_task = {
            id: new_id,
            title: req.body.title,
            done: false
        };
        tasks.push(new_task)
        res.status(201).json(new_task);

    } else {
        res.status(400).json({
            error: "Title is Required"
        });
    }
});

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);

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
        task.title = title;
    }

    if (done !== undefined) {
        if (typeof done !== "boolean") {
            return res.status(400).json({
                error: "Done must be true or false"
            });
        }
        task.done = done;
    }

    res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});