const bcrypt = require('bcrypt');
const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function register(email, password) {
    const passwordHash = await bcrypt.hash(password,10);
    const result = await pool.query(
        `INSERT INTO users(email,password_hash)
        values($1,$2)
        RETURNING id, email, created_at`,
        [email,passwordHash]
    );
    return result.rows[0];
}
module.exports = {
    register
};