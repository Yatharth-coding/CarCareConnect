const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: 2000
    },
    status: {
        type: String,
        enum: ['new', 'read', 'responded'],
        default: 'new'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
