import axios from "axios";
import React, { useContext, useState } from "react";
import { useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "https://e-store-server-ggh5.onrender.com/api/users/profile",
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      contextDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
      });
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h2 className="text-center mb-4 mt-1">My Profile</h2>

      <form action="" className="login-form mt-3 mb-4" onSubmit={submitHandler}>
        {/* <img src={logo} alt="logo" style={{ width: "180px" }} /> */}
        <div className="d-flex flex-column mb-3">
          <label className="fw-semibold" htmlFor="name">
            Name:
          </label>
          <input
            value={name}
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
            value={email}
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
            value={password}
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
            value={confirmPassword}
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="d-grid">
          <button id="login-btn" className="fw-bold">
            Update
          </button>
        </div>
      </form>
    </>
  );
}
