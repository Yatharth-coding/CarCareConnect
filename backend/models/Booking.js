const mongoose = require('mongoose');

// Server-side pricing configuration
const PRICING = {
    ride: {
        economy: { baseFare: 2, perKm: 1.5 },
        premium: { baseFare: 5, perKm: 2.5 }
    },
    mechanic: {
        callout: 50
    },
    car_wash: {
        basic: 20,
        premium: 40,
        full_detail: 80
    }
};

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['ride', 'mechanic', 'car_wash']
    },
    // Ride specific
    pickupLocation: {
        type: String,
        required: function() { return this.serviceType === 'ride'; }
    },
    dropoffLocation: {
        type: String,
        required: function() { return this.serviceType === 'ride'; }
    },
    rideType: {
        type: String,
        enum: ['economy', 'premium'],
        default: 'economy'
    },
    distanceKm: {
        type: Number,
        min: 0
    },
    // Mechanic specific
    mechanicName: {
        type: String,
        required: function() { return this.serviceType === 'mechanic'; }
    },
    mechanicAddress: {
        type: String,
        required: function() { return this.serviceType === 'mechanic'; }
    },
    // Car Wash specific
    serviceAddress: {
        type: String,
        required: function() { return this.serviceType === 'car_wash'; }
    },
    packageType: {
        type: String,
        enum: ['basic', 'premium', 'full_detail'],
        required: function() { return this.serviceType === 'car_wash'; }
    },
    // Common fields
    scheduledAt: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                // Allow bookings at least 30 minutes in the future
                return value > new Date(Date.now() - 5 * 60 * 1000);
            },
            message: 'Booking must be scheduled for a future date and time'
        }
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
module.exports.PRICING = PRICING;
