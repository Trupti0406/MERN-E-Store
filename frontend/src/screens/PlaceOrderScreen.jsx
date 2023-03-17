import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Store } from "../Store";
import CheckOutBar from "../components/CheckOutBar";
import { useEffect } from "react";

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 1000 ? 150 : 50;

  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

  const placeOrderHandler = async () => {};
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  return (
    <>
      <CheckOutBar step1 step2 step3 step4></CheckOutBar>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h2 className="text-center mb-4 mt-1">Review Order</h2>
      <div className="container">
        <div className="row">
          <div className="col-8 border-1">
            <div className="row">
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

              <Card className="mb-2 w-75">
                <Card.Body>
                  <Card.Title className="h4">Items</Card.Title>
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                          <Col md={6}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid rounded img-thumbnail"
                            ></img>{" "}
                            <Link to={`/product/${item.slug}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={3}>
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md={3}>₹ {item.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Link to="/cart">Edit</Link>
                </Card.Body>
              </Card>
            </div>
          </div>

          <div className="col-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
