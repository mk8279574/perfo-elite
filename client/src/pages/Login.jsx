import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // stops the browser's default full-page-reload form submission
    setError('');
    setLoading(true);

    axiosInstance.post('/auth/login', { email, password })
      .then((res) => {
        login(res.data);       // update AuthContext with the logged-in user
        navigate('/');         // redirect to Home page
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Login failed. Try again.';
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Sign In</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

export default Login;