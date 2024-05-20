const CommentService = require('../services/CommentService');

const createComment = async (req, res) => {
    try {
        const productId = req.params.id;
        const orderId = req.body.comment.orderId;
        const userId = req.body.comment.userId;
        const comment = req.body.comment.comment;
        const star = req.body.comment.star
        if (!comment) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Comment is a required field.'
            });
        }
        const response = await CommentService.createComment({ productId, orderId, userId, comment, star });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getDetailsComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        if (!commentId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The commentId is required'
            });
        }

        const response = await CommentService.getDetailsComment(commentId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getAllComment = async (req, res) => {
    try {
        const data = await CommentService.getAllComment()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = req.body.comment.comment;
        const star = req.body.comment.star;
        if (!commentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId and status are required'
            });
        }
        const response = await CommentService.updateComment(commentId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id
        if (!commentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The commentId is required'
            })
        }
        const response = await CommentService.deleteComment(commentId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await CommentService.deleteManyComment(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsCommentByProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Sử dụng req.params thay vì req.body vì productId được truyền qua URL
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            });
        }
        const response = await CommentService.getDetailsCommentByProduct(productId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
  };

module.exports = {
    createComment,
    getDetailsComment,
    getAllComment,
    updateComment,
    deleteComment,
    deleteMany,
    getDetailsCommentByProduct
}
