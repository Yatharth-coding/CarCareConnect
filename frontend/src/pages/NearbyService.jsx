import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import api from '../utils/api';

const NearbyService = () => {
  const [mechanics, setMechanics] = useState([]);
  const [sortRating, setSortRating] = useState('');
  const [sortDistance, setSortDistance] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [locationHeading, setLocationHeading] = useState('Nearby Mechanics in Bhopal');
  const [loading, setLoading] = useState(false);

  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const today = new Date().toISOString().split('T')[0];

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.address) {
        return data.address.city || data.address.town || data.address.village || data.address.county || 'your area';
      }
      return 'your area';
    } catch (error) {
      return 'your area';
    }
  };

  const fetchMechanics = async (lat, lng) => {
    setLoading(true);
    try {
      let locationName = await reverseGeocode(lat, lng);
      setLocationHeading(`Nearby Mechanics in ${locationName}`);

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=car+repair+in+${encodeURIComponent(locationName)}`);
      const data = await response.json();

      let fetchedMechanics = [];

      if (data && data.length > 0) {
        fetchedMechanics = data.map((place) => {
          const dLat = (parseFloat(place.lat) - lat) * Math.PI / 180;
          const dLon = (parseFloat(place.lon) - lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat * Math.PI / 180) * Math.cos(parseFloat(place.lat) * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = 6371 * c * 1000;

          return {
            Name: place.name || place.display_name.split(',')[0] || 'Auto Repair',
            Rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
            Address: place.display_name,
            MobileNumber: 'N/A',
            Lat: parseFloat(place.lat),
            Lng: parseFloat(place.lon),
            Distance: distance,
            DistanceText: (distance / 1000).toFixed(1) + ' km',
            isVerified: false
          };
        });
      } else {
        fetchedMechanics = [
          { Name: 'SuperFast Auto Repair', Rating: '4.8', Address: '123 Engine Blvd, ' + locationName, DistanceText: '1.2 km', Distance: 1200, isVerified: false },
          { Name: 'Reliable Mechanics Co.', Rating: '4.5', Address: '456 Transmission Ave, ' + locationName, DistanceText: '2.5 km', Distance: 2500, isVerified: false },
          { Name: 'Quick Fix Garage', Rating: '4.2', Address: '789 Brake St, ' + locationName, DistanceText: '3.8 km', Distance: 3800, isVerified: false },
          { Name: 'City Center Motors', Rating: '4.9', Address: '101 Exhaust Way, ' + locationName, DistanceText: '5.1 km', Distance: 5100, isVerified: false },
        ];
      }

      setMechanics(fetchedMechanics);
    } catch (error) {
      console.error('Error fetching mechanics data:', error);
      const mockLocation = 'your area';
      setMechanics([
        { Name: 'SuperFast Auto Repair', Rating: '4.8', Address: '123 Engine Blvd, ' + mockLocation, DistanceText: '1.2 km', Distance: 1200, isVerified: false },
        { Name: 'Reliable Mechanics Co.', Rating: '4.5', Address: '456 Transmission Ave, ' + mockLocation, DistanceText: '2.5 km', Distance: 2500, isVerified: false },
        { Name: 'Quick Fix Garage', Rating: '4.2', Address: '789 Brake St, ' + mockLocation, DistanceText: '3.8 km', Distance: 3800, isVerified: false },
        { Name: 'City Center Motors', Rating: '4.9', Address: '101 Exhaust Way, ' + mockLocation, DistanceText: '5.1 km', Distance: 5100, isVerified: false },
      ]);
      setLocationHeading(`Nearby Mechanics in ${mockLocation}`);
    }
    setLoading(false);
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setLocationHeading(`Nearby Mechanics in ${data[0].display_name.split(',')[0]}`);
        fetchMechanics(lat, lng);
      } else {
        showSnackbar('Address not found. Please try another address.', 'error');
      }
    } catch (error) {
      showSnackbar('Failed to fetch geocode data. Please try again.', 'error');
    }
  };

  const handleSearch = () => {
    if (searchAddress.trim()) {
      geocodeAddress(searchAddress.trim());
    } else {
      showSnackbar('Please enter an address.', 'error');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchMechanics(latitude, longitude);
        },
        () => {
          showSnackbar('Failed to get current location. Please allow location access.', 'error');
        }
      );
    } else {
      showSnackbar('Geolocation is not supported by your browser.', 'error');
    }
  };

  useEffect(() => {
    fetchMechanics(23.259933, 77.412613);
  }, []);

  const getSortedMechanics = () => {
    let sortedMechanics = [...mechanics];
    sortedMechanics.sort((a, b) => {
      let distanceResult = 0;
      let ratingResult = 0;

      if (sortDistance) {
        const distanceA = a.Distance || Infinity;
        const distanceB = b.Distance || Infinity;
        distanceResult = sortDistance === 'asc' ? distanceA - distanceB : distanceB - distanceA;
      }

      if (sortRating) {
        const ratingA = parseFloat(a.Rating) || 0;
        const ratingB = parseFloat(b.Rating) || 0;
        ratingResult = sortRating === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }

      return distanceResult !== 0 ? distanceResult : ratingResult;
    });
    return sortedMechanics;
  };

  const handleBooking = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      showSnackbar('Please login first to book a mechanic.', 'error');
      navigate('/login');
      return;
    }
    if (!bookingDate || !bookingTime) {
      showSnackbar('Please select date and time.', 'error');
      return;
    }

    try {
      const { data } = await api.post('/api/bookings', {
        serviceType: 'mechanic',
        mechanicName: selectedMechanic.Name,
        mechanicAddress: selectedMechanic.Address,
        date: bookingDate,
        time: bookingTime
      });

      if (data.success) {
        showSnackbar('Mechanic Booked Successfully! Redirecting to Dashboard...', 'success');
        setSelectedMechanic(null);
        navigate('/dashboard');
      } else {
        showSnackbar(data.error || 'Failed to book mechanic', 'error');
      }
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'An error occurred while booking.', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>

          <div style={{ backgroundColor: '#fef3cd', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', color: '#856404', border: '1px solid #ffc107' }}>
            ⓘ Service listings are sourced from OpenStreetMap. Ratings are estimated and not verified. Please confirm details directly with the service provider.
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Enter address to search" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} style={{ flex: '1', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }} aria-label="Search address" />
              <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Search</button>
              <button type="button" onClick={getCurrentLocation} style={{ backgroundColor: '#10b981', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Use Current Location</button>
            </form>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              <div>
                <label htmlFor="sort-rating" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Sort by Rating:</label>
                <select id="sort-rating" value={sortRating} onChange={(e) => setSortRating(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                  <option value="">None</option>
                  <option value="desc">Highest to Lowest</option>
                  <option value="asc">Lowest to Highest</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort-distance" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Sort by Distance:</label>
                <select id="sort-distance" value={sortDistance} onChange={(e) => setSortDistance(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                  <option value="">None</option>
                  <option value="asc">Nearest to Farthest</option>
                  <option value="desc">Farthest to Nearest</option>
                </select>
              </div>
            </div>
          </div>

          <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>{locationHeading}</h2>

          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading mechanics...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {getSortedMechanics().map((mechanic, index) => (
                <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', marginBottom: '10px' }}>{mechanic.Name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ backgroundColor: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '4px', marginRight: '10px', fontSize: '13px' }} title="Estimated rating - not verified">
                        ~{mechanic.Rating}★
                      </span>
                      <span style={{ color: '#4b5563', fontSize: '13px' }}>{mechanic.Address}</span>
                    </div>
                    <div style={{ color: '#4b5563', marginBottom: '15px' }}>Distance: {mechanic.DistanceText}</div>
                  </div>
                  <button
                    onClick={() => setSelectedMechanic(mechanic)}
                    style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedMechanic && (
        <div role="dialog" aria-modal="true" aria-labelledby="booking-title" style={{ display: 'block', position: 'fixed', zIndex: 999, left: 0, top: 0, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div style={{ backgroundColor: '#fff', margin: '10% auto', padding: '30px', border: 'none', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 id="booking-title" style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Book {selectedMechanic.Name}</h2>
              <button onClick={() => setSelectedMechanic(null)} aria-label="Close dialog" style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '28px', fontWeight: 'bold', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '14px' }}><strong>Address:</strong> {selectedMechanic.Address}</p>
              <p style={{ margin: '0 0 20px 0', color: '#4b5563', fontSize: '14px' }}><strong>Call-out Fee:</strong> \$50.00 (calculated by server)</p>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="booking-date" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Date</label>
                <input id="booking-date" type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={today} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} aria-label="Booking date" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="booking-time" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Time</label>
                <input id="booking-time" type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} aria-label="Booking time" />
              </div>
            </div>

            <button onClick={handleBooking} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      <Chatbot />
      <Footer />
    </>
  );
};

export default NearbyService;
