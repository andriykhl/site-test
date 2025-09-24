const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // нужно для Render
});

// Создаём таблицу при старте
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS names (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
})();

// Добавить имя
app.post("/add", async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO names (name) VALUES ($1)", [name]);
  res.json({ ok: true });
});

// Получить список имён
app.get("/list", async (req, res) => {
  const result = await pool.query("SELECT * FROM names ORDER BY id DESC");
  res.json(result.rows);
});

// Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
