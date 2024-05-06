const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.post("/", async (req, res) => {
    const newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        img: req.body.img,
        categories: req.body.categories,
        size: req.body.size,
        color: req.body.color,
        price: req.body.price
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
        console.error(error.message);
    }
});

router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let productList;

        if (qNew) {
            productList = await Product.find().sort({ createdAt: -1 }).limit(5);
        }
        else if (qCategory) {
            productList = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            productList = await Product.find();
        }

        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
        console.error(error.message);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
        console.error(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
        console.error(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (error) {
        res.status(500).json(error);
        console.error(error.message);
    }
});

module.exports = router;