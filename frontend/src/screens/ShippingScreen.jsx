import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckOutBar from "../components/CheckOutBar";
import { Store } from "../Store";

export default function ShippingScreen() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    contextDispatch({
      type: "SAVE_SHIPPING ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate("/payment");
  };
  return (
    <>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckOutBar step1 step2></CheckOutBar>
      <h2 className="mb-3 fw-bold text-center">Shipping Address</h2>
      <form onSubmit={submitHandler} className="shipping-form mt-3 mb-4">
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlhtmlFor="fulname">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlhtmlFor="address">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlhtmlFor="city">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlhtmlFor="email">
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlhtmlFor="email">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div className="d-grid">
          <button id="login-btn" className="fw-bold">
            Continue
          </button>
        </div>
      </form>
    </>
  );
}
