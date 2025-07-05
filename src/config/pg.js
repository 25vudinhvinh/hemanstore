const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false },
// });

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "hemanstoreDB",
    password: "postgre",
    port: 5432,
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL on Render");
});

pool.on("error", (err) => {
    console.error("Database Error:", err.stack);
});

module.exports = pool;
