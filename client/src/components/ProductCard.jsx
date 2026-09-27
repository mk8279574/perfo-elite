import { Link } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleToggleWishlist = () => {
    if (!user) return;

    axiosInstance.post(`/wishlist/toggle/${product._id}`)
      .then(() => {
        setIsWishlisted((prev) => !prev);
      })
      .catch((err) => {
        console.error('Failed to toggle wishlist', err);
      });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', width: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>{product.category}</p>
        {user && (
          <button onClick={handleToggleWishlist}>
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      <Link to={`/products/${product._id}`}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/200'}
          alt={product.name}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        <h3>{product.name}</h3>
      </Link>

      <p>₹{product.price}</p>

      {isOutOfStock ? (
        <p style={{ color: 'red' }}>Out of Stock</p>
      ) : (
        <p style={{ color: 'green' }}>In Stock</p>
      )}

      <button disabled={isOutOfStock}>
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductCard;