const mongoose = require('mongoose');

const momoSchema = new mongoose.Schema({
    orderId: {
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

module.exports = mongoose.model('MoMoTransaction', momoSchema);