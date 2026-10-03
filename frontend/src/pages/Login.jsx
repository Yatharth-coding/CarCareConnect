import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useSnackbar } from '../context/SnackbarContext';
import '../assets/css/styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      showSnackbar('Login successful!', 'success');
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Cannot connect to server. Render backend may still be starting up (wake-up takes ~50s) or VITE_API_URL is misconfigured.'
          : 'Invalid email or password.');
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/images/qfr.png" alt="Quick Fix Ride Logo" style={{ maxWidth: '100px' }} />
          </div>
          <h2>Car Care Connect</h2>
        </div>
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <button type="submit" style={{ width: '350px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <br />
          <hr />
          <p className="signup-link">
            <button id="create-an-acc" style={{ color: '#374151' }}>
              <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Create an account</Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
