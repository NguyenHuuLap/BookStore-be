const Discount = require('../model/DiscountModel');

const createDiscount = async (newDiscount) => {
    try {
        const { code, percentage, startDate, endDate, active } = newDiscount;

        // Check if the discount code already exists
        const checkDiscount = await Discount.findOne({ code });
        if (checkDiscount) {
            return {
                status: 'ERR',
                message: 'The discount code already exists'
            };
        }

        // Create a new discount
        const discount = await Discount.create({
            code,
            percentage,
            startDate,
            endDate,
            active
        });

        return {
            status: 'OK',
            message: 'Discount created successfully',
            data: discount
        };
    } catch (error) {
        throw error;
    }
};

const getAllDiscounts = async () => {
    try {
        const discounts = await Discount.find({});
        return {
            status: 'OK',
            message: 'Fetched all discounts successfully',
            data: discounts
        };
    } catch (error) {
        throw error;
    }
};

const getDiscountByCode = async (code) => {
    try {
        const discount = await Discount.findOne({ code });
        if (!discount) {
            return {
                status: 'ERR',
                message: 'Discount not found'
            };
        }
        return {
            status: 'OK',
            message: 'Discount fetched successfully',
            data: discount
        };
    } catch (error) {
        throw error;
    }
};

const updateDiscount = async (id, updateData) => {
    try {
        const discount = await Discount.findByIdAndUpdate(id, updateData, { new: true });
        if (!discount) {
            return {
                status: 'ERR',
                message: 'Discount not found'
            };
        }
        return {
            status: 'OK',
            message: 'Discount updated successfully',
            data: discount
        };
    } catch (error) {
        throw error;
    }
};

const deleteDiscount = async (id) => {
    try {
        const discount = await Discount.findByIdAndDelete(id);
        if (!discount) {
            return {
                status: 'ERR',
                message: 'Discount not found'
            };
        }
        return {
            status: 'OK',
            message: 'Discount deleted successfully'
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createDiscount,
    getAllDiscounts,
    getDiscountByCode,
    updateDiscount,
    deleteDiscount
};
