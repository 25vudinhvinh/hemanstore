const pool = require("../config/database");
const createReview = async (
    location_id,
    user_id,
    rating,
    comment,
    image_urls
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const reviewResult = await client.query(
            "INSERT INTO reviews (location_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING review_id",
            [location_id, user_id, rating, comment || null]
        );
        const review_id = reviewResult.rows[0].review_id;
        for (const image_url of image_urls) {
            await client.query(
                "INSERT INTO review_images (review_id, image_url) VALUES ($1, $2)",
                [review_id, image_url]
            );
        }
        await client.query("COMMIT");
        return { review_id, location_id, user_id, rating, comment, image_urls };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const checkLocationExists = async (location_id) => {
    const result = await pool.query(
        "SELECT 1 FROM locations WHERE location_id = $1",
        [location_id]
    );
    return result.rowCount > 0;
};

const checkUserExists = async (user_id) => {
    const result = await pool.query("SELECT 1 FROM users WHERE user_id = $1", [
        user_id,
    ]);
    return result.rowCount > 0;
};

const getReviewsByLocation = async (location_id) => {
    const query = `
      SELECT 
        r.review_id, 
        r.location_id, 
        r.user_id, 
        r.rating, 
        r.comment, 
        r.created_at,
        u.username,
        u.avatar_url,
        COALESCE(
          (SELECT array_agg(ri.image_url) 
           FROM review_images ri 
           WHERE ri.review_id = r.review_id), 
          ARRAY[]::text[]
        ) as image_urls
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.location_id = $1
      ORDER BY r.created_at DESC;
    `;
    const result = await pool.query(query, [location_id]);
    return result.rows;
};

module.exports = {
    createReview,
    checkLocationExists,
    checkUserExists,
    getReviewsByLocation,
};
