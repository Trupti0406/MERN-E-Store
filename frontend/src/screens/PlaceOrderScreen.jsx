import Axios from "axios";
import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { Store } from "../Store";
import { useEffect } from "react";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils";
import LodingBox from "../components/LodingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 1000 ? 150 : 50;

  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await Axios.post(
        "https://estore-server.onrender.com/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        },
        // By having this option, this particular api is authenticated,
        // means, in the server I can detect if the request is coming from a logged in user or hacker
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      contextDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(error));
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  return (
    <>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h2 className="text-center mb-4 mt-1 fw-bolder text-center py-3 px-3">
        Review Order
      </h2>
      <div className="container">
        <div className="row">
          <div className="col-md-8 border-1">
            <div className="row d-flex align-items-center justify-content-center">
              <div className="card w-75 mb-2 ">
                <div className="card-body p-2">
                  <h4 className="card-title">Shipping</h4>
                  <p className="card-text" style={{ fontSize: "20px" }}>
                    <strong>Name: </strong>
                    {cart.shippingAddress.fullName} <br />
                    <strong>Addres: </strong>
                    {cart.shippingAddress.address}, {cart.shippingAddress.city},
                    {cart.shippingAddress.postalCode},{" "}
                    {cart.shippingAddress.country}
                  </p>
                  <Link to="/shipping">Edit</Link>
                </div>
              </div>
              <div className="card w-75 mb-2">
                <div className="card-body p-2">
                  <h4 className="card-title">Payment</h4>
                  <p className="card-text" style={{ fontSize: "20px" }}>
                    <strong>Method: </strong>
                    {cart.paymentMethod}
                  </p>
                  <Link to="/payment">Edit</Link>
                </div>
              </div>
              <div className="card mb-2 w-75">
                <div className="card-body">
                  <div className="card-title h4 text-center">Items</div>
                  <ListGroup variant="flush">
                    <div className="row align-items-center">
                      <div className="col-md-6 fw-bold h5">Product</div>
                      <div className="col-md-3 fw-bold h5">Quantity</div>
                      <div className="col-md-3 fw-bold h5">Price</div>
                    </div>
                    <hr />
                    {cart.cartItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid rounded img-thumbnail"
                            ></img>{" "}
                            <Link
                              to={`/product/${item.slug}`}
                              className="ms-2 fw-semibold "
                            >
                              {item.name}
                            </Link>
                          </div>
                          <div className="col-md-3">
                            <span className="fw-semibold px-3 py-2 bg-warning rounded">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="col-md-3">
                            {" "}
                            <span className="fw-semibold px-3 py-2 bg-warning rounded">
                              ₹ {item.price}
                            </span>{" "}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Link to="/cart">Edit</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center">
              <h4 className="card-header fw-bolder px-2 py-3">Order Summary</h4>
              <div className="card-body text-start">
                <div className="row">
                  <h5>
                    <span className="me-3">Items: </span>
                    <b>₹ {cart.itemsPrice.toFixed(2)}</b>
                  </h5>
                </div>
                <hr />
                <div className="row">
                  <h5>
                    <span className="me-3">Shipping: </span>
                    <b>₹ {cart.shippingPrice.toFixed(2)}</b>
                  </h5>
                </div>
                <hr />
                <div className="row">
                  <h5>
                    <span className="me-3 fw-semibold">Order Total: </span>
                    <b>₹ {cart.totalPrice.toFixed(2)}</b>
                  </h5>
                </div>

                <hr />
                <div className="d-grid">
                  <button
                    id="login-btn"
                    className="fw-bold px-3 py-2"
                    onClick={placeOrderHandler}
                    disabled={cart.cartItems.length === 0}
                  >
                    Place Order
                  </button>
                </div>
                {loading && <LodingBox />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
