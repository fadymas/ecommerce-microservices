async function loadCart() {
  const res = await fetch('/api/cart');
  const cart = await res.json();
  console.log('Cart:', cart);
  // TODO: update cart table in DOM (depends on your HTML IDs)
}

async function loadOrders() {
  const res = await fetch('/api/orders');
  const orders = await res.json();
  console.log('Orders:', orders);
  // TODO: update orders table in DOM
}

async function addToCart(productId) {
  await fetch('/api/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity: 1 })
  });
  await loadCart();
}

async function checkout() {
  const res = await fetch('/api/cart');
  const cart = await res.json();

  await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'default-user',
      items: cart.items,
      total: cart.total
    })
  });

  await fetch('/api/cart', { method: 'DELETE' });

  await loadCart();
  await loadOrders();
}

async function confirmOrder() {
  const input = document.getElementById('order-id-input');
  if (!input || !input.value) return;
  const id = input.value.trim();

  await fetch(`/api/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'CONFIRMED' })
  });

  await loadOrders();
}

// Auto-load data on page load
window.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadOrders();
});
