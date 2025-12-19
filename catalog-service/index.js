const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

// GET all products
app.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET product by id
app.get('/products/:id', (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// POST new product
app.post('/products', (req, res) => {
    const { name, description, price, stock } = req.body;
    db.run(`INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)`,
        [name, description, price, stock], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

// PUT update product
app.put('/products/:id', (req, res) => {
    const { name, description, price, stock } = req.body;
    db.run(`UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?`,
        [name, description, price, stock, req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updatedID: req.params.id });
        });
});

// DELETE product
app.delete('/products/:id', (req, res) => {
    db.run("DELETE FROM products WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deletedID: req.params.id });
    });
});
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'catalog-service',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Catalog Service running on port ${PORT}`);
});
