const Booking = require('../models/Booking');
const { PRICING } = require('../models/Booking');
const { body, validationResult } = require('express-validator');

// Validation rules for creating a booking
exports.createBookingValidation = [
    body('serviceType').isIn(['ride', 'mechanic', 'car_wash']).withMessage('Invalid service type'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
];

// Calculate price server-side based on trusted inputs
const calculatePrice = (serviceType, data) => {
    switch (serviceType) {
        case 'ride': {
            const rideType = data.rideType || 'economy';
            const pricing = PRICING.ride[rideType];
            if (!pricing) throw new Error('Invalid ride type');
            const distanceKm = Math.max(0, Number(data.distanceKm) || 0);
            return Math.max(pricing.baseFare, Math.floor(pricing.baseFare + pricing.perKm * distanceKm));
        }
        case 'mechanic':
            return PRICING.mechanic.callout;
        case 'car_wash': {
            const packageType = data.packageType || 'basic';
            const price = PRICING.car_wash[packageType];
            if (price === undefined) throw new Error('Invalid package type');
            return price;
        }
        default:
            throw new Error('Invalid service type');
    }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { serviceType, pickupLocation, dropoffLocation, mechanicName, mechanicAddress,
                date, time, rideType, distanceKm, packageType, serviceAddress } = req.body;

        // Parse date and time into a single Date object (UTC)
        const scheduledAt = new Date(`${date}T${time}`);
        if (isNaN(scheduledAt.getTime())) {
            return res.status(400).json({ success: false, error: 'Invalid date or time format' });
        }

        // Calculate price server-side
        const price = calculatePrice(serviceType, { rideType, distanceKm, packageType });

        const bookingData = {
            user: req.user.id,
            serviceType,
            scheduledAt,
            price
        };

        // Add service-specific fields
        if (serviceType === 'ride') {
            if (!pickupLocation || !dropoffLocation) {
                return res.status(400).json({ success: false, error: 'Pickup and dropoff locations are required for rides' });
            }
            bookingData.pickupLocation = pickupLocation;
            bookingData.dropoffLocation = dropoffLocation;
            bookingData.rideType = rideType || 'economy';
            bookingData.distanceKm = distanceKm;
        } else if (serviceType === 'mechanic') {
            if (!mechanicName || !mechanicAddress) {
                return res.status(400).json({ success: false, error: 'Mechanic name and address are required' });
            }
            bookingData.mechanicName = mechanicName;
            bookingData.mechanicAddress = mechanicAddress;
        } else if (serviceType === 'car_wash') {
            bookingData.serviceAddress = serviceAddress || mechanicAddress;
            bookingData.packageType = packageType || 'basic';
        }

        const booking = await Booking.create(bookingData);

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get price quote
// @route   POST /api/bookings/quote
// @access  Public
exports.getPriceQuote = async (req, res, next) => {
    try {
        const { serviceType, rideType, distanceKm, packageType } = req.body;
        const price = calculatePrice(serviceType, { rideType, distanceKm, packageType });

        const response = { success: true, price };

        // For rides, also return premium price
        if (serviceType === 'ride') {
            response.economyPrice = calculatePrice('ride', { rideType: 'economy', distanceKm });
            response.premiumPrice = calculatePrice('ride', { rideType: 'premium', distanceKm });
        }

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
