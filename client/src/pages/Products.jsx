import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';

const categories = ['All Fragrances', 'Budget', 'Luxury', 'Men', 'Unisex', 'Women'];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All Fragrances');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);

    axiosInstance.get('/products', {
      params: { category, sort, search }
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch products', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, sort, search]); // re-run this effect whenever any of these change

  return (
    <div>
      <h1>All Fragrances</h1>

      <input
        type="text"
        placeholder="Search luxury perfumes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <h3>Categories</h3>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{ fontWeight: category === cat ? 'bold' : 'normal' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div>
        <label>Sort by price: </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Featured</option>
          <option value="price">Low to High</option>
          <option value="-price">High to Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
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

export default Products;