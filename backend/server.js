const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Файл для "базы данных"
const DB_FILE = "db.json";

// Если файла нет — создаём пустой массив
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Читаем базу
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Пишем базу
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Добавить имя
app.post("/add", (req, res) => {
  const { name } = req.body;
  const db = readDB();
  db.push({ name });
  writeDB(db);
  res.json({ ok: true });
});

// Получить список имён
app.get("/list", (req, res) => {
  res.json(readDB());
});

// Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
