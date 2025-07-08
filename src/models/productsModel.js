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

    searchProduct: async (searchTerm) => {
        try {
            const query = await pool.query(
                `
                SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, i.image_url FROM products p 
            JOIN images i ON p.id = i.product_id AND i.image_type IN('main')
            WHERE p.name ILIKE $1
            GROUP BY p.id, i.id
            ORDER BY p.id
                `,
                [searchTerm]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error find product: ${err.message}`);
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

    getProductsCategory: async (
        brandId,
        subBrandId,
        sizes,
        limitProduct,
        offSet,
        minPrice,
        maxPrice
    ) => {
        try {
            let queryStr = `
            SELECT p.id, p.name, p.brand_id, p.sub_brand_id, p.price, p.price_sale, 
            ARRAY_AGG(DISTINCT s.size ORDER BY s.size) AS sizes, 
            JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('url', i.image_url, 'type', i.image_type)) AS images 
            FROM products p
            JOIN sizes s ON p.id = s.product_id
            JOIN images i ON p.id = i.product_id AND i.image_type IN ('main', 'hover')
        `;
            const params = [];

            if (!brandId && !subBrandId) {
                queryStr += `WHERE s.size > 44`;
            } else {
                if (brandId) {
                    queryStr += `WHERE p.brand_id = $${params.length + 1}`;
                    params.push(brandId);
                }

                if (subBrandId) {
                    if (params.length > 0) {
                        queryStr += ` AND p.sub_brand_id = $${
                            params.length + 1
                        }`;
                    } else {
                        queryStr += `WHERE p.sub_brand_id = $${
                            params.length + 1
                        }`;
                    }
                    params.push(subBrandId);
                }
            }
            if (sizes) {
                queryStr += ` AND s.size = ANY($${params.length + 1})`;
                params.push(sizes);
            }

            if (minPrice !== null && maxPrice !== null) {
                queryStr += ` AND p.price_sale BETWEEN $${
                    params.length + 1
                } AND $${params.length + 2}`;
                params.push(minPrice, maxPrice);
            }

            queryStr += `
            GROUP BY p.id
            ORDER BY p.id, p.brand_id
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
            params.push(limitProduct, offSet);

            const query = await pool.query(queryStr, params);
            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching product category: ${err.message}`);
        }
    },

    countProductCategory: async (
        brandId,
        subBrandId,
        sizes,
        minPrice,
        maxPrice
    ) => {
        try {
            let queryStr = `
            SELECT COUNT(DISTINCT p.id) AS total_count
            FROM products p
            JOIN sizes s ON p.id = s.product_id
        `;
            const params = [];
            if (!brandId && !subBrandId) {
                queryStr += `WHERE s.size > 44`;
            } else {
                if (brandId) {
                    queryStr += `WHERE p.brand_id = $${params.length + 1}`;
                    params.push(brandId);
                }

                if (subBrandId) {
                    if (params.length > 0) {
                        queryStr += ` AND p.sub_brand_id = $${
                            params.length + 1
                        }`;
                    } else {
                        queryStr += `WHERE p.sub_brand_id = $${
                            params.length + 1
                        }`;
                    }
                    params.push(subBrandId);
                }
            }

            if (sizes) {
                queryStr += ` AND s.size = ANY($${params.length + 1})`;
                params.push(sizes);
            }

            if (minPrice !== null && maxPrice !== null) {
                queryStr += ` AND p.price_sale BETWEEN $${
                    params.length + 1
                } AND $${params.length + 2}`;
                params.push(minPrice, maxPrice);
            }

            const query = await pool.query(queryStr, params);
            return query.rows;
        } catch (err) {
            throw new Error(`Error counting product category: ${err.message}`);
        }
    },
};

module.exports = Products;
