const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

const db = new sqlite3.Database("/app/order.db", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create table with correct columns (including items as TEXT for JSON)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      items TEXT,
      total REAL,
      status TEXT DEFAULT 'PENDING'
    )
  `);
});

app.get('/orders', (req, res) => {
  db.all("SELECT * FROM orders", (err, rows) => {
    if (err) {
      console.error("GET orders error:", err);
      return res.status(500).json({ error: err.message });
    }
    // Parse items back to JSON
    const orders = rows.map(row => ({
      id: row.id,
      userId: row.userId,
      items: row.items ? JSON.parse(row.items) : [],
      total: row.total,
      status: row.status
    }));
    res.json(orders);
  });
});

app.post('/orders', (req, res) => {
  const { userId, items = [], total, status = 'PENDING' } = req.body;

  if (!userId || total === undefined) {
    return res.status(400).json({ error: "userId and total required" });
  }

  const sql = "INSERT INTO orders (userId, items, total, status) VALUES (?, ?, ?, ?)";
  const params = [userId, JSON.stringify(items), total, status];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Order insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Order created with ID: ${this.lastID}, total: ${total}`);
    res.json({ 
      id: this.lastID, 
      userId, 
      items, 
      total, 
      status 
    });
  });
});

app.put('/orders/:id', (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) {
      console.error("Update error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ id, status });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Order Service running on port ${PORT}`);
});
