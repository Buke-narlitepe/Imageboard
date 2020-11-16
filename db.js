const spicedPg = require("spiced-pg");

// TODO: change connection string, to connect to petition db
const db = spicedPg("postgres:buke:buke@localhost:5432/imageboard");

module.exports.getImages = function getImages() {
    return db.query(
        `SELECT *
        FROM images`
    );
};
