import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useSnackbar } from '../context/SnackbarContext';
import '../assets/css/styles.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showSnackbar('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      showSnackbar('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Signup failed', 'error');
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
          <h2>Create Account</h2>
        </div>
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Full name"
            />
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
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <button type="submit" style={{ width: '350px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          <br />
          <hr />
          <p className="signup-link">
            <button id="create-an-acc" style={{ color: '#374151' }}>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Already have an account? Log in</Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
