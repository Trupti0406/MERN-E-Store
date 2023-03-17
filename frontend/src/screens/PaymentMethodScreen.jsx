import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckOutBar from "../components/CheckOutBar";
import { Store } from "../Store";

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    contextDispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentMethodName,
    });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  return (
    <>
      <CheckOutBar step1 step2 step3></CheckOutBar>
      <div className="payment container">
        <Helmet>
          <title>Payment method</title>
        </Helmet>
        <h2 className="text-center mb-4 mt-1">Select Payment Method</h2>
        <form onSubmit={submitHandler}>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              id="PayPal"
              value="PayPal"
              type="radio"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label
              className="form-check-label fw-semibold"
              htmlFor="flexRadioDefault1"
            >
              PayPal
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              id="Stripe"
              value="Stripe"
              type="radio"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label
              className="form-check-label fw-semibold"
              htmlFor="flexRadioDefault1"
            >
              Stripe
            </label>
          </div>
          <div className="d-grid">
            <button id="login-btn" className="fw-bold px-4 py-2">
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
