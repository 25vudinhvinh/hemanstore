const pool = require("../config/pg");
const order = {
    createCustomer: async (
        firstName,
        lastName,
        address,
        email,
        phoneNumber
    ) => {
        try {
            const checkCustomer = await pool.query(
                `SELECT id FROM customers
                WHERE first_name = $1 AND last_name = $2 AND address = $3 AND email = $4 AND phone_number = $5
                `,
                [firstName, lastName, address, email, phoneNumber]
            );

            if (checkCustomer.rowCount > 0) {
                return checkCustomer.rows[0];
            } else {
                const query = await pool.query(
                    `
                    INSERT INTO customers(first_name, last_name, address, email, phone_number)
                    VALUES ($1, $2, $3, $4, $5) RETURNING id
                    `,
                    [firstName, lastName, address, email, phoneNumber]
                );
                return query.rows[0];
            }
        } catch (err) {
            throw new Error(`Error create customer: ${err.message}`);
        }
    },

    createOrderDetail: async (orderId, productId, size, quantity) => {
        try {
            const query = await pool.query(
                `
            INSERT INTO order_detail(order_id, product_id, size, quantity)
            VALUES ($1, $2, $3, $4) RETURNING id
            `,
                [orderId, productId, size, quantity]
            );
            return query.rows[0];
        } catch (err) {
            throw new Error(`Error create order detail: ${err.message}`);
        }
    },

    createOrders: async (customerId, totalPrice, note = null) => {
        try {
            const query = await pool.query(
                `
            INSERT INTO orders(customer_id, total_price, note)
            VALUES ($1, $2, $3) RETURNING id
            `,
                [customerId, totalPrice, note]
            );
            return query.rows[0];
        } catch (err) {
            throw new Error(`Error create orders: ${err.message}`);
        }
    },
};

module.exports = order;
