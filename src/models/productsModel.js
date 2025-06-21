const pool = require("../config/pg");

const Products = {
    getHotProducts: async () => {
        try {
            const result = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8`
            );
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching hot products: ${err.message}`);
        }
    },

    getAdidas: async () => {
        try {
            const result = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'ADIDAS' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8`
            );
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getNike: async () => {
        try {
            const result = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'NIKE' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8 `
            );
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getMLB: async () => {
        try {
            const result = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'MLB' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8 `
            );
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getNEWBALANCE: async () => {
        try {
            const result = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'NEWBALANCE' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8 `
            );
            return result.rows;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getDetail: async (product_id) => {
        const result = await pool.query(
            `SELECT p.id AS product_id, p.name, p.price, p.brand_id, p.price_sale,
          array_agg(s.size) AS sizes, 
          (SELECT jsonb_agg(jsonb_build_object(
            'url', img.image_url,
            'display_order', img.display_order
          ) ORDER BY img.display_order ASC)
           FROM (SELECT DISTINCT image_url, display_order 
                 FROM images WHERE product_id = p.id) img
          ) AS images 
   FROM products p
   LEFT JOIN sizes s ON p.id = s.product_id
   WHERE p.id = $1
   GROUP BY p.id, p.name, p.price, p.price_sale
   ORDER BY p.id`,
            [product_id]
        );
        return result.rows;
    },
};

module.exports = Products;
