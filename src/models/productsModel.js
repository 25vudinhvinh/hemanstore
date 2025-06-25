const pool = require("../config/pg");

const Products = {
    getHotProducts: async () => {
        try {
            const query = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8`
            );
            return query;
        } catch (err) {
            throw new Error(`Error fetching hot products: ${err.message}`);
        }
    },

    getAdidas: async () => {
        try {
            const query = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'ADIDAS' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8`
            );
            return query;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getNike: async () => {
        try {
            const query = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'NIKE' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8 `
            );
            return query;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getMLB: async () => {
        try {
            const query = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'MLB' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8 `
            );
            return query;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getNEWBALANCE: async () => {
        try {
            const query = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE b.name = 'NEWBALANCE' AND i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 8 `
            );
            return query;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getDetail: async (product_id) => {
        try {
            const query = await pool.query(
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
            return query;
        } catch (err) {
            throw new Error(
                `Error fetching get detail product: ${err.message}`
            );
        }
    },

    getSameProduct: async (brand_id, product_id) => {
        try {
            const query = await pool.query(
                `
                SELECT p.id, p.name, p.price, p.price_sale, p.views, p.brand_id,
         jsonb_agg(json_build_object('url', i.image_url, 'type', i.image_type)) AS images
        FROM products p
        LEFT JOIN images i ON p.id = i.product_id
        WHERE p.brand_id = $1 AND i.image_type IN ('main', 'hover') AND p.id <> $2
        GROUP BY p.id
        ORDER BY RANDOM()
        LIMIT 8;`,
                [brand_id, product_id]
            );
            return query;
        } catch (err) {
            throw new Error(`Error fetching same product: ${err.message}`);
        }
    },

    getBigSize: async (limitProduct, offset) => {
        try {
            const query = await pool.query(
                `
        SELECT DISTINCT p.id, p.name, p.price, p.price_sale, p.views, p.brand_id, 
               array_agg(DISTINCT s.size) AS sizes,
               jsonb_agg(DISTINCT jsonb_build_object('url', i.image_url, 'type', i.image_type)) AS images
        FROM products p
        LEFT JOIN images i ON p.id = i.product_id
        LEFT JOIN sizes s ON p.id = s.product_id
        WHERE s.size > 44 AND i.image_type IN ('main', 'hover')
        GROUP BY p.id
        ORDER BY p.brand_id
        LIMIT $1 OFFSET (CAST($1 AS integer) * CAST($2 AS integer))     
    `,
                [limitProduct, offset]
            );
            return query;
        } catch (err) {
            throw new Error(`Error fetching big size: ${err.message}`);
        }
    },
    getCountBigsize: async () => {
        try {
            const query =
                await pool.query(`SELECT COUNT(DISTINCT p.id) AS total_count
            FROM products p
            LEFT JOIN images i ON p.id = i.product_id
            LEFT JOIN sizes s ON p.id = s.product_id
            WHERE s.size > 44 AND i.image_type IN ('main', 'hover');`);
            return query.rows;
        } catch (err) {
            throw new Error(`error fetching count big size: ${err.message}`);
        }
    },
};

module.exports = Products;
