import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import logo from "./logo.png";
function App() {
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
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
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
