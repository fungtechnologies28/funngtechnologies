const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fung_technologies'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { user_id, total_amount, status } = req.body;
    const result = await pool.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, total_amount, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Repair Bookings Routes
app.get('/api/repair-bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM repair_bookings ORDER BY booking_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch repair bookings' });
  }
});

app.post('/api/repair-bookings', async (req, res) => {
  try {
    const { user_id, phone_model, issue_description, booking_date, status } = req.body;
    const result = await pool.query(
      'INSERT INTO repair_bookings (user_id, phone_model, issue_description, booking_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, phone_model, issue_description, booking_date, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create repair booking' });
  }
});

// Trade-In Routes
app.post('/api/trade-in/quote', async (req, res) => {
  try {
    const { phone_model, condition, storage } = req.body;
    // Simple quote calculation logic
    const basePrice = 100;
    const conditionMultiplier = condition === 'excellent' ? 1 : condition === 'good' ? 0.7 : 0.5;
    const quote = basePrice * conditionMultiplier;
    
    res.json({ quote, phone_model, condition, storage });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to calculate quote' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'fung_technologies'}`);
});

module.exports = app;
