import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
const port = process.env.PORT || 5000;

// To fectch variables from .env file
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.get("/api/products", (req, res) => {
  res.send(data.products);
});

// Backend API for returning the product info based on the slug of the product
app.get("/api/products/slug/:slug", (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.send(404).send({ message: "Product Not Found" });
  }
});

// Backend api for add to cart product id
app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.send(404).send({ message: "Product Out Of Stock" });
  }
});

app.listen(port, () => {
  console.log(`Sever is running at http://localhost:${port}`);
});
