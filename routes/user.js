const express = require("express");
const router = express.Router();

router.get("/usertest", (req, res) => {
    res.send({ "message": "User test is successful" }).status(200);
});

router.post("/userPostTest", (req, res) => {
    const username = req.body.username;
    res.send({ "message": `User ${username} created successfully` }).status(200);
    console.log(username);
});

router.delete("/userDeleteTest", (req, res) => {
    const { username } = req.body;
    res.send({ "message": `User ${username} deleted successfully` }).status(200);
});

module.exports = router;