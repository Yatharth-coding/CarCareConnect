import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState('loading');

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // HttpOnly cookie is automatically transmitted with the request
        const res = await api.get('/api/auth/me');
        if (res.data?.success) {
          localStorage.setItem('user', JSON.stringify(res.data.data));
          setAuthState('authorized');
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setAuthState('unauthorized');
        }
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthState('unauthorized');
      }
    };

    validateAuth();
  }, []);

  if (authState === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verifying secure session...</p>
      </div>
    );
  }

  if (authState === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
