import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import Rating from "./Rating";

export default function Product(props) {
  const { product } = props;

  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    // If current product exists in the cart or not
    const existItem = cartItems.find((x) => x._id === product._id);
    // If it exists then we need to increase the quantity by 1
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
    }
    contextDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
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

        {product.countInStock === 0 ? (
          <button className="d-flex align-items-center px-3 py-2" disabled>
            <span className="fw-bold">Out of Stock</span>
          </button>
        ) : (
          <button
            className="d-flex align-items-center px-3 py-2"
            onClick={() => addToCartHandler(product)}
          >
            <i className="add-to-cart fa-solid fa-cart-shopping me-2"></i>
            <span className="fw-bold">Add To Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
