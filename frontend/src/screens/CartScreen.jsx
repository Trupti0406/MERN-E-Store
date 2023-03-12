import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";

export default function CartScreen() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
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
            <MessageBox>
              Cart is Empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
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
                        <button className="delete d-flex align-items-center justify-content-center">
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
                          <button disabled={item.quantity === 1}>-</button>
                          <span
                            className="py-1 px-3 border"
                            id="quantity1"
                            style={{ width: "4rem" }}
                          >
                            {" "}
                            {item.quantity}{" "}
                          </span>
                          <button
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
          <div className="col summary mb-3">
            <div className="card text-center">
              <h4 className="card-header fw-bolder px-2 py-3">Summary</h4>
              <div className="card-body text-start">
                <div className="row">
                  <h5>
                    <span className="me-3">
                      {" "}
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}
                      items):
                    </span>
                    <b>
                      ₹{" "}
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
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
                    className="btn fw-bold"
                    disabled={cartItems.length === 0}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
