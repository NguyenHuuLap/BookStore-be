const DiscountService = require('../services/DiscountService');

const createDiscount = async (req, res) => {
    try {
        const { code, percentage, startDate, endDate, active } = req.body;

        if (!code || !percentage || !startDate || !endDate) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Please provide all required fields (code, percentage, startDate, endDate)'
            });
        }

        const newDiscount = { code, percentage, startDate, endDate, active };
        const response = await DiscountService.createDiscount(newDiscount);

        if (response.status === 'OK') {
            return res.status(201).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const getAllDiscounts = async (req, res) => {
    try {
        const response = await DiscountService.getAllDiscounts();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const getDiscountByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const response = await DiscountService.getDiscountByCode(code);
        if (response.status === 'OK') {
            return res.status(200).json(response);
        } else {
            return res.status(404).json(response);
        }
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const updateDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        const updateData = req.body;
        const response = await DiscountService.updateDiscount(discountId, updateData);

        if (response.status === 'OK') {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const deleteDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        const response = await DiscountService.deleteDiscount(discountId);

        if (response.status === 'OK') {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

module.exports = {
    createDiscount,
    getAllDiscounts,
    getDiscountByCode,
    updateDiscount,
    deleteDiscount
};
