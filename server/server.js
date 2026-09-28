const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://perfo-elite-9b66lkpiy-manoj-kumar.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Auth routes
const authRoutes = require('./Routes/authRoutes');
app.use('/api/auth', authRoutes);
const productRoutes = require('./Routes/productRoutes');
app.use('/api/products', productRoutes);
const cartRoutes = require('./Routes/cartRoutes');
app.use('/api/cart', cartRoutes);
const wishlistRoutes = require('./Routes/wishlistRoutes');
app.use('/api/wishlist', wishlistRoutes);
const orderRoutes = require('./Routes/orderRoutes');
app.use('/api/orders', orderRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});