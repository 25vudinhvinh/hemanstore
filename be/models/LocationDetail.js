// models/LocationDetails
const pool = require("../config/database");

const getLocationsAlls = async (req, res) => {
    const categoryName = req.body.categoryName;

    const results = await pool.query(
        `SELECT 
                l.*,
                COALESCE(MAX(CASE WHEN i.is_primary = TRUE THEN i.image_url END), '') AS primary_image,
                COALESCE(STRING_AGG(CASE WHEN i.is_primary = FALSE THEN i.image_url END, ', '), '') AS other_images,
                STRING_AGG(DISTINCT c2.name, ', ') AS category_names,
                COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
                COUNT(DISTINCT r.review_id) AS review_count, 
                COALESCE(STRING_AGG(DISTINCT ri.image_url, ', '), '') AS review_image_urls
            FROM locations l
            JOIN location_categories lc ON l.location_id = lc.location_id
            JOIN categories c ON lc.category_id = c.category_id
            LEFT JOIN images i ON l.location_id = i.location_id
            LEFT JOIN location_categories lc2 ON l.location_id = lc2.location_id
            LEFT JOIN categories c2 ON lc2.category_id = c2.category_id
            LEFT JOIN reviews r ON l.location_id = r.location_id
            LEFT JOIN review_images ri ON r.review_id = ri.review_id
            WHERE c.name = $1
            GROUP BY 
                l.location_id,
                l.name,
                l.address,
                l.latitude,
                l.longitude,
                l.open_hours,
                l.description,
                l.additional_services,
                l.created_at;`,
        [categoryName]
    );

    res.json(results.rows);
};
const getNearbyLocations = async (req, res) => {
    const { latitude, longitude, radius } = req.body;
    const results = await pool.query(
        `
       SELECT 
    l.location_id,
    l.name,
    l.address,
    l.latitude,
    l.longitude,
    l.open_hours,
    l.description,
    l.additional_services,
    l.created_at,
    ROUND(
        (6371 * acos(
            cos(radians($1)) * cos(radians(l.latitude)) * 
            cos(radians(l.longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(l.latitude))
        ))::numeric, 2
    ) AS distance,
    (SELECT i.image_url 
     FROM images i 
     WHERE i.location_id = l.location_id AND i.is_primary = true 
     LIMIT 1) AS primary_image,
    (SELECT STRING_AGG(i.image_url, ', ') 
     FROM images i 
     WHERE i.location_id = l.location_id AND i.is_primary = false) AS other_images,
    (SELECT STRING_AGG(c.name, ', ') 
     FROM categories c 
     JOIN location_categories lc ON c.category_id = lc.category_id 
     WHERE lc.location_id = l.location_id) AS category_names,
    COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating, 
    COUNT(r.review_id) AS review_count,
    (SELECT STRING_AGG(ri.image_url, ', ') 
     FROM review_images ri 
     JOIN reviews rv ON ri.review_id = rv.review_id 
     WHERE rv.location_id = l.location_id) AS review_image_urls
FROM 
    locations l
LEFT JOIN 
    reviews r ON l.location_id = r.location_id
WHERE 
    ROUND(
        (6371 * acos(
            cos(radians(21.055292)) * cos(radians(l.latitude)) * 
            cos(radians(l.longitude) - radians(105.7416682)) + 
            sin(radians(21.055292)) * sin(radians(l.latitude))
        ))::numeric, 2
    ) < $3
GROUP BY 
    l.location_id, l.name, l.address, l.latitude, l.longitude, 
    l.open_hours, l.description, l.additional_services, l.created_at
ORDER BY 
    distance
LIMIT 20;
        `,
        [latitude, longitude, radius]
    );
    res.json(results.rows);
};
module.exports = { getLocationsAlls, getNearbyLocations };
