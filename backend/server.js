import express from "express";
import data from "./data.js";
const port = process.env.PORT || 5000;

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

app.listen(port, () => {
  console.log(`Sever is running at http://localhost:${port}`);
});
