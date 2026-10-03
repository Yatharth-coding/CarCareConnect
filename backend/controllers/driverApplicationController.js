const DriverApplication = require('../models/DriverApplication');
const { body, validationResult } = require('express-validator');

exports.applicationValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('vehicleType').isIn(['sedan', 'suv', 'bike', 'truck']).withMessage('Invalid vehicle type'),
];

// @desc    Submit driver application
// @route   POST /api/driver-applications
// @access  Public
exports.submitApplication = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, vehicleType } = req.body;

        // Check for existing application
        const existing = await DriverApplication.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, error: 'An application with this email already exists' });
        }

        const application = await DriverApplication.create({ name, email, phone, vehicleType });

        res.status(201).json({
            success: true,
            data: { id: application._id },
            message: 'Your driver application has been submitted successfully!'
        });
    } catch (error) {
        next(error);
    }
};
