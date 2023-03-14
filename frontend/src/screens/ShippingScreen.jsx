import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

export default function ShippingScreen() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <h1 className="mb-3 fw-bold text-center">Shipping Address</h1>
      <form onSubmit={submitHandler} className="shipping-form mt-3 mb-4">
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlFor="fulname">
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
          <label className="fw-semibold" htmlFor="address">
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
          <label className="fw-semibold" htmlFor="city">
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
          <label className="fw-semibold" htmlFor="email">
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
          <label className="fw-semibold" htmlFor="email">
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
