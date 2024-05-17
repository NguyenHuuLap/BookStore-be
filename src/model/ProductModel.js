const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        image1:  { type: String },
        image2:  { type: String },
        image3:  { type: String },
        image4:  { type: String },
        image5:  { type: String },
        image6:  { type: String },
        type: { type: String, required: true },
        publishingHouse: { type: String, required: true },
        author: { type: String, required: true },
        supplier: { type: String, require: true },
        form: { type: String, require: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, default: 0 },
        description: { type: String },
        discount: { type: Number },
        selled: { type: Number }
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;