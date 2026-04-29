const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./zentrix.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS demos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      company TEXT,
      email TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT,
      role TEXT,
      review TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.post("/api/book-demo", (req, res) => {
  const { name, company, email, message } = req.body;

  if (!name || !company || !email) {
    return res.status(400).json({ error: "Name, company and email are required" });
  }

  db.run(
    "INSERT INTO demos (name, company, email, message) VALUES (?, ?, ?, ?)",
    [name, company, email, message],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to save demo request" });

      res.json({ success: true, message: "Demo request submitted successfully" });
    }
  );
});

app.post("/api/reviews", (req, res) => {
  const { company, role, review } = req.body;

  if (!company || !role || !review) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run(
    "INSERT INTO reviews (company, role, review) VALUES (?, ?, ?)",
    [company, role, review],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to save review" });

      res.json({ success: true, message: "Review added successfully" });
    }
  );
});

app.get("/api/reviews", (req, res) => {
  db.all("SELECT * FROM reviews ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch reviews" });

    res.json(rows);
  });
});

app.get("/api/demo-requests", (req, res) => {
  db.all("SELECT * FROM demos ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch demo requests" });

    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`ZENTRIX server running on http://localhost:${PORT}`);
});