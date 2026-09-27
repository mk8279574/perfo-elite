import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      setLoading(true);
      axiosInstance.get('/wishlist')
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch wishlist', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, authLoading]);

  if (authLoading || loading) return <p>Loading wishlist...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Wishlist</h1>

      {products.length === 0 ? (
        <p>Your wishlist is empty. <Link to="/products">Browse products</Link></p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;