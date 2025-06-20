// const { Pool } = require("pg");
// const dotenv = require("dotenv");
// dotenv.config();

// const poll = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
// });

// poll.on("connect", () => {
//     console.log("Connected to PostgreSQL");
// });

// poll.on("error", () => {
//     console.log("Database Error", err.stack);
// });

// module.exports = poll;

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL on Render");
});

pool.on("error", (err) => {
    console.error("Database Error:", err.stack);
});

module.exports = pool;
