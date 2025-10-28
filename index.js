// index.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config(); // ✅ Load environment variables

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use a MySQL connection pool (no .connect() needed)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promise-based pool for async/await (optional)
const db = pool.promise();

// ✅ Default route - test DB connection
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM todoItems");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Add a new item
app.post("/add-item", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    await db.query("INSERT INTO todoItems (itemDescription) VALUES (?)", [text]);
    res.status(201).json({ message: "Item added successfully" });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Edit an item
app.put("/edit-item", async (req, res) => {
  try {
    const { ID, itemDescription } = req.body;
    if (!ID || !itemDescription)
      return res.status(400).json({ error: "ID and description required" });

    await db.query("UPDATE todoItems SET itemDescription = ? WHERE ID = ?", [
      itemDescription,
      ID,
    ]);
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Delete an item
app.delete("/delete-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM todoItems WHERE ID = ?", [id]);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
