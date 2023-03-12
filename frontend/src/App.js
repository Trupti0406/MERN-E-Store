import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import logo from "./logo.png";
import { useContext } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
function App() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <BrowserRouter>
      <div className="app-container d-flex flex-column bg-light ">
        <header className="shadow">
          <nav className="navbar navbar-inverse p-2">
            <div className="container-fluid">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">
                  <img src={logo} alt="logo" className="logo" />
                </Link>
              </div>
              <ul className="nav gap-4 navbar-right d-flex align-items-center">
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
              </ul>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />

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
