import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSnackbar } from '../context/SnackbarContext';
import api from '../utils/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showSnackbar('Please fill out all fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/contact', formData);
      if (data.success) {
        showSnackbar(data.message || `Thank you, ${formData.name}! Your message has been sent successfully.`, 'success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        showSnackbar(data.error || 'Failed to send message', 'error');
      }
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f9fafb', minHeight: '80vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', color: '#111827' }}>Contact Us</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>Have any questions? We'd love to hear from you.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Name</label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                aria-label="Your name"
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Email</label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                aria-label="Your email"
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Message</label>
              <textarea
                id="contact-message"
                rows="5"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="How can we help you?"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical' }}
                aria-label="Your message"
              ></textarea>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.1rem' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
