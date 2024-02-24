const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique : true,
        min: 5,
        max:254
    },
    password: {
        type: String,
        required: true
    },
    roles: [{ type: String }],
    enabled: {
        type: Boolean,
        require: true
    },
    verificationCode: {
        type: String,
        max: 8
    },
    name: {
        type: String,
        required: true,
        min: 2,
        max: 32
    },
    userCreatedDate: {
        type: Date,
        default: Date.now
    },
    logs: [{
        message: { type: String, required: true },
        kind: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model('users', userSchema)