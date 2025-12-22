const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:8003/orders";

app.use(express.static("public"));

app.get("/api/orders", async (req, res) => {
  try {
    const resp = await fetch(ORDER_SERVICE_URL);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch orders" });
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard listening on port ${PORT}`);
});
