import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import LodingBox from "../components/LodingBox";
import MessageBox from "../components/MessageBox";
import Rating from "../components/Rating";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return { state };
  }
};
export default function ProductScreen() {
  // Geting the slug from the url and for the display purpose
  /*The useParams hook returns an object of key / value pairs of the dynamic params
   from the current URL that were matched by the < Route path >.
   Child routes inherit all params from their parent routes.*/
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });
  //   const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      //before sending ajax request we will send a loading message
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        //   if I successfully get the products from backend then we will dispatch fetch success
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
      // sending ajax request to 'api/products' and storing the reult in "resutl" variable
      //   setProducts(result.data);
    };
    fetchData();
    // Putting slug as an argument in our useeffect so when the user clicks on a certain product the product screen gets deispatched(loaded)
  }, [slug]);

  //To add items to the cart I need to dispatch action on the react context, thats wht getting context here

  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    // If current product exists in the cart or not
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    // If it exists then we need to increase the quantity by 1
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, the product is out of stock");
      return;
    }

    contextDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  return loading ? (
    <LodingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container row bg-white m-auto mt-4 py-5 shadow">
      <div className="col d-flex justify-content-center">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="col d-flex flex-column align-items-start justify-content-start ">
        <Helmet>
          <title>{product.name}</title>
        </Helmet>
        <h1>{product.name}</h1>
        <div className="fs-5">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>
        <h4 className="mt-3 ">Price: ₹ {product.price}/-</h4>
        <h5 className="mt-3">
          <b>Description:</b> <br /> {product.description}
        </h5>
      </div>
      <div className="col">
        <div className="card text-center m-auto" style={{ width: "15rem" }}>
          <div className="card-body">
            <h5 className="card-title">Price: ₹ {product.price}/-</h5>
            <hr />

            <div className="d-flex justify-content-center gap-3">
              <h5>Status:</h5>
              {product.countInStock > 0 ? (
                <span className="badge text-bg-success my-auto p-2">
                  In Stock
                </span>
              ) : (
                <span className="badge text-bg-danger ny-auto p-2">
                  Out Of Stock
                </span>
              )}
            </div>
            <hr />
            {product.countInStock > 0 && (
              <button
                className="d-flex align-items-center px-3 py-2"
                onClick={addToCartHandler}
              >
                <i className="add-to-cart fa-solid fa-cart-shopping me-2"></i>
                <span className="fw-bold">Add To Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
