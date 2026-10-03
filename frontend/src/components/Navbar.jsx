import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../assets/css/project.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Sync session on mount
    api.get('/api/auth/me')
      .then(res => {
        if (res.data?.success) {
          setCurrentUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        }
      })
      .catch(() => {
        setCurrentUser(null);
        localStorage.removeItem('user');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <div className="logo">
          <img src="/images/qfr.png" alt="Logo" id="logo_img" />
        </div>
      </Link>
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <span className="nav-link">Services</span>
          <div className="dropdown-content">
            <div className="services-grid">
              <Link to="/book-ride" className="service_a">
                <div className="service-item">
                  <div className="service-icon">🚗</div>
                  <div className="service-details">
                    <div className="service-title">Book a Ride</div>
                    <div className="service-description">Get driven by professional drivers</div>
                  </div>
                </div>
              </Link>
              <Link to="/nearby-service" className="service_a">
                <div className="service-item">
                  <div className="service-icon">📱</div>
                  <div className="service-details">
                    <div className="service-title">Book normal servicing</div>
                    <div className="service-description"></div>
                  </div>
                </div>
              </Link>
              <Link to="/nearby-service" className="service_a">
                <div className="service-item">
                  <div className="service-icon">🔧</div>
                  <div className="service-details">
                    <div className="service-title">On location servicing</div>
                    <div className="service-description">Book car repair & maintenance services</div>
                  </div>
                </div>
              </Link>
              <Link to="/car-wash" className="service_a">
                <div className="service-item">
                  <div className="service-icon">🧼</div>
                  <div className="service-details">
                    <div className="service-title">Car Wash</div>
                    <div className="service-description">Doorstep pressure & eco car wash by professionals</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <span className="nav-link">For Business</span>
          <div className="dropdown-content">
            <div className="business-grid">
              <div className="business-item">
                <Link to="/business/join-driver">
                  <div className="business-icon">🤝</div>
                  <div className="business-details">
                    <div className="business-title">Join as Driver Partner</div>
                    <div className="business-description">Earn with Quick Fix Ride with zero investments</div>
                  </div>
                </Link>
              </div>
              <div className="business-item">
                <Link to="/business/hire-drivers">
                  <div className="business-icon">💼</div>
                  <div className="business-details">
                    <div className="business-title">Hire Drivers for B2B</div>
                    <div className="business-description">Need help with vehicle movements for your biz?</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <span className="nav-link">About Us</span>
          <div className="dropdown-content">
            <div className="about-grid">
              <Link to="/about/team" className="about-link">Team</Link>
              <Link to="/about/blog" className="about-link">Blog</Link>
              <Link to="/about/contact" className="about-link">Contact Us</Link>
            </div>
          </div>
        </li>
        <li className="nav-item">
          {!currentUser ? (
            <div className="signup" style={{ display: 'block' }}>
              <button id="login-btn" onClick={() => navigate('/login')}>Login</button>
            </div>
          ) : (
            <div id="profile-dropdown" className="profile-container" style={{ display: 'block' }}>
              <button id="profile-btn" className="profile-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img src="/images/free-user-icon-3296-thumb.png" alt="Profile" className="profile-icon" />
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu" style={{ display: 'block' }}>
                  <li className="dropdown-item"><Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link></li>
                  <li className="dropdown-item"><Link to="/service-history" onClick={() => setIsDropdownOpen(false)}>Service History</Link></li>
                  <li className="dropdown-item"><Link to="/ride-history" onClick={() => setIsDropdownOpen(false)}>Ride History</Link></li>
                  <li className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
                </ul>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
