import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };
  return (
    <form className="navbar-form navbar-left d-flex" onSubmit={submitHandler}>
      <div className="form-group">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search products..."
          name="search"
          aria-label="Search products"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button className="btn btn-warning search-button" type="submit">
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
}
