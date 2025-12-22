const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const CATALOG_URL = process.env.CATALOG_URL || 'http://catalog-service:3001';
const CART_URL    = process.env.CART_URL    || 'http://cart-service:3002';
const ORDER_URL   = process.env.ORDER_URL   || 'http://order-service:3003';
const PAYMENT_URL = process.env.PAYMENT_URL || 'http://payment-service:3004';

app.use(express.static("public"));
app.use(express.json());

console.log("🔧 Microservice URLs:");
console.log(` Catalog: ${CATALOG_URL}`);
console.log(` Cart: ${CART_URL}`);
console.log(` Order: ${ORDER_URL}`);
console.log(` Payment: ${PAYMENT_URL}`);

// Critical proxy for cart - with logging
app.get("/api/cart", async (req, res) => {
  console.log("PROXY: /api/cart requested");
  try {
    const resp = await fetch(`${CART_URL}/cart`);
    if (!resp.ok) {
      console.error(`Cart service error: ${resp.status}`);
    }
    const data = await resp.json();
    console.log("PROXY: Cart data received:", data);
    res.json(data);
  } catch (err) {
    console.error("PROXY ERROR (cart):", err.message);
    res.status(500).json({ error: "cart service unreachable" });
  }
});

// Other proxies (keep your existing ones)
app.get("/api/products", async (req, res) => {
  try {
    const resp = await fetch(`${CATALOG_URL}/products`);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Catalog error:", err.message);
    res.status(500).json({ error: "failed to fetch products" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const resp = await fetch(`${ORDER_URL}/orders`);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ error: "failed to fetch orders" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const resp = await fetch(`${ORDER_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Order create error:", err.message);
    res.status(500).json({ error: "failed to create order" });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const resp = await fetch(`${ORDER_URL}/orders/${req.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Order update error:", err.message);
    res.status(500).json({ error: "failed to update order" });
  }
});

app.get("/api/payments", async (req, res) => {
  try {
    const resp = await fetch(`${PAYMENT_URL}/payments`);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Payment error:", err.message);
    res.status(500).json({ error: "failed to fetch payments" });
  }
});

app.post("/api/payments", async (req, res) => {
  try {
    const resp = await fetch(`${PAYMENT_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Payment create error:", err.message);
    res.status(500).json({ error: "failed to create payment" });
  }
});

// Catalog CRUD proxies
app.post("/api/catalog", async (req, res) => {
  try {
    const response = await fetch(`${CATALOG_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/catalog/:id", async (req, res) => {
  try {
    const response = await fetch(`${CATALOG_URL}/products/${req.params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/catalog/:id", async (req, res) => {
  try {
    const response = await fetch(`${CATALOG_URL}/products/${req.params.id}`, { method: "DELETE" });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`✅ Dashboard listening on port ${PORT}`);
});
