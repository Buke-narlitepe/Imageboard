const express = require("express");
const db = require("./db.js");

const app = express();

app.use(express.static("public"));

app.get("/images", (req, res) => {
    //FIXME: read that from database
    db.getImages()
        .then((data) => {
            res.json(data.rows);
        })
        .catch(function (err) {
            console.log("ERROR: ", err);
        });
});

app.listen(3000, () => {
    console.log("LISTENING...");
});
