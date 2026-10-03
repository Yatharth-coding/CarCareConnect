import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSnackbar } from '../context/SnackbarContext';
import api from '../utils/api';

const JoinDriver = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', vehicleType: 'sedan' });
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showSnackbar('Please fill out all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/driver-applications', formData);
      if (data.success) {
        showSnackbar(data.message || `Thank you, ${formData.name}! Your application has been submitted.`, 'success');
        setFormData({ name: '', email: '', phone: '', vehicleType: 'sedan' });
      } else {
        showSnackbar(data.error || 'Failed to submit application', 'error');
      }
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to submit application. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f9fafb', minHeight: '80vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', color: '#111827' }}>Join as Driver Partner</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>Earn with QuickFixRide with zero investments. Apply today!</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="driver-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Full Name</label>
              <input id="driver-name" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }} aria-label="Full name" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="driver-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Email Address</label>
              <input id="driver-email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Enter your email" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }} aria-label="Email address" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="driver-phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Phone Number</label>
              <input id="driver-phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Enter your phone number" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }} aria-label="Phone number" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="driver-vehicle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Vehicle Type</label>
              <select id="driver-vehicle" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white' }} aria-label="Vehicle type">
                <option value="sedan">Sedan (Economy)</option>
                <option value="suv">SUV (Premium)</option>
                <option value="bike">Bike / Scooter</option>
                <option value="truck">Tow Truck</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.1rem' }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JoinDriver;
