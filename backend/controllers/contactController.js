const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

exports.contactValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });

        res.status(201).json({
            success: true,
            data: { id: contact._id },
            message: 'Your message has been received. We will get back to you soon!'
        });
    } catch (error) {
        next(error);
    }
};
