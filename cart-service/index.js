const express = require("express");
const db = require("./database");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

console.log("Cart Service starting...");

// Get full cart with prices and total
app.get("/cart", async (req, res) => {
  console.log("GET /cart called");

  db.all("SELECT * FROM carts", [], async (err, cartItems) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (cartItems.length === 0) {
      return res.json({ items: [], total: 0 });
    }

    const catalogUrl = "http://catalog-service:3001"; // INTERNAL port 3001
    const itemsWithPrices = [];
    let total = 0;

    for (const item of cartItems) {
      try {
        const response = await axios.get(`${catalogUrl}/products/${item.productId}`);
        const price = response.data && response.data.price ? response.data.price : 0;

        itemsWithPrices.push({
          productId: item.productId,
          quantity: item.quantity,
          price: price
        });

        total += price * item.quantity;
      } catch (error) {
        console.error("Error fetching product price for", item.productId, error.message);
        itemsWithPrices.push({
          productId: item.productId,
          quantity: item.quantity,
          price: 0
        });
      }
    }

    const result = {
      items: itemsWithPrices,
      total: parseFloat(total.toFixed(2))
    };

    res.json(result);
  });
});

// Add item to cart
app.post("/cart/items", (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    return res.status(400).json({ error: "productId required" });
  }

  const userId = "default-user";

  db.run(
    "INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?)",
    [userId, productId, quantity],
    function (err) {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Clear cart
app.delete("/cart", (req, res) => {
  db.run("DELETE FROM carts", (err) => {
    if (err) {
      console.error("Clear cart error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Cart Service RUNNING on port ${PORT}`);
});

