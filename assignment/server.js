require('dotenv').config();

const express = require('express');
const app = express();

const taskRepository = require('./repositories/taskRepository');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.get('/tasks', async(req, res) => {
    const tasks = await taskRepository.getAll();
    res.json(tasks);
});

app.get('/tasks/:id', async(req, res) => {
    const id = Number(req.params.id);
    const task = await taskRepository.getbyID(id);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json({
            error: "Task not found"
        });
    }
});

app.post('/tasks', async(req, res) => {
    if (req.body.title) {
        const newTask = await taskRepository.create(req.body.title);

        res.status(201).json(new_task);

    } else {
        res.status(400).json({
            error: "Title is Required"
        });
    }
});

app.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    if (title === undefined && done === undefined) {
        return res.status(400).json({
            error: "Provide title and/or done"
        });
    }

    if (title !== undefined && title === "") {
        return res.status(400).json({
            error: "Title cannot be empty"
        });
    }

    if (done !== undefined && typeof done !== "boolean") {
        return res.status(400).json({
            error: "Done must be true or false"
        });
    }

    const updatedTask = await taskRepository.update(id, title, done);

    if (!updatedTask) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.status(200).json(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);

    const deleted = await taskRepository.deleteTask(id);

    if (deleted === 0) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});