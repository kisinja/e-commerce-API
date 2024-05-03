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

router.put("/:id", async (req, res) => {
    
});

module.exports = router;