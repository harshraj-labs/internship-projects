require('dotenv').config();
const authenticateToken = require('./middleware/auth');
const express = require('express');
const app = express();
const authService = require('./services/authService');
const taskRepository = require('./repositories/taskRepository');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/auth/register',async (req,res)=>{
    try{
        const {email,password} = req.body;

        if (!email || !password){
            return res.status(400).json({
                error: "Email and Password are required"
            });
        }

        const user = await authService.register(email,password);
        res.status(201).json(user);
    } catch (err){
        if(err.code ==='23505'){
            return res.status(409).json({
                error: "Email already registered"
            });
        }
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.post('/auth/login', async (req,res) =>{
    try{
        const {email,password} = req.body;
        if (!email || !password){
            return res.status(400).json({
                error: 'Email and Password are required'
            });
        }
        const token = await authService.login(email,password);
        if (!token){
            return res.status(401).json({
                error: 'Invalid Email or Password'
            });
        }
        res.status(200).json({
            token
        });
    } catch (err){
        console.error(err);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

app.post('/auth/logout', authenticateToken ,(req,res)=>{
    res.status(200).json({
        message: "Logged out successfully!"
    });

});

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

app.get('/tasks',authenticateToken, async(req, res) => {
    const tasks = await taskRepository.getAll();
    res.json(tasks);
});

app.get('/tasks/:id',authenticateToken, async(req, res) => {
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

app.post('/tasks',authenticateToken, async(req, res) => {
    if (req.body.title) {
        const newTask = await taskRepository.create(req.body.title);

        res.status(201).json(newTask);

    } else {
        res.status(400).json({
            error: "Title is Required"
        });
    }
});

app.put('/tasks/:id',authenticateToken, async (req, res) => {
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

app.delete('/tasks/:id',authenticateToken, async (req, res) => {
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