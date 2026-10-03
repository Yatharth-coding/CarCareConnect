import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const ServiceHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings');
        if (res.data?.success) {
          // Filter out ride bookings to only show mechanics and car washes
          setBookings(res.data.data.filter(b => b.serviceType !== 'ride'));
        }
      } catch (err) {
        console.error('Failed to fetch service history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatServiceDate = (booking) => {
    if (booking.scheduledAt) {
      return new Date(booking.scheduledAt).toLocaleString();
    }
    return `${booking.date || 'N/A'} at ${booking.time || 'N/A'}`;
  };

  const getServiceDetails = (booking) => {
    if (booking.serviceType === 'car_wash') {
      return `${booking.packageType || 'basic'} package at ${booking.serviceAddress || booking.mechanicAddress || 'N/A'}`;
    }
    return `${booking.mechanicName || 'Mechanic'} (${booking.mechanicAddress || 'N/A'})`;
  };

  return (
    <>
      <Navbar />
      <div className="dashboard" style={{ padding: '2rem', minHeight: '60vh', backgroundColor: '#f9fafb' }}>
        <h1 style={{ marginBottom: '1.5rem', color: '#111827' }}>My Service History 🔧</h1>

        {loading ? (
          <p style={{ color: '#6b7280' }}>Loading your service records...</p>
        ) : bookings.length === 0 ? (
          <p style={{ color: '#6b7280' }}>You haven't booked any vehicle services yet.</p>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>Service Type</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>Details</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>Date & Time</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>Price</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                      {booking.serviceType === 'car_wash' ? '🧼 Car Wash' : '🔧 Mechanic'}
                    </td>
                    <td style={{ padding: '1rem' }}>{getServiceDetails(booking)}</td>
                    <td style={{ padding: '1rem' }}>{formatServiceDate(booking)}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>${booking.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : '#f3f4f6',
                        color: booking.status === 'confirmed' ? '#166534' : '#374151',
                        textTransform: 'capitalize'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ServiceHistory;
