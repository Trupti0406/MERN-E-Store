import React from "react";
import data from "../data";
import "../App.css";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
    <>
      <h2 className="fw-bolder text-center py-3 px-3">Featured Products</h2>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 mb-5 px-3 g-0 justify-content-center ">
        {data.products.map((product) => (
          <div className="col" key={product.slug}>
            <div className="card">
              <Link to={`/product/${product.slug}`}>
                <img
                  src={product.image}
                  className="card-img-top pt-3"
                  alt={product.name}
                />
              </Link>
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
          </div>
        ))}
      </div>
    </>
  );
}
