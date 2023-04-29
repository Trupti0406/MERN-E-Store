import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import logo from "../logo.png";
import { Store } from "../Store";
import { getError } from "../utils";

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInURL = new URLSearchParams(search).get("redirect");
  const redirect = redirectInURL ? redirectInURL : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: contextDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      // sending ajax request to backend for '/api/user/signin'
      const { data } = await Axios.post(
        "https://e-store-p9j0.onrender.com/api/users/signup",
        {
          name,
          email,
          password,
        }
      );
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
        <title>Sign Up</title>
      </Helmet>
      <form action="" className="login-form mt-3 mb-4" onSubmit={submitHandler}>
        <h2 className="mt-4 fw-bold">Sign Up</h2>
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlFor="Confirm password">
            Confirm Password:
          </label>
          <input
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="d-grid">
          <button id="login-btn" className="fw-bold">
            Create Account
          </button>
        </div>

        <div className="">
          <p className="mt-3 fw-bold">
            Already have an account?{" "}
            <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>{" "}
          </p>
        </div>
      </form>
    </>
  );
}
