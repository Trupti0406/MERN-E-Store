import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import LodingBox from "../components/LodingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const navigate = useNavigate();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      successPay: false,
      loadingPay: false,
    });

  // Paypal reducer
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `https://estore-server.onrender.com/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `https://estore-server.onrender.com/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      navigate("/login");
    }

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      // console.log("order._id");
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(
          "https://estore-server.onrender.com/api/keys/paypal",
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, orderId, userInfo, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LodingBox></LodingBox>
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h2 className="text-center mb-4 mt-1">Order ID: {orderId}</h2>
      <div className="container">
        <div className="row">
          <div className="col-md-8 border-1 ">
            <div className="row d-flex align-items-center justify-content-center">
              <div className="card w-75 mb-2 ">
                <div className="card-body p-2">
                  <h4 className="card-title">Shipping</h4>
                  <p className="card-text" style={{ fontSize: "20px" }}>
                    <strong>Name: </strong>
                    {order.shippingAddress.fullName} <br />
                    <strong>Addres: </strong>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <MessageBox variant="success">
                      Delivered at {order.deliveredAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Delivered</MessageBox>
                  )}
                </div>
              </div>
              <div className="card w-75 mb-2">
                <div className="card-body p-2">
                  <h4 className="card-title">Payment</h4>
                  <p className="card-text" style={{ fontSize: "20px" }}>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <MessageBox variant="success">
                      Paid at {order.paidAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Paid</MessageBox>
                  )}
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
                    {order.orderItems.map((item) => (
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
                    <b>₹ {order.itemsPrice.toFixed(2)}</b>
                  </h5>
                </div>
                <hr />
                <div className="row">
                  <h5>
                    <span className="me-3">Shipping: </span>
                    <b>₹ {order.shippingPrice.toFixed(2)}</b>
                  </h5>
                </div>
                <hr />
                <div className="row">
                  <h5>
                    <span className="me-3 fw-semibold">Order Total: </span>
                    <b>₹ {order.totalPrice.toFixed(2)}</b>
                  </h5>
                </div>
                {!order.isPaid && (
                  <div className="row">
                    {isPending ? (
                      <LodingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          //  create order will run when you click on paypal button
                          createOrder={createOrder}
                          //   onApprove runs when you colpmete the payment, to update the status of payment in the backend
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LodingBox />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
