import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import logo from "./logo.png";
import { useContext, useEffect } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SignInScreen from "./screens/SignInScreen";
import ShippingScreen from "./screens/ShippingScreen";
import SignUpScreen from "./screens/SignUpScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { useState } from "react";
import axios from "axios";
import { getError } from "./utils";
import SearchBar from "./components/SearchBar";

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    contextDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "app-container d-flex flex-column bg-light active-container"
            : "app-container d-flex flex-column bg-light"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header className="shadow">
          <nav className="navbar navbar-inverse p-2">
            <div className="container-fluid">
              <div className="navbar-header">
                <div
                  className="btn btn-warning me-5"
                  onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                >
                  <i className="fas fa-bars"></i>
                </div>
                <Link className="navbar-brand" to="/">
                  <img src={logo} alt="logo" className="logo" />
                </Link>
              </div>
              <SearchBar />
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
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <div className="nav flex-column text-white w-100 p-2">
            <div className="nav-item">
              <strong>Categories</strong>
            </div>
            {categories.map((category) => (
              <div className="nav-item" key={category}>
                <NavLink
                  to={{ pathname: "/search", search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <div className="nav-link">{category}</div>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/orderhistoy" element={<OrderHistoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />

            <Route path="/shipping" element={<ShippingScreen />} />

            <Route path="/payment" element={<PaymentMethodScreen />} />
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
