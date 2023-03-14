import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../logo.png";
import { Store } from "../Store";
import { getError } from "../utils";

export default function SignInScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInURL = new URLSearchParams(search).get("redirect");
  const redirect = redirectInURL ? redirectInURL : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // sending ajax request to backend for '/api/user/signin'
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      contextDispatch({
        type: "USER_SIGNIN",
        payload: data,
      });
      // console.log(data);
      // storing the userInfo in localstorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <form action="" className="login-form mt-3 mb-4" onSubmit={submitHandler}>
        <img src={logo} alt="logo" style={{ width: "180px" }} />
        <p className="mt-4 fw-bold">Please login to your account</p>
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlFor="email">
            E-mail:
          </label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="d-flex flex-column mb-4">
          <label className="fw-semibold" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id="login-btn" className="fw-bold">
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
