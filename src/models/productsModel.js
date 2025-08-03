const { query } = require("express-validator");
const pool = require("../config/pg");

const Products = {
    // get size by brandID
    getAllSize: async (brandId) => {
        try {
            const query = await pool.query(
                `SELECT DISTINCT size FROM sizes s
                JOIN products p ON s.product_id = p.id
                WHERE p.brand_id = $1
                ORDER BY size`,
                [brandId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error fetching size: ${err.message}`);
        }
    },

    // search product by name
    searchProduct: async (searchTerm) => {
        try {
            const query = await pool.query(
                `
                SELECT p.id, p.name, p.price, p.price_sale, p.brand_id, i.image_url FROM products p 
            JOIN images i ON p.id = i.product_id AND i.display_order IN (1)
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

    // get hot products
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

    // get adidas
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

    // get nike
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

    // get mlb
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

    // get newbalance
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

    // get detail
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

    // get same product
    getSameProduct: async (brandId, productId) => {
        try {
            const query = await pool.query(
                `
                SELECT p.id, p.name, p.price, p.price_sale, p.views, p.brand_id,
         jsonb_agg(json_build_object('url', i.image_url, 'order', i.display_order)) AS images
        FROM products p
        LEFT JOIN images i ON p.id = i.product_id
        WHERE p.brand_id = $1 AND i.display_order IN (1, 2) AND p.id <> $2
        GROUP BY p.id
        ORDER BY RANDOM()
        LIMIT 8;`,
                [brandId, productId]
            );
            return query.rows;
        } catch (err) {
            throw new Error(`Error model same product: ${err.message}`);
        }
    },

    // filter product by category
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
            JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('url', i.image_url, 'order', i.display_order)) AS images 
            FROM products p
            JOIN sizes s ON p.id = s.product_id
            JOIN images i ON p.id = i.product_id AND i.display_order IN (1, 2)
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
            throw new Error(`Error model product category: ${err.message}`);
        }
    },

    // count product by filter
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

    //admin create product
    createProduct: async (name, price, priceSale, brandId, subBrandId) => {
        try {
            const query = await pool.query(
                `INSERT INTO products (name, price, price_sale, brand_id, sub_brand_id)
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id`,
                [name, price, priceSale, brandId, subBrandId]
            );
            return query.rows[0].id;
        } catch (err) {
            throw new Error(`Error model create product: ${err.message}`);
        }
    },

    // admin create size
    createSize: async (productId, sizeArr) => {
        try {
            const results = [];
            for (let i = 0; i < sizeArr.length; i++) {
                const size = sizeArr[i];
                if (!Number.isInteger(size)) {
                    throw new Error(`Invalid size value: ${sizeArr[i]}`);
                }
                const query = await pool.query(
                    `INSERT INTO sizes(product_id, size) 
                 VALUES ($1, $2) RETURNING *`,
                    [productId, size]
                );
                results.push(query.rows[0]);
            }
            return results;
        } catch (err) {
            throw new Error(`Error model creat size: ${err.message}`);
        }
    },

    // admin create image
    createImage: async (productId, imageArr) => {
        try {
            const results = [];
            for (let i = 0; i < imageArr.length; i++) {
                const { url, order } = imageArr[i];
                if (!url || !Number.isInteger(order)) {
                    throw new Error(
                        `Invalid image data at index ${i}: ${JSON.stringify(
                            imageArr[i]
                        )}`
                    );
                }
                const query = await pool.query(
                    `INSERT INTO images(product_id, image_url, display_order) 
                 VALUES ($1, $2, $3) RETURNING *`,
                    [productId, url, order]
                );
                results.push(query.rows[0]);
            }
            return results;
        } catch (err) {
            throw new Error(`Error model creat image: ${err.message}`);
        }
    },

    // admin delete
    deleteProduct: async (productId) => {
        try {
            if (productId) {
                const query = pool.query(
                    `DELETE FROM products
                    WHERE id = $1
                    `,
                    [productId]
                );
            }
        } catch (err) {
            throw new Error(`Error model delete product: ${err.message}`);
        }
    },

    //admin update
    updateProduct: async (
        productId,
        name,
        price,
        priceSale,
        brandId,
        sizeArr,
        imageArr
    ) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const productCheck = await client.query(
                "SELECT id FROM products WHERE id = $1",
                [productId]
            );

            if (productCheck.rowCount === 0) {
                throw new Error(`Không tồn tại sản phẩm ID ${productId}`);
            }

            const query = await client.query(
                `UPDATE products 
            SET name = $1, price = $2, price_sale = $3, brand_id = $4
            WHERE id = $5
            RETURNING *`,
                [name, price, priceSale, brandId, productId]
            );

            await client.query(`DELETE FROM sizes WHERE product_id = $1`, [
                productId,
            ]);
            for (let size of sizeArr) {
                await client.query(
                    `INSERT INTO sizes (product_id, size) VALUES ($1, $2)`,
                    [productId, size]
                );
            }

            await client.query(`DELETE FROM images WHERE product_id = $1`, [
                productId,
            ]);
            for (let img of imageArr) {
                await client.query(
                    `INSERT INTO images (product_id, image_url, display_order)
                VALUES ($1, $2, $3)`,
                    [productId, img.imageUrl, img.displayOrder]
                );
            }

            await client.query("COMMIT");
            return query.rows[0];
        } catch (err) {
            await client.query("ROLLBACK");
            throw new Error(`Error model update product: ${err.message}`);
        } finally {
            client.release();
        }
    },
};

module.exports = Products;
