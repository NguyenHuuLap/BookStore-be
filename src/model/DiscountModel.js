const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Discount = mongoose.model('Discount', DiscountSchema);

module.exports = Discount;