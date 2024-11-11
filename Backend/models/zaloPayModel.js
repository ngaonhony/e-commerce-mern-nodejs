const mongoose = require('mongoose');

const zaloPaySchema = new mongoose.Schema({
    app_trans_id: {
        type: String,
        required: false,
        unique: true, // Đảm bảo không có giao dịch trùng lặp
    },
    amount: {
        type: Number,
        required: false,
    },
    transactionId: {
        type: String,
        required: false,
    },
    bankCode: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ZaloPay', zaloPaySchema);