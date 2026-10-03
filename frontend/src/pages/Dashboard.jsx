import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import api from '../utils/api';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          api.get('/api/auth/me'),
          api.get('/api/bookings')
        ]);

        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
        }
        if (bookingsRes.data.success) {
          setBookings(bookingsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleEdit = () => {
    if (profile) {
      setEditName(profile.name);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      await api.delete('/api/users/profile');
      localStorage.removeItem('user');
      showSnackbar('Account deleted successfully.', 'success');
      navigate('/login');
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to delete account', 'error');
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      showSnackbar('Name cannot be empty', 'error');
      return;
    }

    try {
      const { data } = await api.put('/api/users/profile', { name: editName.trim() });
      if (data.success) {
        setProfile(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        setIsModalOpen(false);
        showSnackbar('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to update profile', 'error');
    }
  };

  const formatBookingDate = (booking) => {
    if (booking.scheduledAt) {
      return new Date(booking.scheduledAt).toLocaleString();
    }
    return `${booking.date || 'N/A'} at ${booking.time || 'N/A'}`;
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'ride': return '🚕 Ride';
      case 'car_wash': return '🧼 Car Wash';
      case 'mechanic': return '🔧 Mechanic';
      default: return serviceType;
    }
  };

  const getBookingDetails = (booking) => {
    if (booking.serviceType === 'ride') {
      return `${booking.pickupLocation} → ${booking.dropoffLocation}`;
    } else if (booking.serviceType === 'car_wash') {
      return `${booking.packageType || 'basic'} package at ${booking.serviceAddress || booking.mechanicAddress || 'N/A'}`;
    }
    return `${booking.mechanicName} (${booking.mechanicAddress})`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <p>Loading dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard" style={{ padding: '20px', minHeight: '60vh' }}>
        <h1>Profile Dashboard</h1>

        {profile && (
          <table id="profilesTable" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Role</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{profile.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{profile.email}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textTransform: 'capitalize' }}>{profile.role || 'customer'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button onClick={handleEdit} style={{ display: 'inline-block', marginRight: '10px', padding: '8px 16px', backgroundColor: '#00bcd4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={handleDelete} style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete Account</button>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <h2 style={{ marginTop: '40px' }}>My Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Type</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Details</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Date & Time</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Price</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                    {getServiceIcon(booking.serviceType)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {getBookingDetails(booking)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{formatBookingDate(booking)}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>\${booking.price}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : booking.status === 'completed' ? '#dbeafe' : '#f3f4f6',
                      color: booking.status === 'confirmed' ? '#166534' : booking.status === 'completed' ? '#1e40af' : '#374151'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="edit-title" style={{ display: 'block', position: 'fixed', zIndex: 1, left: 0, top: 0, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div style={{ backgroundColor: '#fefefe', margin: '15% auto', padding: '20px', border: '1px solid #888', width: '300px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 id="edit-title" style={{ margin: 0 }}>Edit Profile</h2>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close dialog" style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#aaa' }}>&times;</button>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="editName" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
              <input
                type="text"
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                aria-label="Edit name"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                style={{ width: '100%', padding: '8px', backgroundColor: '#eee' }}
                aria-label="Email (read-only)"
              />
            </div>
            <button onClick={handleSave} style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Save Changes</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Dashboard;
