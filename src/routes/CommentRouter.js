const express = require("express");
const router = express.Router()
const CommentController = require('../controller/CommentController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create/:id', authUserMiddleWare, CommentController.createComment)
router.get('/get-details/:id', CommentController.getDetailsComment)
router.get('/get-all-comment', CommentController.getAllComment)
router.get('/update', CommentController.updateComment)
router.post('/delete-many', authMiddleWare, CommentController.deleteMany)
router.delete('/delete/:id', authMiddleWare, CommentController.deleteComment)

module.exports = router