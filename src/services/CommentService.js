const Comment = require("../model/CommentModel");
const Order = require("../model/OrderProduct");
const Product = require("../model/ProductModel")
const User = require("../model/UserModel")

const createComment = (newComment) => {
  return new Promise(async (resolve, reject) => {
    const { productId, orderId, userId, comment, star } = newComment;

    try {
      const orderCheck = await Order.findOne({ _id: orderId });
      if (!orderCheck) {
        return reject({ status: 'ERR', message: 'Order not found', id: orderId });
      }

      // Kiểm tra xem đã có comment cho sản phẩm trong đơn hàng chưa
      const existingComment = await Comment.findOne({ order: orderId, product: productId, user: userId });
      if (existingComment) {
        return reject({ status: 'ERR', message: 'Comment already exists for this product in this order', orderId, productId, userId });
      }

      const createdComment = await Comment.create({
        order: orderId,
        user: userId,
        product: productId,
        comment: comment,
        star: star
      });


      //  Update the product's rating based on the new comment's star
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return reject({ status: 'ERR', message: 'Product not found', id: productId });
      }

      // Calculate new average rating
      const totalStars = product.rating * product.numComments + star;
      const numComments = product.numComments + 1;
      const newRating = totalStars / numComments;

      // Update product's rating
      await Product.updateOne({ _id: productId }, { rating: newRating, numComments: numComments });

      resolve({
        status: 'OK',
        message: 'Comment created successfully',
        data: createdComment
      });
    } catch (error) {
      reject(error);
    }
  });
};


const getDetailsComment = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return {
        status: 'ERR',
        message: 'Comment not found'
      };
    }

    const user = await User.findById(comment.user, 'name');
    const product = await Product.findById(comment.product, 'name');
    if (!user || !product) {
      return {
        status: 'ERR',
        message: 'User or Product not found'
      };
    }

    return {
      status: 'OK',
      message: 'Comment details found',
      data: {
        user: user.name,
        product: product.name,
        comment: comment.comment,
        star: comment.star,
      }
    };
  } catch (error) {
    throw error;
  }
};

const getDetailsCommentByProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comments = await Comment.find({ product: productId }).populate('user', 'name email'); // Populating user details
      if (!comments || comments.length === 0) {
        return resolve({
          status: 'ERR',
          message: 'No comments found for this product'
        });
      }

      resolve({
        status: 'OK',
        message: 'Comments found',
        data: comments
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllComment = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allComments = await Comment.find()
        .populate('user', 'name') // Nạp trường 'name' từ bảng 'users'
        .populate('product', 'name') // Nạp trường 'name' từ bảng 'products'
        .select('comment star createdAt updatedAt') // Chọn trường 'comment' và 'star'
        .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

      resolve({
        status: 'OK',
        message: 'Success',
        data: allComments
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateComment = (commentId, commentstatus, star) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Find the comment by its ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return reject({ status: 'ERR', message: 'Comment not found', id: commentId });
      }

      // Update the comment fields if they exist in the updated data
      if (commentstatus) {
        comment.comment = commentstatus;
      }
      if (star) {
        comment.star = star;
      }

      // Save the updated comment
      const updatedComment = await comment.save();

      // If the star field was updated, also update the product's rating
      if (star) {
        const product = await Product.findOne({ _id: comment.product });
        if (!product) {
          return reject({ status: 'ERR', message: 'Product not found', id: comment.product });
        }

        // Calculate new average rating
        const totalStars = product.rating * product.numComments - comment.star + star;
        const newRating = totalStars / product.numComments;

        // Update product's rating
        await Product.updateOne({ _id: product._id }, { rating: newRating });
      }

      resolve({
        status: 'OK',
        message: 'Comment updated successfully',
        data: updatedComment
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteComment = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkComment = await Comment.findOne({
        _id: id
      })
      if (checkComment === null) {
        resolve({
          status: 'ERR',
          message: 'The comment is not defined'
        })
      }

      await Comment.findByIdAndDelete(id)
      resolve({
        status: 'OK',
        message: 'Delete comment success',
      })
    } catch (e) {
      reject(e)
    }
  })
}

const deleteManyComment = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Comment.deleteMany({ _id: ids })
      resolve({
        status: 'OK',
        message: 'Delete comment success',
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  createComment,
  getDetailsComment,
  getAllComment,
  updateComment,
  deleteComment,
  deleteManyComment,
  getDetailsCommentByProduct
};
