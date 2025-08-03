const orderModel = require("../models/orderModel");
const { body, validationResult } = require("express-validator");

// create order
exports.createOrder = [
    body("firstName").notEmpty().withMessage("Họ là bắt buộc"),
    body("lastName").notEmpty().withMessage("Tên là bắt buộc"),
    body("address").notEmpty().withMessage("Địa chỉ là bắt buộc"),
    body("numberPhone")
        .notEmpty()
        .withMessage("Điện thoại là bắt buộc")
        .bail()
        .isMobilePhone("vi-VN")
        .withMessage("Số điện thoại không hợp lệ"),
    body("email")
        .notEmpty()
        .withMessage("Email là bắt buộc")
        .bail()
        .isEmail()
        .withMessage("Email không hợp lệ"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let {
                firstName,
                lastName,
                address,
                numberPhone,
                email,
                note = null,
                products,
                totalPrice,
            } = req.body;

            const totalPriceNum = parseFloat(totalPrice);
            if (isNaN(totalPriceNum)) {
                return res.status(400).json({
                    message: "totalPrice is require and must is a number.",
                });
            }

            const createCustomerId = await orderModel.createCustomer(
                firstName,
                lastName,
                address,
                email,
                numberPhone
            );
            const customerId = parseInt(createCustomerId.id);
            if (isNaN(customerId)) {
                return res
                    .status(400)
                    .json({ message: "Invalid customer ID." });
            }

            if (!Array.isArray(products) || products.length === 0) {
                return res
                    .status(400)
                    .json({ message: "products must be a array." });
            }

            const createOrderId = await orderModel.createOrders(
                customerId,
                totalPriceNum,
                note
            );
            const orderId = createOrderId.id;

            for (const product of products) {
                const productId = product.productId;
                const size = product.size;
                const quantity = product.quantity;

                if (quantity || !productId || !size) {
                    return res
                        .status(400)
                        .json({
                            message: "quantity, productId and size is require.",
                        });
                }

                const orderDetailId = await orderModel.createOrderDetail(
                    orderId,
                    productId,
                    size,
                    quantity
                );
            }

            res.status(200).json({
                success: true,
                message: "Đặt hàng thành công.",
                orderId: orderId,
                customerId: customerId,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
];

// get order by name, phone, address of customer
exports.getOrder = async (req, res) => {
    try {
        const result = await orderModel.getOrder();
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
