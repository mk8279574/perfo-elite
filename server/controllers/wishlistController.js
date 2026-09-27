const User = require('../models/user');

// POST /api/wishlist/toggle/:productId — add if not present, remove if present
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);

    if (index === -1) {
      // not in wishlist yet — add it
      user.wishlist.push(productId);
    } else {
      // already in wishlist — remove it
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/wishlist — get full wishlist with product details
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { toggleWishlist, getWishlist };