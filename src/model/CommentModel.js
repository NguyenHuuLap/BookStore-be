const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', require: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        comment: { type: String, required: true },
        star: { type: Number, default: 5, min: 1, max: 5 },
    },
    {
        timestamps: true,
    }
);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;