const jwt = require('jsonwebtoken');
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

async function login(email,password) {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    const user = result.rows[0];
    if(!user){
        return null;
    }
    const validpassword = await bcrypt.compare(password,user.password_hash);
    if(!validpassword){
        return null;
    }
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );
    return token;
}
module.exports = {
    register,
    login
};