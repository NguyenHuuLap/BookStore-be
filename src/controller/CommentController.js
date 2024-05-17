const CommentService = require('../services/CommentService');

const createComment = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.body.comment.userId;
        // const productId = req.body.comment.map((orderItem) => orderItem.product)
    console.log(orderId, userId)
        if (!comment) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Both comment and star are required fields.'
            });
        }
        const response = await CommentService.createComment(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    createComment
}
