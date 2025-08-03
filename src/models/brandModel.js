const poll = require("../config/pg");

const Brand = {
    getAll: async () => {
        try {
            const result = await poll.query(
                `SELECT b.id AS brand_id, b.name AS brand_name, b.display_order,
        CASE 
            WHEN COUNT(sb.id) > 0 THEN JSON_AGG(JSON_BUILD_OBJECT('sub_brand_id', sb.id, 'name', sb.name)) 
            ELSE NULL 
        END AS sub_brands
        FROM 
        brands b
        LEFT JOIN 
        sub_brands sb ON b.id = sb.brand_id
        WHERE 
        b.display_order <= 10
        GROUP BY 
        b.id, b.name, b.display_order`
            );
            return result.rows;
        } catch (err) {
            throw new Error(`Error model brands: ${err.message}`);
        }
    },
};

module.exports = Brand;
