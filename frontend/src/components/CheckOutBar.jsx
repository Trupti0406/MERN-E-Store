import React from "react";

export default function CheckOutBar(props) {
  return (
    <div className="row container m-auto checkout-steps">
      <div className={`col fw-bold ${props.step1 ? "active" : ""}`}>Sign-In</div>
      <div className={`col fw-bold ${props.step2 ? "active" : ""}`}>Shipping</div>
      <div className={`col fw-bold ${props.step3 ? "active" : ""}`}>Payment</div>
      <div className={`col fw-bold ${props.step4 ? "active" : ""}`}>Place Order</div>
    </div>
  );
}
