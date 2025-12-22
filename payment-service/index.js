const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

// POST payment (fake)
app.post('/pay', (req, res) => {
  const { orderId, amount, status } = req.body;
  db.run("INSERT INTO payments (orderId, amount, status) VALUES (?, ?, ?)",
         [orderId, amount, status], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ paymentId: this.lastID });
  });
});

// GET payment status
app.get('/payment/:paymentId', (req, res) => {
  db.get("SELECT * FROM payments WHERE paymentId=?", [req.params.paymentId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));

// Add endpoints for dashboard compatibility
app.get('/payments', (req, res) => {
  db.all("SELECT * FROM payments", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ payments: rows });
  });
});

app.post('/payments', (req, res) => {
  const { orderId, amount } = req.body;
  const paymentId = Date.now().toString();
  
  db.run(
    "INSERT INTO payments (paymentId, orderId, amount, status) VALUES (?, ?, ?, ?)",
    [paymentId, orderId, amount, 'completed'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        success: true,
        paymentId,
        orderId,
        amount,
        status: 'completed'
      });
    }
  );
});
