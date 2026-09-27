const Product = require('../models/Product');

// GET /api/products  (public — anyone can browse)
// Supports: ?category=Women&sort=price&search=oud
const getProducts = async (req, res) => {
  try {
    const { category, sort, search } = req.query;

    let filter = {};
    if (category && category !== 'All Fragrances') {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive partial match
    }

    let query = Product.find(filter);

    if (sort === 'price') {
      query = query.sort({ price: 1 }); // low to high
    } else if (sort === '-price') {
      query = query.sort({ price: -1 }); // high to low
    } else {
      query = query.sort({ createdAt: -1 }); // newest first, default
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/products/:id  (public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/products  (admin only)
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.file) {
      productData.images = [req.file.path];
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data', error: error.message });
  }
};
// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.images = [req.file.path];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid update data', error: error.message });
  }
};
// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };