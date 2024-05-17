const Comment = require("../model/CommentModel");
const Order = require("../model/OrderProduct");

const createComment = (newComment) => {
    return new Promise(async (resolve, reject) => {
        const { id, userId, product, comment, star } = newComment;
        
        try {
            const orderCheck = await Order.findOne({ _id: order });
            if (!orderCheck) {
                return reject({ status: 'ERR', message: 'Order not found', id: orderId });
            }

            const createComment = await Comment.create({
                order: order,
                user: user,
                product: product,
                comment: comment,
                star: star
            });

            resolve({
                status: 'OK',
                message: 'Comment created successfully',
                data: createComment
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createComment
}