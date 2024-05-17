const express = require("express");
const router = express.Router()
const CommentController = require('../controller/CommentController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create/:id', CommentController.createComment)

module.exports = router