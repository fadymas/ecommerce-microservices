// Add this new endpoint after the existing app.get('/cart'...) endpoint

app.get('/cart/items', async (req, res) => {
  db.all("SELECT * FROM carts", [], async (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Fetch prices from catalog-service for each item
    const itemsWithPrices = [];
    const axios = require('axios');
    const catalogUrl = 'http://localhost:8001';
    
    try {
      for (const item of cartItems) {
        const response = await axios.get(`${catalogUrl}/products/${item.productId}`);
        itemsWithPrices.push({
          productId: item.productId,
          quantity: item.quantity,
          price: response.data.price || 0
        });
      }
      res.json({ items: itemsWithPrices });
    } catch (error) {
      // If catalog service fails, return items without prices
      res.json({ items: cartItems.map(i => ({...i, price: 0})) });
    }
  });
});
