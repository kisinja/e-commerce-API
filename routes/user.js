const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {verifyTokenAndAuthorization} = require("./verifyToken");

//GETTING USERS
router.get("/", async (req, res) => {
    const users = await User.find();
    if (!users) {
        res.send({ "message": "No users found" }).status(404);
    } else {
        res.send(users).status(200);
    }
});

//UPDATING USERS
router.put("/:id", verifyTokenAndAuthorization, async(req, res) => {
    if (req.body.password) {
        const salt = bcrypt.genSalt(10);
        req.body.password = bcrypt.hash(req.body.password, salt);

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    }
});

module.exports = router;