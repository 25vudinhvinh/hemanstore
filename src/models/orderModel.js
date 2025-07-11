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

    getOrder: async () => {
        try {
            const query = await pool.query(`SELECT 
    c.first_name ,
    c.last_name ,
    c.address,
    c.phone_number,
    c.email,
    json_agg(
        json_build_object(
            'orderId', o.id,
            'note', o.note,
            'status', o.status,
            'totalPrice', o.total_price,
            'date', o.date,
            'products', (
                SELECT json_agg(
                    json_build_object(
                        'productId', od.product_id,
                        'size', od.size,
                        'quantity', od.quantity
                    )
                )
                FROM order_detail od
                WHERE od.order_id = o.id
            )
        )
    ) AS orders
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;`);
            return query.rows;
        } catch (err) {
            throw new Error(`Error get order: ${err.message}`);
        }
    },
};

module.exports = order;
