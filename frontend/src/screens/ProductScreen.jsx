import React from "react";
import { useParams } from "react-router-dom";

export default function ProductScreen() {
  // Geting the slug from the url and for the display purpose
  /*The useParams hook returns an object of key / value pairs of the dynamic params
   from the current URL that were matched by the < Route path >.
   Child routes inherit all params from their parent routes.*/
  const params = useParams();
  const { slug } = params;
  return <h1>{slug}</h1>;
}
