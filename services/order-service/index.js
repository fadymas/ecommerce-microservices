const express = require('express');
const app = express();
const port = 3003;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-service', port: 3003 });
});

app.get('/orders', (req, res) => {
  res.json({ orders: [] });
});

app.listen(port, () => {
  console.log(`✅ Order Service running on port ${port}`);
});
