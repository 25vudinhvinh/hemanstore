const pool = require("../config/pg");

const Products = {
    getAllSize: async () => {
        try {
            const query = await pool.query(`SELECT DISTINCT size FROM sizes
                ORDER BY size`);
            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching size: ${err.message}`);
        }
    },
    getHotProducts: async () => {
        try {
            const query = await pool.query(
                `SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, p.views, b.name AS brand_name, i.image_url, i.image_type FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN images i ON p.id = i.product_id
            WHERE i.image_type = 'main'
            ORDER BY p.views DESC
            LIMIT 10`
            );
            return query.rows;
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
            return query.rows;
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
            return query.rows;
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
            return query.rows;
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
            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching adidas: ${err.message}`);
        }
    },

    getDetail: async (productId) => {
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
                [productId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(
                `Error fetching get detail product: ${err.message}`
            );
        }
    },

    getSameProduct: async (brandId, productId) => {
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
                [brandId, productId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching same product: ${err.message}`);
        }
    },

    getBigSize: async (limitProduct, offset, sizes) => {
        try {
            const query = await pool.query(
                `
        SELECT DISTINCT p.id, p.name, p.price, p.price_sale, p.views, p.brand_id, 
               array_agg(DISTINCT s.size) AS sizes,
               jsonb_agg(DISTINCT jsonb_build_object('url', i.image_url, 'type', i.image_type)) AS images
        FROM products p
        LEFT JOIN images i ON p.id = i.product_id AND i.image_type IN ('main', 'hover')
        LEFT JOIN sizes s ON p.id = s.product_id ${
            sizes ? "AND s.size = ANY($3)" : ""
        }
        WHERE s.size > 43
        GROUP BY p.id
        ORDER BY p.brand_id, p.id
        LIMIT $1 OFFSET $2   
    `,
                sizes ? [limitProduct, offset, sizes] : [limitProduct, offset]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching big size: ${err.message}`);
        }
    },
    CountBigsize: async (sizes) => {
        try {
            const query = await pool.query(
                `SELECT COUNT(DISTINCT p.id) AS total_count
            FROM products p
            LEFT JOIN images i ON p.id = i.product_id
            LEFT JOIN sizes s ON p.id = s.product_id ${
                sizes ? "AND s.size = ANY($1)" : ""
            }
            WHERE s.size > 43 AND i.image_type IN ('main', 'hover');`,
                sizes ? [sizes] : ""
            );
            return query.rows;
        } catch (err) {
            throw new Error(`error count big size: ${err.message}`);
        }
    },

    getProductsCategory: async (brandId, sizes, limitProduct, offSet) => {
        try {
            const query = await pool.query(
                `SELECT p.id, p.name, p.brand_id, p.price, p.price_sale, 
            ARRAY_AGG(DISTINCT s.size ORDER BY s.size) AS sizes, 
            JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('url', i.image_url, 'type', i.image_type)) AS images 
     FROM products p
     JOIN sizes s ON p.id = s.product_id
     JOIN images i ON p.id = i.product_id AND i.image_type IN ('main', 'hover')
     WHERE p.brand_id = $1 ${sizes ? "AND s.size = ANY($2)" : ""}
     GROUP BY p.id
     ORDER BY p.id, p.brand_id
     ${sizes ? `LIMIT $3 OFFSET $4` : `LIMIT $2 OFFSET $3`}`,
                sizes
                    ? [brandId, sizes, limitProduct, offSet]
                    : [brandId, limitProduct, offSet]
            );

            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching product category: ${err.message}`);
        }
    },

    countProductCategory: async (brandId, sizes) => {
        try {
            const query = await pool.query(
                `
            SELECT COUNT (distinct p.id) AS total_count FROM products p
            JOIN sizes s ON p.id = s.product_id ${
                sizes ? "AND s.size = ANY($2)" : ""
            }
          WHERE p.brand_id = $1 
                `,
                sizes ? [brandId, sizes] : [brandId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error count product category:${err.message}`);
        }
    },
};

module.exports = Products;
