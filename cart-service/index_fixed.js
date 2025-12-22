const express = require("express");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Add endpoints for dashboard compatibility
app.get('/cart', (req, res) => {
  db.all("SELECT * FROM carts", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ items: rows });
  });
});

app.post('/cart/items', (req, res) => {
  const { productId, quantity } = req.body;
  const userId = 'default-user'; // Use a default user
  
  db.run(
    "INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?)",
    [userId, productId, quantity],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        success: true,
        cartItemId: this.lastID,
        productId,
        quantity
      });
    }
  );
});

app.delete('/cart', (req, res) => {
  db.run("DELETE FROM carts", [], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, deleted: this.changes });
  });
});

app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));
