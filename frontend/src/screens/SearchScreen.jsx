import axios from "axios";
import React, { useReducer, useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link,
  NavLink,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import LodingBox from "../components/LodingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        // page: action.payload.page,
        // pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  // to get the query string
  const searchParams = new URLSearchParams(search); //search?category=Pants
  // to get the category from search
  const category = searchParams.get("category") || "all";
  const query = searchParams.get("query") || "all";
  const price = searchParams.get("price") || "all";
  const rating = searchParams.get("rating") || "all";
  const order = searchParams.get("order") || "newest";
  //   const page = searchParams.get("page") || 1;

  const [{ loading, error, products, countProducts }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, price, query, rating]);

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
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    // const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}`;
  };

  return (
    <>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <div className="search container">
        <div className="row justify-content-center">
          <div className="col-md-3">
            <h3>Department</h3>
            <div>
              <ul>
                <li>
                  <Link
                    className={"all" === category ? "text-bold" : ""}
                    to={getFilterUrl({ category: "all" })}
                  >
                    Any
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      className={c === category ? "text-bold" : ""}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Price</h3>
              <ul>
                <li>
                  <Link
                    className={"all" === price ? "text-bold" : ""}
                    to={getFilterUrl({ price: "all" })}
                  >
                    Any
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      to={getFilterUrl({ price: p.value })}
                      className={p.value === price ? "text-bold" : ""}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Avg. Customer Review</h3>
              <ul>
                {ratings.map((r) => (
                  <li key={r.name}>
                    <Link
                      to={getFilterUrl({ rating: r.rating })}
                      className={
                        `${r.rating}` === `${rating}` ? "text-bold" : ""
                      }
                    >
                      <Rating caption={" & up"} rating={r.rating}></Rating>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={getFilterUrl({ rating: "all" })}
                    className={rating === "all" ? "text-bold" : ""}
                  >
                    <Rating caption={" & up"} rating={0}></Rating>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-9">
            {loading ? (
              <LodingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <>
                <div className="row justify-content-between mb-3">
                  <div className="col-md-6">
                    <div>
                      {countProducts === 0 ? "No" : countProducts} Results
                      {query !== "all" && " : " + query}
                      {category !== "all" && " : " + category}
                      {price !== "all" && " : Price " + price}
                      {rating !== "all" && " : Rating " + rating + " & up"}
                      {query !== "all" ||
                      category !== "all" ||
                      rating !== "all" ||
                      price !== "all" ? (
                        <div
                          className="btn btn-warning"
                          type="button"
                          onClick={() => navigate("/search")}
                        >
                          <i className="fas fa-times-circle"></i>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col text-end">
                    Sort by{" "}
                    <select
                      value={order}
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price: High to Low</option>
                      <option value="toprated">Avg. Customer Reviews</option>
                    </select>
                  </div>
                </div>
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}

                <div className="row">
                  {products.map((product) => (
                    <div className="col-sm-6 col-lg-3 mb-3" key={product._id}>
                      <Product product={product}></Product>
                    </div>
                  ))}
                </div>

                {/* <div>
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: "/search",
                      seacrh: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <div
                      className={Number(page) === x + 1 ? "text-bold btn" : ""}
                      variant="light"
                      type="button"
                    >
                      {x + 1}
                    </div>
                  </Link>
                ))}
              </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
