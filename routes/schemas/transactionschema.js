const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema ({
    txnId: Number,
    fromAcc: {
        type: Number,
        required: [true,"Please enter from card id"]
    },
    toAcc: {
        type: Number,
        required: [true,"Please enter to card id"]
    },
    rate: {
        type: Number,
        required: [true,"Please enter to rate"]
    },
    amt: {
        type: Number,
        min:1,
        max:100000,
        required: [true,"Please enter amt"]
    },
    fromCurrency: {
        type: String,
        required: [true,"Please enter from currency"]
    },
    toCurrency: {
        type: String,
        required: [true,"Please enter to currency"]
    },
    timestamp: {
        type: Date,
        required: [true,"Please enter timestamp"]
    },
});

module.exports = mongoose.model('Transactions', transactionSchema);
