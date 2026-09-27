const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Budget', 'Luxury', 'Men', 'Unisex', 'Women']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  size: {
    type: String,
    default: '70ml'
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);