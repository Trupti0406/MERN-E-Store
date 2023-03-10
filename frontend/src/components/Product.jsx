import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

export default function Product(props) {
  const { product } = props;
  return (
    <div className="card">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top pt-3"
          alt={product.name}
        />
      </Link>
      <Rating rating={product.rating} numReviews={product.numReviews} />
      <div className="card-body text-center">
        <Link
          to={`/product/${product.slug}`}
          className="text-decoration-none text-black"
        >
          <h5 className="card-title fw-bold">{product.name}</h5>
        </Link>
        <p className="price fw-semibold h5">₹ {product.price}</p>
        <p className="card-text">{product.description}</p>
        <button className="d-flex align-items-center px-3 py-2">
          <i className="add-to-cart fa-solid fa-cart-shopping me-2"></i>
          <span className="fw-bold">Add To Cart</span>
        </button>
      </div>
    </div>
  );
}
