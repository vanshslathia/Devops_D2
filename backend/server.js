const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mock Database
let products = [
  { id: 1, name: "Laptop", price: 999.99, description: "High-performance laptop", category: "Electronics" },
  { id: 2, name: "Wireless Mouse", price: 29.99, description: "Ergonomic wireless mouse", category: "Accessories" },
  { id: 3, name: "USB-C Cable", price: 14.99, description: "Fast charging USB-C cable", category: "Accessories" },
  { id: 4, name: "Monitor 27inch", price: 349.99, description: "4K UHD Monitor", category: "Electronics" },
  { id: 5, name: "Mechanical Keyboard", price: 129.99, description: "RGB Mechanical Keyboard", category: "Accessories" },
  { id: 6, name: "Webcam HD", price: 79.99, description: "1080P HD Webcam", category: "Electronics" }
];

let orders = [];
let cart = {};

// Root route - Welcome message
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to TechStore API",
    version: "2.0",
    endpoints: {
      products: "/api/products",
      cart: "/api/cart",
      orders: "/api/orders",
      health: "/health"
    }
  });
});

// GET all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// GET cart
app.get("/api/cart", (req, res) => {
  res.json(cart);
});

// POST add to cart
app.post("/api/cart", (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (cart[productId]) {
    cart[productId].quantity += quantity;
  } else {
    cart[productId] = {
      ...product,
      quantity
    };
  }

  res.json({ message: "Product added to cart", cart });
});

// DELETE from cart
app.delete("/api/cart/:productId", (req, res) => {
  const { productId } = req.params;
  delete cart[productId];
  res.json({ message: "Product removed from cart", cart });
});

// POST place order
app.post("/api/orders", (req, res) => {
  const { email, address } = req.body;

  if (Object.keys(cart).length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const order = {
    id: orders.length + 1,
    items: Object.values(cart),
    total: Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0),
    customer: { email, address },
    date: new Date().toISOString(),
    status: "Pending"
  };

  orders.push(order);
  cart = {}; // Clear cart after order

  res.json({ message: "Order placed successfully", order });
});

// GET all orders
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Ecommerce Backend is running", version: "2.0" });
});

app.listen(PORT, () => {
  console.log(`🛒 Ecommerce Backend is running at http://localhost:${PORT}`);
  console.log("✅ API endpoints ready");
});
