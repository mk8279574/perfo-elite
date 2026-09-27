import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function Orders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      axiosInstance.get('/orders/my')
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch orders', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, authLoading]);

  if (authLoading || loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet. <Link to="/products">Start shopping</Link></p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
            <p>Order ID: {order._id}</p>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>

            {order.items.map((item) => (
              <div key={item._id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                <img
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                  alt={item.product?.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <p>{item.product?.name} × {item.quantity} — ₹{item.priceAtPurchase * item.quantity}</p>
              </div>
            ))}

            <h3>Total: ₹{order.totalAmount}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;