const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'cart-service', port: 3002 });
});

app.get('/cart', (req, res) => {
  res.json({ items: [], total: 0 });
});

app.listen(port, () => {
  console.log(`✅ Cart Service running on port ${port}`);
});
