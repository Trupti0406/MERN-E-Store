import express from "express";
import expressAsyncHandler from 'express-async-handler'
import Product from "../models/productModel.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// GET API FOR CATEGORIES
productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {

    // to return unique categoriea and not duplicate them
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);





// Backend API for returning the product info based on the slug of the product
productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.send(404).send({ message: "Product Not Found" });
  }
});

// Backend api for add to cart product id
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.send(404).send({ message: "Product Out Of Stock" });
  }
});

export default productRouter;
