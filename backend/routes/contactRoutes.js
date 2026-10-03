const express = require('express');
const { submitContact, contactValidation } = require('../controllers/contactController');

const router = express.Router();

router.post('/', contactValidation, submitContact);

module.exports = router;
