import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import logo from "../logo.png";

export default function SignInScreen() {
  const { search } = useLocation();
  const redirectInURL = new URLSearchParams(search).get("redirect");
  const redirect = redirectInURL ? redirectInURL : "/";
  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <form action="" className="login-form mt-3 mb-4">
        <img src={logo} alt="logo" style={{ width: "180px" }} />
        <p className="mt-4 fw-bold">Please login to your account</p>
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlFor="email">
            E-mail:
          </label>
          <input type="email" name="" id="email" required />
        </div>
        <div className="d-flex flex-column mb-4">
          <label className="fw-semibold" htmlFor="password">
            Password:
          </label>
          <input type="password" name="" id="password" required />
        </div>
        <div id="liveAlertPlaceholder"></div>
        <button id="login-btn" className="fw-bold" onclick="loginAlert()">
          Login
        </button>
        <div className="">
          <p className="mt-3 fw-bold">
            New Customer?{" "}
            <Link to={`/signup?redirect=${redirect}`}>
              Create Your Account.
            </Link>{" "}
          </p>
        </div>
      </form>
    </>
  );
}
