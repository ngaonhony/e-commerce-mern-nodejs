// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
   orderId: String,
   amount: Number,
   transactionId: String,
   bankCode: String,
   status: String,
   createdAt: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);

// createdAt: { type: Date, default: Date.now },  // Tự động gán giá trị ngày giờ hiện tại nếu không cung cấp
