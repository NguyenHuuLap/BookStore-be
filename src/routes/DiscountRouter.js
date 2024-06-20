const express = require("express");
const router = express.Router()
const DiscountController = require('../controller/DiscountController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', DiscountController.createDiscount);
router.get('/', DiscountController.getAllDiscounts);
router.get('/:code', DiscountController.getDiscountByCode);
router.put('/:id', DiscountController.updateDiscount);
router.delete('/:id', DiscountController.deleteDiscount);
router.get('/detail/:id', DiscountController.getDetailDiscount);

module.exports = router