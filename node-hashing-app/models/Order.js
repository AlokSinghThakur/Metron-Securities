const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    orderName: { type: String, required: true },
    userName: { type: String, required: true },
    jibrish: { type: String, required: true }
});

module.exports = mongoose.model("Order", OrderSchema);
