import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import logo from "./logo.png";
import { useContext } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SignInScreen from "./screens/SignInScreen";
import ShippingScreen from "./screens/ShippingScreen";
import SignUpScreen from "./screens/SignUpScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    contextDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    //  window.location.href = "/signin";
  };
  return (
    <BrowserRouter>
      <div className="app-container d-flex flex-column bg-light ">
        <ToastContainer position="bottom-center" limit={1} />
        <header className="shadow">
          <nav className="navbar navbar-inverse p-2">
            <div className="container-fluid">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">
                  <img src={logo} alt="logo" className="logo" />
                </Link>
              </div>
              <ul className="nav gap-4 navbar-right d-flex align-items-center me-5">
                <li>
                  <Link
                    to="/cart"
                    className="btn btn-warning position-relative text-decoration-none text-black fs-5"
                  >
                    Cart <i className="cart fa-solid fa-cart-shopping"></i>
                    {cart.cartItems.length > 0 && (
                      <span className="position-absolute mt-1 top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  {userInfo ? (
                    <div className="dropdown">
                      <Link
                        className="btn btn-secondary dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {userInfo.name}
                      </Link>

                      <ul className="dropdown-menu">
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/orderhistoy">
                            Order History
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="#signout"
                            onClick={signoutHandler}
                          >
                            Sign Out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />

            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <footer className="text-center p-3 bg-dark text-white">
          ©E-Store 2023 | Created by Trupti Yadav | All Rights Reserved
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
