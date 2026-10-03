const express = require('express');
const { submitApplication, applicationValidation } = require('../controllers/driverApplicationController');

const router = express.Router();

router.post('/', applicationValidation, submitApplication);

module.exports = router;
