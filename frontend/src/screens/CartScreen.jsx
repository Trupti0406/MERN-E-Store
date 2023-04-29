import axios from "axios";
import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
// import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import "../App.css";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `https://e-store-p9j0.onrender.com/api/products/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
    }
    contextDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    contextDispatch({ type: "CART_REMOVE_ITME", payload: item });
  };

  const checkOutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  return (
    <>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h2 className="text-center">Shopping Cart</h2>

      <div className="container text-center mt-4">
        <div className="mainContainer row justify-content-center gap-5">
          {/* <!-- Cart Items Section --> */}
          {cartItems.length === 0 ? (
            <div className="mt-md-5 d-flex align-items-center justify-content-center flex-column">
              <div className="position-relative">
                <i className="cart-empty fa-solid fa-cart-shopping fs-1 h1"></i>
                <span className="p-4 position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger">
                  <span className="fw-bolder fs-2">!</span>
                </span>
              </div>

              <h2>Your Cart is Empty :( </h2>
              <h5 className="mt-2">Let's go buy something</h5>
              <button className="px-5 py-3 mt-3 ">
                <Link
                  to="/"
                  className="text-black text-decoration-none h5 fw-bold"
                >
                  Shop Now
                </Link>
              </button>
            </div>
          ) : (
            // <MessageBox>
            //   Cart is Empty. <Link to="/">Go Shopping</Link>
            // </MessageBox>
            <div className="items col-8 mb-3 ">
              <div className="items-holder px-1">
                {cartItems.map((item) => (
                  <div
                    className="items-row row"
                    key={item._id}
                    style={{ borderBottom: "1px solid gray" }}
                  >
                    <div className="innercols col">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-img"
                      />
                    </div>
                    <div className="innercols col">
                      <div className="product-info">
                        <h4>
                          <Link
                            className="text-decoration-none text-black"
                            to={`/product/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </h4>
                        <h5 className="cart-price text-muted">
                          ₹ {item.price}
                        </h5>
                        <button
                          onClick={() => removeItemHandler(item)}
                          className="delete d-flex align-items-center justify-content-center"
                        >
                          <span>Delete Item</span>
                          <i className="fas fa-trash-alt h6 mx-1 mt-md-1"></i>
                        </button>
                      </div>
                    </div>
                    <div className="innercols col">
                      <div>
                        <h4 className="q-text text-black">Quantity</h4>
                        <br />
                        <div className="d-flex gap-1">
                          <button
                            onClick={() =>
                              updateCartHandler(item, item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <span
                            className="py-1 px-3 border"
                            id="quantity1"
                            style={{ width: "4rem" }}
                          >
                            {" "}
                            {item.quantity}{" "}
                          </span>
                          <button
                            onClick={() =>
                              updateCartHandler(item, item.quantity + 1)
                            }
                            disabled={item.quantity === item.countInStock}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Summary Section */}
          {cartItems.length === 0 ? (
            ""
          ) : (
            <div className="col summary mb-3">
              <div className="card text-center">
                <h4 className="card-header fw-bolder px-2 py-3">Summary</h4>
                <div className="card-body text-start">
                  <div className="row">
                    <h5>
                      <span className="me-3">
                        {" "}
                        Subtotal (
                        {cartItems.reduce((a, c) => a + c.quantity, 0)}
                        items):
                      </span>
                      <b>
                        ₹{" "}
                        {cartItems.reduce(
                          (a, c) => a + c.price * c.quantity,
                          0
                        )}
                      </b>
                    </h5>
                  </div>
                  {/* <div className="row">
                  <div className="col fw-bold text-muted">Shipping</div>
                  <div className="col fw-bold text-muted shipping-amt">₹ 0</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col total fw-bold">Estimated Total</div>
                  <div className="col total total-amt fw-bold">₹ 4297</div>
                </div> */}

                  <hr />
                  <div className="d-grid">
                    <button
                      onClick={checkOutHandler}
                      className="btn fw-bold"
                      disabled={cartItems.length === 0}
                    >
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
