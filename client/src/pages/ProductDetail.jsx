import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();       // grabs the :id from the URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch product', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]); // re-fetch if the id in the URL ever changes

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login'); // must be logged in to add to cart
      return;
    }

    axiosInstance.post('/cart/add', { productId: id, quantity })
      .then(() => {
        setMessage('Added to cart!');
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || 'Failed to add to cart';
        setMessage(errMsg);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const isOutOfStock = product.stock === 0;

  return (
    <div style={{ display: 'flex', gap: '30px', padding: '20px' }}>
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/400'}
        alt={product.name}
        style={{ width: '400px', height: '400px', objectFit: 'cover' }}
      />

      <div>
        <p>{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.brand}</p>
        <p>{product.description}</p>
        <h2>₹{product.price}</h2>
        <p>Size: {product.size}</p>

        {isOutOfStock ? (
          <p style={{ color: 'red' }}>Out of Stock</p>
        ) : (
          <p style={{ color: 'green' }}>In Stock ({product.stock} available)</p>
        )}

        {!isOutOfStock && (
          <div>
            <label>Quantity: </label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '60px' }}
            />
          </div>
        )}

        <button onClick={handleAddToCart} disabled={isOutOfStock}>
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ProductDetail;