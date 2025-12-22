const express = require('express');
const app = express();
const port = 3004;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-service', port: 3004 });
});

app.get('/payments', (req, res) => {
  res.json({ payments: [] });
});

app.post('/process-payment', (req, res) => {
  res.json({ 
    status: 'success', 
    transactionId: 'TXN-' + Date.now(),
    amount: req.body.amount || 0
  });
});

// Allow GET on /process-payment too for testing
app.get('/process-payment', (req, res) => {
  res.json({ 
    status: 'success', 
    transactionId: 'TXN-' + Date.now(),
    message: 'Test transaction'
  });
});

app.listen(port, () => {
  console.log(`✅ Payment Service running on port ${port}`);
});
