import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">
      <Link to="/" className="navbar-brand fw-bold">
        Perfo<span className="text-warning">Elite</span>
      </Link>

      <div className="d-flex align-items-center gap-3 ms-auto">
        <Link to="/" className="nav-link text-light">Home</Link>
        <Link to="/products" className="nav-link text-light">Products</Link>
        <Link to="/cart" className="nav-link text-light">Cart</Link>
        <Link to="/wishlist" className="nav-link text-light">Wishlist</Link>
        <Link to="/orders" className="nav-link text-light">Orders</Link>

        {loading ? (
          <span className="text-light">Loading...</span>
        ) : user ? (
          <>
            <span className="text-light">Hi, {user.name}</span>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link text-light">Admin</Link>
            )}
            <button onClick={logout} className="btn btn-outline-light btn-sm">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-warning btn-sm fw-bold">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;