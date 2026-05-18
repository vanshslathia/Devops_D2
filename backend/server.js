const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/techstore";

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

const sampleProducts = [
  {
    name: "Wireless Headphones",
    price: 79.99,
    description: "Noise-cancelling over-ear headphones with 30h battery life.",
    category: "Electronics"
  },
  {
    name: "Mechanical Keyboard",
    price: 129.99,
    description: "RGB backlit keyboard with tactile switches for gaming and work.",
    category: "Accessories"
  },
  {
    name: "USB-C Hub",
    price: 49.99,
    description: "7-in-1 adapter with HDMI, USB 3.0, and SD card reader.",
    category: "Accessories"
  },
  {
    name: "4K Webcam",
    price: 99.99,
    description: "Auto-focus webcam with built-in microphone for video calls.",
    category: "Electronics"
  },
  {
    name: "Portable SSD 1TB",
    price: 119.99,
    description: "Fast external storage with USB 3.2 Gen 2 speeds.",
    category: "Storage"
  },
  {
    name: "Smart Watch",
    price: 199.99,
    description: "Fitness tracking, notifications, and heart-rate monitoring.",
    category: "Electronics"
  }
];

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`✓ Seeded ${sampleProducts.length} sample products`);
  }
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✓ MongoDB connected");
  await seedProducts();
})
.catch((err) => console.error("✗ MongoDB connection error:", err));

// Root route - Welcome message
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to TechStore API",
    version: "2.0",
    status: "running",
    endpoints: {
      products: "/api/products",
      orders: "/api/orders",
      health: "/health"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🛒 Server running on http://localhost:${PORT}`);
  console.log(`✅ API endpoints ready`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
