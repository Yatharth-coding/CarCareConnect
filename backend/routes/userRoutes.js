const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name: name.trim() },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
router.delete('/profile', protect, async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
