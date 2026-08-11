const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function getAll() {
    const result = await pool.query(
        'SELECT * FROM tasks'
    );

    return result.rows;
}

async function getbyID(id){
    const result = await pool.query(
        'SELECT * FROM tasks WHERE id = $1',
        [id]
    );
    return result.rows[0];  
}

async function create(title) {
    const result = await pool.query(
        'INSERT INTO tasks (title,done) VALUES ($1,$2) RETURNING *',
        [title,false]
    );
    return result.rows[0];
    
}

async function update(id,title,done) {
    const result = await pool.query(
        `UPDATE tasks
        SET title = COALESCE($1.title),
            done = COALESCE($2,done)
        WHERE id = $3
        RETURNING *`
        [title,done,id]
    );
    return result.rows[0];
    
}

async function deleteTask(id){
    const result = await pool.query(
        `DELETE FROM tasks WHERE id = $1`,
        [id]
    );
    return result.rowCount;
}

module.exports = {
    getAll,
    getbyID,
    create,
    update,
    deleteTask
};