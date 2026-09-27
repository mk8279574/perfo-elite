import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const categories = ['Budget', 'Luxury', 'Men', 'Unisex', 'Women'];

function AdminDashboard() {
  const [view, setView] = useState('products'); // 'products' or 'orders'

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      <button onClick={() => setView('products')}>Manage Products</button>
      <button onClick={() => setView('orders')}>Manage Orders</button>

      {view === 'products' ? <ProductManager /> : <OrderManager />}
    </div>
  );
}

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // null = adding new, object = editing existing

  const fetchProducts = () => {
    axiosInstance.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;

    axiosInstance.delete(`/products/${id}`)
      .then(() => {
        fetchProducts(); // refresh the list after deleting
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <ProductForm
        key={editingProduct?._id || 'new'}
        existingProduct={editingProduct}
        onSuccess={() => {
          setEditingProduct(null);
          fetchProducts();
        }}
        onCancel={() => setEditingProduct(null)}
      />

      <h2>All Products</h2>
      {products.map((product) => (
        <div key={product._id} style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/60'}
            alt={product.name}
            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
          />
          <p style={{ flex: 1 }}>{product.name} — ₹{product.price} — Stock: {product.stock}</p>
          <button onClick={() => setEditingProduct(product)}>Edit</button>
          <button onClick={() => handleDelete(product._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
function OrderManager() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axiosInstance.get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    axiosInstance.put(`/orders/${orderId}/status`, { status: newStatus })
      .then(() => {
        fetchOrders();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>All Orders</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <p>Order ID: {order._id}</p>
          <p>Customer: {order.user?.name} ({order.user?.email})</p>
          <p>Total: ₹{order.totalAmount}</p>

          <label>Status: </label>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
function ProductForm({ existingProduct, onSuccess, onCancel }) {
  const [name, setName] = useState(existingProduct?.name || '');
  const [brand, setBrand] = useState(existingProduct?.brand || '');
  const [price, setPrice] = useState(existingProduct?.price || '');
  const [category, setCategory] = useState(existingProduct?.category || categories[0]);
  const [stock, setStock] = useState(existingProduct?.stock || '');
  const [size, setSize] = useState(existingProduct?.size || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // FormData is required for sending files — plain JSON can't hold binary file data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('size', size);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const request = existingProduct
      ? axiosInstance.put(`/products/${existingProduct._id}`, formData)
      : axiosInstance.post('/products', formData);

    request
      .then(() => {
        onSuccess();
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Failed to save product';
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
      <input type="text" placeholder="Size (e.g. 70ml)" value={size} onChange={(e) => setSize(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <div>
        <label>Product Image: </label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : existingProduct ? 'Update Product' : 'Add Product'}
      </button>
      {existingProduct && (
        <button type="button" onClick={onCancel}>Cancel</button>
      )}
    </form>
  );
}

export default AdminDashboard;