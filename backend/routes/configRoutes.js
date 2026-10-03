const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get application config
// @route   GET /api/config/maps
// @access  Private - only authenticated users can get map config
router.get('/maps', protect, (req, res) => {
    // Only return the key if it exists and user is authenticated
    const apiKey = process.env.GOMAPS_API_KEY;
    if (!apiKey) {
        return res.status(404).json({ success: false, error: 'Map configuration not available' });
    }
    res.status(200).json({ success: true, apiKey });
});

module.exports = router;
