const express = require("express");

const db = require("./db");

const s3 = require("./middlewares/s3.js");
const uploader = require("./middlewares/uploader.js");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/images/:id", (req, res) => {
    db.getImageById(req.params.id)
        .then((data) => {
            res.json(data.rows[0]);
        })
        .catch(function (err) {
            console.log("ERROR: ", err);
        });
});

//TODO: accept parameter for id of last image currently rendered on screen (query parameter)
//you wont have a last image id for the initial request.
//TODO: send client array of images + id of very last image, so client has all info to decide if to show load more button
app.get("/images", (req, res) => {
    if (!req.query.id) {
        db.getImages()
            .then((data) => {
                res.json(data.rows);
            })
            .catch(function (err) {
                console.log("ERROR: ", err);
            });
    } else {
        db.getMoreImages(req.query.id)
            .then((data) => {
                res.json(data.rows);
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

app.post("/upload", uploader.single("file"), s3, (req, res) => {
    const { url, username, title, description } = req.body;

    db.uploadImages(url, username, title, description).then((data) => {
        res.json(data.rows);
    });
});

app.get("/comments/:id", (req, res) => {
    db.getComments(req.params.id)
        .then((data) => {
            res.json(data.rows);
        })
        .catch(function (err) {
            console.log("ERROR: ", err);
        });
});

app.post("/comments", (req, res) => {
    const { image_id, username, comment } = req.body;

    db.uploadComments(image_id, username, comment).then((data) => {
        res.json(data.rows[0]);
    });

    //TODO: get all the properties of the comment from the req.body
    //and save it to the database
});

app.listen(process.env.PORT || 3000, () => console.log("LISTENING..."));
