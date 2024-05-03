const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.find({ username: req.body.username });
        if (!user) {
            res.status(401).json("Forbidden: No such user found!!");
        }
        const validPassword = await bcrypt.compare(req.body.password, user[0].password);
        if (!validPassword) {
            res.status(401).json("Wrong credentials");
        }
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, "elvis", { expiresIn: "3d" });
        const { password, ...otherDetails } = user[0]._doc;
        res.status(200).json({ ...otherDetails, accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

module.exports = router;