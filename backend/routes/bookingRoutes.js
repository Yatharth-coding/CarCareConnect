const express = require('express');
const { createBooking, getUserBookings, getPriceQuote, createBookingValidation } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createBookingValidation, createBooking)
    .get(protect, getUserBookings);

router.post('/quote', getPriceQuote);

module.exports = router;
