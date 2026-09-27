import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    setLoading(true);
    axiosInstance.get('/cart')
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch cart', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchCart();
    }
  }, [user, authLoading]);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    axiosInstance.put('/cart/update', { productId, quantity: newQuantity })
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.error('Failed to update quantity', err);
      });
  };

  const handleRemove = (productId) => {
    axiosInstance.delete(`/cart/remove/${productId}`)
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        console.error('Failed to remove item', err);
      });
  };

  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  if (authLoading || loading) return <p>Loading cart...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Cart</h1>

      {cart.items.length === 0 ? (
        <p>Your cart is empty. <Link to="/products">Browse products</Link></p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}
            >
              <img
                src={item.product.images?.[0] || 'https://via.placeholder.com/80'}
                alt={item.product.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />

              <div style={{ flex: 1 }}>
                <h3>{item.product.name}</h3>
                <p>₹{item.product.price}</p>
              </div>

              <div>
                <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}>
                  -
                </button>
                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}>
                  +
                </button>
              </div>

              <p>₹{item.product.price * item.quantity}</p>

              <button onClick={() => handleRemove(item.product._id)}>
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <button onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;  