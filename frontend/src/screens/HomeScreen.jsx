import React, { useEffect, useReducer } from "react";
import "../App.css";
import axios from "axios";
import Product from "../components/Product";
import LodingBox from "../components/LodingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
// import logger from "use-reducer-logger";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return { state };
  }
};

export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  //   const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      //before sending ajax request we will send a loading message
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        //   if I successfully get the products from backend then we will dispatch fetch success
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
      // sending ajax request to 'api/products' and storing the reult in "resutl" variable
      //   setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <>
      <h2 className="fw-bolder text-center py-3 px-3">Featured Products</h2>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 mb-5 px-3 g-0 justify-content-center ">
        {loading ? (
          <LodingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          products.map((product) => (
            <div className="col" key={product.slug}>
              <Product product={product} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
