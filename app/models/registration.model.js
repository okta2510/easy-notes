const mongoose = require('mongoose');

const RegistrationSchema = mongoose.Schema({
    username: String,
    password: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Registration', RegistrationSchema);