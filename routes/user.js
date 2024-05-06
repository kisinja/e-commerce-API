const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

//GETTING USERS
router.get("/", async (req, res) => {
    const query = req.query.new;
    const users = query ? await User.find().limit(1): await User.find();
    if (!users) {
        res.send({ "message": "No users found" }).status(404);
    } else {
        res.send(users).status(200);
    }
});

// get user stats
router.get("/stats", async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {$project: {
                month: {$month: "$createdAt"}
            }},
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (error) {
        res.status(500).json(error.message);
        console.error(error.message);
    }
})

router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id);
        const { password, accessToken, ...others } = foundUser._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error.message);
        console.error(error.message);
    }
})

//UPDATING USERS
router.put("/:id", async (req, res) => {
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