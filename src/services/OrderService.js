const Order = require("../model/OrderProduct")
const Product = require("../model/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email, priceDiscount } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${arrId.join(',')} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city, phone
                    },
                    paymentMethod,
                    itemsPrice,
                    priceDiscount,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, paidAt
                })
                if (createdOrder) {
                    await EmailService.sendEmailCreateOrder(email, orderItems)
                    resolve({
                        status: 'OK',
                        message: 'success'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the order by ID to check its status
            const order = await Order.findById(id);
            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'Order not found'
                });
            }

            // Check if the order status is "shipping" or "complete"
            if (order.status === 'shipping' || order.status === 'complete') {
                return resolve({
                    status: 'ERR',
                    message: 'Cannot cancel an order that is shipping or complete'
                });
            }

            // Check if the order status is "confirm"
            if (order.status === 'confirm') {
                // Update order status to "re-cancel"
                await Order.findByIdAndUpdate(id, { status: 're-cancel' }, { new: true });
            } else if (order.status === 'pending') {
                // Update order status to "cancel"
                await Order.findByIdAndUpdate(id, { status: 'cancel' }, { new: true });
            }

            const promises = data.map(async (item) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        selled: { $gte: item.amount }
                    },
                    {
                        $inc: {
                            countInStock: +item.amount,
                            selled: -item.amount
                        }
                    },
                    { new: true }
                );

                if (!productData) {
                    return {
                        status: 'ERR',
                        message: `Product with id: ${item.product} not found or insufficient selled amount`
                    };
                }
            });

            const results = await Promise.all(promises);
            const error = results.find(result => result && result.status === 'ERR');

            if (error) {
                return resolve(error);
            }

            resolve({
                status: 'OK',
                message: 'Order successfully canceled',
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
};

const completeOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the order by ID to check its status
            const order = await Order.findById(id);
            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'Order not found'
                });
            }

            // Check if the order status is "shipping" or "complete"
            if (order.status === 'shipping' || order.status === 'complete') {
                return resolve({
                    status: 'ERR',
                    message: 'Cannot cancel an order that is shipping or complete'
                });
            }

            const promises = data.map(async (item) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        selled: { $gte: item.amount }
                    },
                    {
                        $inc: {
                            countInStock: +item.amount,
                            selled: -item.amount
                        }
                    },
                    { new: true }
                );

                if (productData) {
                    await Order.findByIdAndUpdate(id, { status: 'cancel' }, { new: true });
                } else {
                    return {
                        status: 'ERR',
                        message: `Product with id: ${item.product} not found or insufficient selled amount`
                    };
                }
            });

            const results = await Promise.all(promises);
            const error = results.find(result => result && result.status === 'ERR');

            if (error) {
                return resolve(error);
            }

            resolve({
                status: 'OK',
                message: 'Order successfully canceled',
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateOrderStatus = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentOrder = await Order.findById(orderId);
            if (!currentOrder) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                });
            }

            // Check if the current status is 'cancel' or 'complete'
            if (currentOrder.status === 'cancel' || currentOrder.status === 'complete') {
                return resolve({
                    status: 'ERR',
                    message: `Cannot update status because the current status is ${currentOrder.status}`
                });
            }

            // Determine the new status based on the current status
            let newStatus;
            switch (currentOrder.status) {
                case 'pending':
                    newStatus = 'confirm';
                    updateMessage = 'Order confirmed';
                    break;
                case 'confirm':
                    newStatus = 'shipping';
                    updateMessage = 'Order is being shipped';
                    break;
                case 'shipping':
                    newStatus = 'complete';
                    updateMessage = 'Order completed';
                    break;
                case 're-cancel':
                    newStatus = 'cancel';
                    updateMessage = 'Order cancel';
                    break;
                default:
                    return resolve({
                        status: 'ERR',
                        message: 'Invalid current status for automatic update'
                    });
            }

            // Update the order status
            const order = await Order.findByIdAndUpdate(
                orderId,
                { status: newStatus },
                { new: true }
            );

            resolve({
                status: 'OK',
                message: updateMessage,
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus,
    completeOrderDetails
}