const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL || "postgres:buke:buke@localhost:5432/imageboard"
);

//TODO: use optional lastImage
module.exports.getImages = function getImages() {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`);
};

module.exports.uploadImages = function uploadImages(
    url,
    username,
    title,
    description
) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [url, username, title, description]
    );
};

module.exports.getImageById = function getImageById(id) {
    return db.query(
        `SELECT *
        FROM images
        WHERE id=$1`,
        [id]
    );
};

module.exports.getMoreImages = function getMoreImages(id) {
    return db.query(
        `SELECT *
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6
        `,
        [id]
    );
};

module.exports.getComments = function getComments(id) {
    return db.query(
        `SELECT *
        FROM comments
        WHERE image_id = $1`,
        [id]
    );
};

module.exports.uploadComments = function uploadComments(
    image_id,
    username,
    comment
) {
    return db.query(
        `INSERT INTO comments (image_id, username, comment)
    VALUES ($1, $2, $3)
    RETURNING *`,
        [image_id, username, comment]
    );
};
