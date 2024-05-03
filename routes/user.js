const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    const users = await User.find();
    if (!users) {
        res.send({ "message": "No users found" }).status(404);
    } else {
        res.send(users).status(200);
    }
});

router.post("/", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.send({ "message": "Please provide all required fields" }).status(400);
    } else {
        try {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            await newUser.save();
            res.send({ "message": `User, @${req.body.username} was created successfully!!` }).status(201);
        } catch (error) {
            console.error(error);
        };
    };
});

router.delete("/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await User.findByIdAndDelete(productId);

        if (!deletedProduct) {
            res.send({ "message": `User ${productId} not found` }).status(404);
        } else {
            res.send({ "message": `User ${productId} deleted successfully` }).status(200);
        }
    } catch (error) {
        console.error(error.message);
        res.send({ "message": `Couldn't delete user ${productId}` }).status(500);
    }
});

module.exports = router;