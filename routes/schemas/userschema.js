const mongoose = require('mongoose');


const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: [true,"Please enter first name"]
    },
    lastName: {
        type: String,
        required: [true,"Please enter last name"]
    },
    phoneNumber: {
        type: Number,
        min:4,
        max:12,
        required: [true,"Please enter phone name"]
    },
    gender: String,
    email: String,
    country: {
        type: String,
        required: [true,"Please enter country"]
    },
    currency: {
        type: String,
        required: [true,"Please enter currency"]
    },
    dob: {
        type: Date,
        required: [true,"Please enter dob"]
    },
    createdDate: Date,
    accountType: String,
    cardId: Number,
    balanceAmt: Number,
    passcode: {
        type: Number,
        required: [true,"Please enter passcode"],
        min: 6,
        max:6,
    },
    password: {
        type: String,
        required: [true,"Please enter password"]
    },
});

module.exports = mongoose.model('Users', userSchema);
