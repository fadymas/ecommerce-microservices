const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'catalog-service', port: 3001 });
});

app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Phone', price: 599.99 },
    { id: 3, name: 'Tablet', price: 399.99 }
  ]);
});

app.listen(port, () => {
  console.log(`✅ Catalog Service running on port ${port}`);
});
